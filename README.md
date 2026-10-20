# YACHAY LEE 📖✨
### Sistema Web Profesional para el Fortalecimiento de la Lectura Infantil

**YACHAY LEE** es una plataforma educativa integral tipo SaaS diseñada para impulsar y fortalecer las competencias lectoras en niños de educación primaria (4 a 12 años), integrando activamente a **Estudiantes**, **Docentes**, **Padres de Familia** y **Administradores**.

---

## 🎨 Paleta Institucional Oficial

La plataforma aplica de manera estricta la paleta institucional en todos sus componentes, gráficos, botones, tarjetas, menús y reportes:

- 🟦 **Azul Institucional (`#2563EB`)**: Estructura, navegación principal, confiabilidad y enfoque académico.
- 🟩 **Verde Institucional (`#10B981`)**: Éxito, progreso lector, confirmación de respuestas y crecimiento pedagógico.
- 🟧 **Naranja Institucional (`#F97316`)**: Energía, gamificación, recompensas, estrellas ⭐ y motivación infantil.
- ⬜ **Blanco (`#FFFFFF`)**: Claridad visual, tarjetas de lectura de alto contraste y legibilidad óptima.

Soporte nativo para **Modo Claro** y **Modo Oscuro** persistente.

---

## 🚀 Tecnologías Utilizadas

- **Frontend**:
  - React 18 + TypeScript + Vite
  - Tailwind CSS con tokens institucionales
  - Lucide React (iconografía moderna)
  - Recharts (gráficos estadísticos interactivos)
  - jsPDF + jspdf-autotable (generación de informes PDF oficiales membretados)
  - SheetJS / XLSX (exportación de libros matrices a Excel `.xlsx`)
  - Web Speech API (síntesis de voz con pronunciación fonológica y reconocimiento de voz)
  - Canvas Confetti (efectos de celebración de logros)

- **Backend**:
  - Node.js + Express + TypeScript
  - Autenticación con JWT (JSON Web Tokens)
  - Cifrado de contraseñas con bcryptjs
  - Doble motor de base de datos:
    - **PostgreSQL** oficial con scripts `schema.sql` y `seed.sql`.
    - **Fallback Local Persistente**: Si el entorno de ejecución no tiene PostgreSQL activo en `localhost:5432`, el sistema activa de forma transparente un almacén seguro con persistencia en `server/data/store.json`, garantizando que `npm run dev` funcione **inmediatamente sin errores de conexión**.

- **Inteligencia Artificial**:
  - Motor de diagnóstico pedagógico (WPM - Palabras Por Minuto, precisión fonológica, detección de vacilación silábica y prosodia).
  - Generación de planes de acción personalizados.
  - Adaptabilidad de actividades por Zona de Desarrollo Próximo (ZDP).
  - Conector listo para la API de Google Gemini (`GEMINI_API_KEY`).

---

## 👥 Roles del Sistema

1. **Administrador (`admin@yachaylee.edu.pe`)**:
   - Tablero de control institucional del Colegio San Martín.
   - Supervisión de cobertura de aulas y docentes.
   - Métricas globales de fluidez lectora y evolución anual.
   - Descarga de libros matrices oficiales en Excel.

2. **Docente (`docente@yachaylee.edu.pe`)**:
   - Administración de aulas (1° Grado A, 2° Grado B).
   - Asignación masiva o individual de lecturas y actividades con fechas límite.
   - Alertas tempranas de estudiantes con dificultades de decodificación.
   - Diagnósticos asistidos por IA.

3. **Padre de Familia (`padre@yachaylee.edu.pe`)**:
   - Seguimiento en tiempo real de sus hijos vinculados.
   - Visualización de estrellas, rachas y minutos leídos.
   - Guía de recomendaciones pedagógicas para lectura compartida en casa.
   - Bitácora para registrar minutos de lectura en el hogar.

4. **Estudiante (`estudiante@yachaylee.edu.pe`)**:
   - Portal infantil interactivo ("Mi Ruta del Saber").
   - Avatar seleccionable (🦊, 🦉, 🐻, 🦁, 🐼).
   - Contador de estrellas ⭐, racha diaria 🔥 y medallas 🏆.
   - Acceso a las 6 aventuras de lectura con audio y retroalimentación inmediata.

---

## 📚 Módulos de Actividades de Lectura

1. **Reconocimiento de Letras**: Fonemas, vocales, sonidos guiados por voz y preguntas de discriminación auditiva.
2. **Sílabas Mágicas**: Constructor silábico interactivo (ma, me, mi, mo, mu, pa, pe, pi...), ritmo y palmadas.
3. **Palabras en Acción**: Safari de palabras frecuentes (sight words), lectura rápida con tarjetas flash y memoria visual.
4. **Oraciones Divertidas**: Constructor de oraciones con bloques de palabras desordenadas y lectura guiada.
5. **Comprensión Lectora**: Cuentos ilustrados ("El Colibrí Valiente y la Montaña Dorada") con preguntas literales e inferenciales explicadas.
6. **Juegos Interactivos**: Desafío de Memoria Lectora (emparejar imagen con palabra escrita).

---

## ⚙️ Instrucciones de Instalación y Ejecución

### 1. Clonar o ingresar al directorio del proyecto:
```bash
cd "c:\YACHAY LEE"
```

### 2. Instalar todas las dependencias:
```bash
npm run install:all
```
*(O si ya instaló los paquetes, simplemente ejecute el siguiente comando).*

### 3. Iniciar la aplicación completa (Frontend + Backend):
```bash
npm run dev
```

El comando iniciará simultáneamente:
- **Backend API**: `http://localhost:5000`
- **Frontend SPA**: `http://localhost:5173`

Abra su navegador en `http://localhost:5173`. En la pantalla de bienvenida podrá ingresar directamente haciendo clic en el selector de roles o con las cuentas institucionales configuradas.
