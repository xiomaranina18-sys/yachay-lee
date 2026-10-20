import pg from 'pg';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialUsers, initialClassrooms, initialStudents, initialParentStudent, initialActivities, initialProgressAttempts, initialAIEvaluations, initialNotifications, initialBadges, initialWeeklyGoals, initialBooks, initialRewardItems } from './seedData.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { Pool } = pg;
let isPostgres = false;
let pool = null;
const dataDir = path.join(__dirname, '..', '..', 'data');
const storeFilePath = path.join(dataDir, 'store.json');
// Local fallback store
let localStore = {
    users: [],
    classrooms: [],
    students: [],
    parent_student: [],
    activities: [],
    activity_assignments: [],
    progress_attempts: [],
    ai_evaluations: [],
    notifications: [],
    badges: [],
    weekly_goals: [],
    books: [],
    reward_items: []
};
function saveLocalStore() {
    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(storeFilePath, JSON.stringify(localStore, null, 2), 'utf-8');
    }
    catch (err) {
        console.error('[DB] Error guardando archivo store.json:', err);
    }
}
function loadLocalStore() {
    try {
        if (fs.existsSync(storeFilePath)) {
            const data = fs.readFileSync(storeFilePath, 'utf-8');
            localStore = JSON.parse(data);
            // Ensure new arrays exist in legacy store.json
            if (!localStore.badges)
                localStore.badges = [...initialBadges];
            if (!localStore.weekly_goals)
                localStore.weekly_goals = [...initialWeeklyGoals];
            if (!localStore.books)
                localStore.books = [...initialBooks];
            if (!localStore.reward_items)
                localStore.reward_items = [...initialRewardItems];
            return true;
        }
    }
    catch (err) {
        console.warn('[DB] No se pudo cargar store.json, se creará uno nuevo.');
    }
    return false;
}
async function seedDataToLocalStore() {
    const salt = await bcrypt.genSalt(10);
    localStore.users = await Promise.all(initialUsers.map(async (u) => {
        const password_hash = await bcrypt.hash(u.password, salt);
        return {
            id: u.id,
            name: u.name,
            email: u.email,
            password_hash,
            role: u.role,
            phone: u.phone,
            avatar: u.avatar,
            created_at: new Date().toISOString()
        };
    }));
    localStore.classrooms = initialClassrooms.map(c => ({
        ...c,
        created_at: new Date().toISOString()
    }));
    localStore.students = initialStudents.map(s => ({
        ...s,
        created_at: new Date().toISOString()
    }));
    localStore.parent_student = [...initialParentStudent];
    localStore.activities = initialActivities.map(a => ({
        id: a.id,
        title: a.title,
        category: a.category,
        level: a.level,
        description: a.description,
        content_json: a.content,
        points: a.points,
        created_at: new Date().toISOString()
    }));
    localStore.progress_attempts = [...initialProgressAttempts];
    localStore.ai_evaluations = [...initialAIEvaluations];
    localStore.notifications = [...initialNotifications];
    localStore.badges = [...initialBadges];
    localStore.weekly_goals = [...initialWeeklyGoals];
    localStore.books = [...initialBooks];
    localStore.reward_items = [...initialRewardItems];
    saveLocalStore();
    console.log('✅ [Yachay Lee DB] Datos semilla cargados exitosamente en el almacén local.');
}
export async function initDatabase() {
    const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/yachay_lee';
    try {
        pool = new Pool({
            connectionString: dbUrl,
            connectionTimeoutMillis: 2000
        });
        const client = await pool.connect();
        console.log('🚀 [Yachay Lee DB] Conexión establecida con PostgreSQL en:', dbUrl);
        isPostgres = true;
        // Load and run schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
            await client.query(schemaSql);
            console.log('📄 [Yachay Lee DB] Tablas PostgreSQL verificadas.');
        }
        // Check if seed needed
        const usersCountRes = await client.query('SELECT COUNT(*) FROM users');
        if (parseInt(usersCountRes.rows[0].count, 10) === 0) {
            console.log('🌱 [Yachay Lee DB] Base de datos PostgreSQL vacía. Sembrando datos iniciales...');
            const salt = await bcrypt.genSalt(10);
            for (const u of initialUsers) {
                const passHash = await bcrypt.hash(u.password, salt);
                await client.query('INSERT INTO users (id, name, email, password_hash, role, phone, avatar) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING', [u.id, u.name, u.email, passHash, u.role, u.phone, u.avatar]);
            }
            for (const c of initialClassrooms) {
                await client.query('INSERT INTO classrooms (id, name, grade, section, teacher_id, academic_year) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING', [c.id, c.name, c.grade, c.section, c.teacher_id, c.academic_year]);
            }
            for (const s of initialStudents) {
                await client.query('INSERT INTO students (id, user_id, classroom_id, first_name, last_name, age, grade, reading_level, avatar, streak_days, total_stars) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT DO NOTHING', [s.id, s.user_id || null, s.classroom_id, s.first_name, s.last_name, s.age, s.grade, s.reading_level, s.avatar, s.streak_days, s.total_stars]);
            }
            for (const ps of initialParentStudent) {
                await client.query('INSERT INTO parent_student (parent_id, student_id, relationship) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [ps.parent_id, ps.student_id, ps.relationship]);
            }
            for (const a of initialActivities) {
                await client.query('INSERT INTO activities (id, title, category, level, description, content_json, points) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING', [a.id, a.title, a.category, a.level, a.description, JSON.stringify(a.content), a.points]);
            }
            console.log('✅ [Yachay Lee DB] Semilla en PostgreSQL completada con éxito.');
        }
        client.release();
    }
    catch (err) {
        console.log('⚠️ [Yachay Lee DB] PostgreSQL no detectado en el puerto local (' + (err.message || 'Sin conexión') + ').');
        console.log('💡 [Yachay Lee DB] Activando motor de base de datos integrado seguro con persistencia.');
        isPostgres = false;
        pool = null;
        const loaded = loadLocalStore();
        if (!loaded || localStore.users.length === 0) {
            await seedDataToLocalStore();
        }
        else {
            console.log(`📂 [Yachay Lee DB] Almacén persistente cargado con ${localStore.users.length} usuarios y ${localStore.students.length} estudiantes.`);
        }
    }
}
// Data access operations
export const db = {
    isPostgres: () => isPostgres,
    async query(sql, params = []) {
        if (isPostgres && pool) {
            return pool.query(sql, params);
        }
        throw new Error('Direct SQL queries not supported in fallback mode. Use repository methods.');
    },
    // USERS
    users: {
        async findByEmail(email) {
            if (isPostgres && pool) {
                const res = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
                return res.rows[0] || null;
            }
            return localStore.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
        },
        async findById(id) {
            if (isPostgres && pool) {
                const res = await pool.query('SELECT id, name, email, role, phone, avatar, created_at FROM users WHERE id = $1', [id]);
                return res.rows[0] || null;
            }
            const u = localStore.users.find(user => user.id === id);
            if (!u)
                return null;
            const { password_hash, ...safeUser } = u;
            return safeUser;
        },
        async getAll() {
            if (isPostgres && pool) {
                const res = await pool.query('SELECT id, name, email, role, phone, avatar, created_at FROM users ORDER BY id ASC');
                return res.rows;
            }
            return localStore.users.map(({ password_hash, ...u }) => u);
        },
        async create(data) {
            if (isPostgres && pool) {
                const res = await pool.query('INSERT INTO users (name, email, password_hash, role, phone, avatar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, phone, avatar, created_at', [data.name, data.email, data.password_hash, data.role, data.phone || null, data.avatar || null]);
                return res.rows[0];
            }
            const newId = localStore.users.length > 0 ? Math.max(...localStore.users.map(u => u.id)) + 1 : 1;
            const newUser = {
                id: newId,
                ...data,
                created_at: new Date().toISOString()
            };
            localStore.users.push(newUser);
            saveLocalStore();
            const { password_hash, ...safe } = newUser;
            return safe;
        },
        async updatePassword(email, newHash) {
            if (isPostgres && pool) {
                await pool.query('UPDATE users SET password_hash = $1 WHERE LOWER(email) = LOWER($2)', [newHash, email.trim()]);
                return true;
            }
            const user = localStore.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
            if (user) {
                user.password_hash = newHash;
                saveLocalStore();
                return true;
            }
            return false;
        }
    },
    // CLASSROOMS
    classrooms: {
        async getAll() {
            if (isPostgres && pool) {
                const res = await pool.query(`
          SELECT c.*, u.name as teacher_name,
            (SELECT COUNT(*) FROM students s WHERE s.classroom_id = c.id) as student_count
          FROM classrooms c
          LEFT JOIN users u ON c.teacher_id = u.id
          ORDER BY c.grade ASC, c.section ASC
        `);
                return res.rows;
            }
            return localStore.classrooms.map(c => {
                const teacher = localStore.users.find(u => u.id === c.teacher_id);
                const studentCount = localStore.students.filter(s => s.classroom_id === c.id).length;
                return {
                    ...c,
                    teacher_name: teacher ? teacher.name : 'No asignado',
                    student_count: studentCount
                };
            });
        },
        async getById(id) {
            if (isPostgres && pool) {
                const res = await pool.query(`
          SELECT c.*, u.name as teacher_name
          FROM classrooms c
          LEFT JOIN users u ON c.teacher_id = u.id
          WHERE c.id = $1
        `, [id]);
                return res.rows[0] || null;
            }
            const c = localStore.classrooms.find(cls => cls.id === id);
            if (!c)
                return null;
            const teacher = localStore.users.find(u => u.id === c.teacher_id);
            return {
                ...c,
                teacher_name: teacher ? teacher.name : 'No asignado'
            };
        },
        async getByTeacherId(teacherId) {
            if (isPostgres && pool) {
                const res = await pool.query('SELECT * FROM classrooms WHERE teacher_id = $1', [teacherId]);
                return res.rows;
            }
            return localStore.classrooms.filter(c => c.teacher_id === teacherId);
        },
        async create(data) {
            if (isPostgres && pool) {
                const res = await pool.query('INSERT INTO classrooms (name, grade, section, teacher_id, academic_year) VALUES ($1, $2, $3, $4, $5) RETURNING *', [data.name, data.grade, data.section, data.teacher_id, data.academic_year]);
                return res.rows[0];
            }
            const newId = localStore.classrooms.length > 0 ? Math.max(...localStore.classrooms.map(c => c.id)) + 1 : 1;
            const newCls = { id: newId, ...data, created_at: new Date().toISOString() };
            localStore.classrooms.push(newCls);
            saveLocalStore();
            return newCls;
        }
    },
    // STUDENTS
    students: {
        async getAll() {
            if (isPostgres && pool) {
                const res = await pool.query(`
          SELECT s.*, c.name as classroom_name, c.grade as classroom_grade
          FROM students s
          LEFT JOIN classrooms c ON s.classroom_id = c.id
          ORDER BY s.last_name ASC
        `);
                return res.rows;
            }
            return localStore.students.map(s => {
                const classroom = localStore.classrooms.find(c => c.id === s.classroom_id);
                return {
                    ...s,
                    classroom_name: classroom ? classroom.name : 'Sin aula',
                    classroom_grade: classroom ? classroom.grade : s.grade
                };
            });
        },
        async getById(id) {
            if (isPostgres && pool) {
                const res = await pool.query(`
          SELECT s.*, c.name as classroom_name, c.grade as classroom_grade, c.section as classroom_section
          FROM students s
          LEFT JOIN classrooms c ON s.classroom_id = c.id
          WHERE s.id = $1
        `, [id]);
                return res.rows[0] || null;
            }
            const s = localStore.students.find(std => std.id === id);
            if (!s)
                return null;
            const classroom = localStore.classrooms.find(c => c.id === s.classroom_id);
            return {
                ...s,
                classroom_name: classroom ? classroom.name : 'Sin aula',
                classroom_grade: classroom ? classroom.grade : s.grade,
                classroom_section: classroom ? classroom.section : ''
            };
        },
        async getByUserId(userId) {
            if (isPostgres && pool) {
                const res = await pool.query('SELECT * FROM students WHERE user_id = $1', [userId]);
                return res.rows[0] || null;
            }
            return localStore.students.find(s => s.user_id === userId) || null;
        },
        async getByClassroomId(classroomId) {
            if (isPostgres && pool) {
                const res = await pool.query('SELECT * FROM students WHERE classroom_id = $1 ORDER BY last_name ASC', [classroomId]);
                return res.rows;
            }
            return localStore.students.filter(s => s.classroom_id === classroomId);
        },
        async getByParentId(parentId) {
            if (isPostgres && pool) {
                const res = await pool.query(`
          SELECT s.*, ps.relationship, c.name as classroom_name
          FROM students s
          JOIN parent_student ps ON s.id = ps.student_id
          LEFT JOIN classrooms c ON s.classroom_id = c.id
          WHERE ps.parent_id = $1
        `, [parentId]);
                return res.rows;
            }
            const links = localStore.parent_student.filter(ps => ps.parent_id === parentId);
            return links.map(link => {
                const student = localStore.students.find(s => s.id === link.student_id);
                const classroom = student ? localStore.classrooms.find(c => c.id === student.classroom_id) : null;
                return {
                    ...student,
                    relationship: link.relationship,
                    classroom_name: classroom ? classroom.name : 'Sin aula'
                };
            }).filter(Boolean);
        },
        async create(data) {
            if (isPostgres && pool) {
                const res = await pool.query(`INSERT INTO students (classroom_id, first_name, last_name, age, grade, reading_level, avatar, user_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, [data.classroom_id, data.first_name, data.last_name, data.age, data.grade, data.reading_level, data.avatar || '🦊', data.user_id || null]);
                return res.rows[0];
            }
            const newId = localStore.students.length > 0 ? Math.max(...localStore.students.map(s => s.id)) + 1 : 1;
            const newStudent = {
                id: newId,
                ...data,
                streak_days: 1,
                total_stars: 20,
                created_at: new Date().toISOString()
            };
            localStore.students.push(newStudent);
            saveLocalStore();
            return newStudent;
        },
        async update(id, data) {
            if (isPostgres && pool) {
                const fields = [];
                const values = [];
                let index = 1;
                for (const [key, value] of Object.entries(data)) {
                    fields.push(`${key} = $${index}`);
                    values.push(value);
                    index++;
                }
                values.push(id);
                const res = await pool.query(`UPDATE students SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`, values);
                return res.rows[0];
            }
            const std = localStore.students.find(s => s.id === id);
            if (std) {
                Object.assign(std, data);
                saveLocalStore();
                return std;
            }
            return null;
        }
    },
    // ACTIVITIES
    activities: {
        async getAll(category, level) {
            if (isPostgres && pool) {
                let query = 'SELECT * FROM activities WHERE 1=1';
                const params = [];
                if (category) {
                    params.push(category);
                    query += ` AND category = $${params.length}`;
                }
                if (level) {
                    params.push(level);
                    query += ` AND level = $${params.length}`;
                }
                query += ' ORDER BY id ASC';
                const res = await pool.query(query, params);
                return res.rows;
            }
            return localStore.activities.filter(a => {
                if (category && a.category !== category)
                    return false;
                if (level && a.level !== level)
                    return false;
                return true;
            });
        },
        async getById(id) {
            if (isPostgres && pool) {
                const res = await pool.query('SELECT * FROM activities WHERE id = $1', [id]);
                return res.rows[0] || null;
            }
            return localStore.activities.find(a => a.id === id) || null;
        },
        async create(data) {
            if (isPostgres && pool) {
                const res = await pool.query('INSERT INTO activities (title, category, level, description, content_json, points) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [data.title, data.category, data.level, data.description, JSON.stringify(data.content_json), data.points]);
                return res.rows[0];
            }
            const newId = localStore.activities.length > 0 ? Math.max(...localStore.activities.map(a => a.id)) + 1 : 1;
            const newAct = {
                id: newId,
                ...data,
                created_at: new Date().toISOString()
            };
            localStore.activities.push(newAct);
            saveLocalStore();
            return newAct;
        }
    },
    // PROGRESS
    progress: {
        async recordAttempt(data) {
            if (isPostgres && pool) {
                const res = await pool.query(`INSERT INTO progress_attempts (student_id, activity_id, score, max_score, accuracy_percentage, words_per_minute, time_spent_seconds, details_json)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, [data.student_id, data.activity_id, data.score, data.max_score, data.accuracy_percentage, data.words_per_minute, data.time_spent_seconds, JSON.stringify(data.details_json || {})]);
                // update student stars & streak
                await pool.query('UPDATE students SET total_stars = total_stars + $1, streak_days = streak_days + 1 WHERE id = $2', [data.score, data.student_id]);
                return res.rows[0];
            }
            const newId = localStore.progress_attempts.length > 0 ? Math.max(...localStore.progress_attempts.map(p => p.id)) + 1 : 1;
            const newAttempt = {
                id: newId,
                ...data,
                completed_at: new Date().toISOString()
            };
            localStore.progress_attempts.push(newAttempt);
            // Update student points
            const student = localStore.students.find(s => s.id === data.student_id);
            if (student) {
                student.total_stars = (student.total_stars || 0) + data.score;
                student.streak_days = (student.streak_days || 0) + 1;
            }
            saveLocalStore();
            return newAttempt;
        },
        async getByStudentId(studentId) {
            if (isPostgres && pool) {
                const res = await pool.query(`
          SELECT pa.*, a.title as activity_title, a.category as activity_category, a.level as activity_level
          FROM progress_attempts pa
          JOIN activities a ON pa.activity_id = a.id
          WHERE pa.student_id = $1
          ORDER BY pa.completed_at DESC
        `, [studentId]);
                return res.rows;
            }
            return localStore.progress_attempts
                .filter(pa => pa.student_id === studentId)
                .map(pa => {
                const act = localStore.activities.find(a => a.id === pa.activity_id);
                return {
                    ...pa,
                    activity_title: act ? act.title : 'Actividad',
                    activity_category: act ? act.category : 'general',
                    activity_level: act ? act.level : 'Básico'
                };
            })
                .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
        },
        async getAll() {
            if (isPostgres && pool) {
                const res = await pool.query(`
          SELECT pa.*, s.first_name, s.last_name, a.title as activity_title
          FROM progress_attempts pa
          JOIN students s ON pa.student_id = s.id
          JOIN activities a ON pa.activity_id = a.id
          ORDER BY pa.completed_at DESC
        `);
                return res.rows;
            }
            return localStore.progress_attempts.map(pa => {
                const std = localStore.students.find(s => s.id === pa.student_id);
                const act = localStore.activities.find(a => a.id === pa.activity_id);
                return {
                    ...pa,
                    first_name: std ? std.first_name : 'Estudiante',
                    last_name: std ? std.last_name : '',
                    activity_title: act ? act.title : 'Actividad'
                };
            });
        }
    },
    // AI EVALUATIONS
    ai: {
        async getLatestByStudentId(studentId) {
            if (isPostgres && pool) {
                const res = await pool.query('SELECT * FROM ai_evaluations WHERE student_id = $1 ORDER BY created_at DESC LIMIT 1', [studentId]);
                return res.rows[0] || null;
            }
            const evals = localStore.ai_evaluations
                .filter(e => e.student_id === studentId)
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            return evals[0] || null;
        },
        async saveEvaluation(data) {
            if (isPostgres && pool) {
                const res = await pool.query(`INSERT INTO ai_evaluations (student_id, reading_level, words_per_minute, accuracy, comprehension_score, strengths, difficulties, recommendations, pedagogical_action_plan)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, [data.student_id, data.reading_level, data.words_per_minute, data.accuracy, data.comprehension_score, data.strengths, data.difficulties, data.recommendations, data.pedagogical_action_plan]);
                return res.rows[0];
            }
            const newId = localStore.ai_evaluations.length > 0 ? Math.max(...localStore.ai_evaluations.map(e => e.id)) + 1 : 1;
            const newEval = {
                id: newId,
                ...data,
                created_at: new Date().toISOString()
            };
            localStore.ai_evaluations.push(newEval);
            saveLocalStore();
            return newEval;
        }
    },
    // NOTIFICATIONS
    notifications: {
        async getByUserId(userId) {
            if (isPostgres && pool) {
                const res = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20', [userId]);
                return res.rows;
            }
            return localStore.notifications
                .filter(n => n.user_id === userId)
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        },
        async create(data) {
            if (isPostgres && pool) {
                const res = await pool.query('INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4) RETURNING *', [data.user_id, data.title, data.message, data.type || 'info']);
                return res.rows[0];
            }
            const newId = localStore.notifications.length > 0 ? Math.max(...localStore.notifications.map(n => n.id)) + 1 : 1;
            const newNotif = {
                id: newId,
                user_id: data.user_id,
                title: data.title,
                message: data.message,
                type: data.type || 'info',
                is_read: false,
                created_at: new Date().toISOString()
            };
            localStore.notifications.push(newNotif);
            saveLocalStore();
            return newNotif;
        }
    },
    // BADGES (Gamificación)
    badges: {
        async getAll() {
            return localStore.badges;
        },
        async unlock(badgeId) {
            const badge = localStore.badges.find(b => b.id === badgeId);
            if (badge) {
                badge.unlocked = true;
                badge.progress = badge.maxProgress;
                saveLocalStore();
                return badge;
            }
            return null;
        }
    },
    // WEEKLY GOALS
    weeklyGoals: {
        async getAll() {
            return localStore.weekly_goals;
        },
        async updateProgress(goalId, addAmount) {
            const goal = localStore.weekly_goals.find(g => g.id === goalId);
            if (goal) {
                goal.current = Math.min(goal.target, goal.current + addAmount);
                if (goal.current >= goal.target) {
                    goal.completed = true;
                }
                saveLocalStore();
                return goal;
            }
            return null;
        }
    },
    // BOOKS (Biblioteca Digital)
    books: {
        async getAll(category, level) {
            return localStore.books.filter(b => {
                if (category && b.category !== category)
                    return false;
                if (level && b.level !== level)
                    return false;
                return true;
            });
        },
        async getById(id) {
            return localStore.books.find(b => b.id === id) || null;
        },
        async toggleFavorite(bookId) {
            const book = localStore.books.find(b => b.id === bookId);
            if (book) {
                book.isFavorite = !book.isFavorite;
                saveLocalStore();
                return book.isFavorite;
            }
            return false;
        }
    },
    // REWARDS STORE
    rewards: {
        async getAll() {
            return localStore.reward_items;
        },
        async purchase(itemId, studentId) {
            const item = localStore.reward_items.find(i => i.id === itemId);
            const student = localStore.students.find(s => s.id === studentId);
            if (!item || !student)
                throw new Error('Elemento o estudiante no encontrado');
            if (student.total_stars < item.costStars) {
                throw new Error(`Estrellas insuficientes. Tienes ${student.total_stars} ⭐ y necesitas ${item.costStars} ⭐`);
            }
            student.total_stars -= item.costStars;
            item.unlocked = true;
            saveLocalStore();
            return { item, remainingStars: student.total_stars };
        }
    }
};
