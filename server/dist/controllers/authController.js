import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/db.js';
const JWT_SECRET = process.env.JWT_SECRET || 'yachay_lee_super_secret_jwt_key_2026_educacion_peru';
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Debes proporcionar correo electrónico y contraseña.' });
            return;
        }
        const user = await db.users.findByEmail(email);
        if (!user) {
            res.status(401).json({ error: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            res.status(401).json({ error: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
            return;
        }
        // Generate JWT token (expires in 7 days)
        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }, JWT_SECRET, { expiresIn: '7d' });
        // If role is student, get student profile
        let studentProfile = null;
        if (user.role === 'student') {
            studentProfile = await db.students.getByUserId(user.id);
        }
        // If role is parent, get children profiles
        let childrenProfiles = [];
        if (user.role === 'parent') {
            childrenProfiles = await db.students.getByParentId(user.id);
        }
        const { password_hash, ...safeUser } = user;
        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: safeUser,
            studentProfile,
            childrenProfiles
        });
    }
    catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar el inicio de sesión.' });
    }
};
export const register = async (req, res) => {
    try {
        const { name, email, password, role, phone, avatar, grade, age, classroom_id } = req.body;
        if (!name || !email || !password || !role) {
            res.status(400).json({ error: 'Todos los campos obligatorios deben ser completados.' });
            return;
        }
        const existingUser = await db.users.findByEmail(email);
        if (existingUser) {
            res.status(409).json({ error: 'Ya existe una cuenta registrada con este correo electrónico.' });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const newUser = await db.users.create({
            name,
            email,
            password_hash,
            role,
            phone,
            avatar
        });
        let studentProfile = null;
        if (role === 'student' && classroom_id) {
            studentProfile = await db.students.create({
                user_id: newUser.id,
                classroom_id: Number(classroom_id),
                first_name: name.split(' ')[0] || name,
                last_name: name.split(' ').slice(1).join(' ') || 'Estudiante',
                age: Number(age) || 7,
                grade: grade || '1° Primaria',
                reading_level: 'Inicial',
                avatar: avatar || '🦊'
            });
        }
        const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: newUser,
            studentProfile
        });
    }
    catch (error) {
        console.error('Error en register:', error);
        res.status(500).json({ error: 'Error interno al registrar usuario.' });
    }
};
export const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'No autorizado' });
            return;
        }
        const user = await db.users.findById(req.user.id);
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        let studentProfile = null;
        if (user.role === 'student') {
            studentProfile = await db.students.getByUserId(user.id);
        }
        let childrenProfiles = [];
        if (user.role === 'parent') {
            childrenProfiles = await db.students.getByParentId(user.id);
        }
        res.json({
            user,
            studentProfile,
            childrenProfiles
        });
    }
    catch (error) {
        console.error('Error en getMe:', error);
        res.status(500).json({ error: 'Error al obtener datos del usuario.' });
    }
};
export const recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: 'Debe ingresar un correo electrónico.' });
            return;
        }
        const user = await db.users.findByEmail(email);
        if (!user) {
            // Para seguridad en SaaS, devolvemos un mensaje positivo aunque no exista el email
            res.json({
                message: 'Si el correo está registrado, se han enviado las instrucciones para restablecer tu contraseña.'
            });
            return;
        }
        // Generate recovery token
        const resetToken = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({
            message: 'Se ha generado la solicitud de recuperación exitosamente.',
            resetToken, // Facilitar prueba en entorno educativo
            email: user.email
        });
    }
    catch (error) {
        console.error('Error en recoverPassword:', error);
        res.status(500).json({ error: 'Error en recuperación de contraseña.' });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { token, email, newPassword } = req.body;
        if ((!token && !email) || !newPassword) {
            res.status(400).json({ error: 'Faltan parámetros requeridos para el restablecimiento.' });
            return;
        }
        let targetEmail = email;
        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                targetEmail = decoded.email;
            }
            catch (e) {
                res.status(400).json({ error: 'El enlace o token de recuperación ha caducado o es inválido.' });
                return;
            }
        }
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, salt);
        const updated = await db.users.updatePassword(targetEmail, newHash);
        if (!updated) {
            res.status(404).json({ error: 'No se encontró el usuario para actualizar.' });
            return;
        }
        res.json({ message: 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión.' });
    }
    catch (error) {
        console.error('Error en resetPassword:', error);
        res.status(500).json({ error: 'Error al restablecer contraseña.' });
    }
};
