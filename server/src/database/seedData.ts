export interface UserSeed {
  id: number;
  name: string;
  email: string;
  password: string; // Plain password, will be hashed with bcrypt
  role: 'admin' | 'teacher' | 'parent' | 'student';
  phone: string;
  avatar: string;
}

export interface ClassroomSeed {
  id: number;
  name: string;
  grade: string;
  section: string;
  teacher_id: number;
  academic_year: string;
}

export interface StudentSeed {
  id: number;
  user_id?: number;
  classroom_id: number;
  first_name: string;
  last_name: string;
  age: number;
  grade: string;
  reading_level: 'Inicial' | 'Básico' | 'Intermedio' | 'Avanzado';
  avatar: string;
  streak_days: number;
  total_stars: number;
}

export interface ActivitySeed {
  id: number;
  title: string;
  category: 'letters' | 'syllables' | 'words' | 'sentences' | 'comprehension' | 'games';
  level: 'Inicial' | 'Básico' | 'Intermedio' | 'Avanzado';
  description: string;
  content: any;
  points: number;
}

export const initialUsers: UserSeed[] = [
  {
    id: 1,
    name: "Dr. Carlos Mendoza",
    email: "admin@yachaylee.edu.pe",
    password: "admin123",
    role: "admin",
    phone: "+51 987 654 321",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Prof. María Valdivia",
    email: "docente@yachaylee.edu.pe",
    password: "docente123",
    role: "teacher",
    phone: "+51 912 345 678",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Prof. Roberto Quispe",
    email: "roberto@yachaylee.edu.pe",
    password: "docente123",
    role: "teacher",
    phone: "+51 923 456 789",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Elena Morales",
    email: "padre@yachaylee.edu.pe",
    password: "padre123",
    role: "parent",
    phone: "+51 934 567 890",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    name: "Mateo Huamán",
    email: "estudiante@yachaylee.edu.pe",
    password: "estudiante123",
    role: "student",
    phone: "+51 945 678 901",
    avatar: "🦊"
  }
];

export const initialClassrooms: ClassroomSeed[] = [
  {
    id: 1,
    name: "1° Grado A - Los Exploradores Lectores",
    grade: "1° Primaria",
    section: "A",
    teacher_id: 2,
    academic_year: "2026"
  },
  {
    id: 2,
    name: "2° Grado B - Pequeños Gigantes de la Lectura",
    grade: "2° Primaria",
    section: "B",
    teacher_id: 3,
    academic_year: "2026"
  }
];

export const initialStudents: StudentSeed[] = [
  {
    id: 1,
    user_id: 5,
    classroom_id: 1,
    first_name: "Mateo",
    last_name: "Huamán Morales",
    age: 7,
    grade: "1° Primaria",
    reading_level: "Básico",
    avatar: "🦊",
    streak_days: 6,
    total_stars: 160
  },
  {
    id: 2,
    classroom_id: 1,
    first_name: "Lucía",
    last_name: "Condori Quispe",
    age: 7,
    grade: "1° Primaria",
    reading_level: "Intermedio",
    avatar: "🦉",
    streak_days: 8,
    total_stars: 210
  },
  {
    id: 3,
    classroom_id: 1,
    first_name: "Thiago",
    last_name: "Flores Salazar",
    age: 6,
    grade: "1° Primaria",
    reading_level: "Inicial",
    avatar: "🐻",
    streak_days: 3,
    total_stars: 95
  },
  {
    id: 4,
    classroom_id: 2,
    first_name: "Camila",
    last_name: "Ramos Vargas",
    age: 8,
    grade: "2° Primaria",
    reading_level: "Avanzado",
    avatar: "🦁",
    streak_days: 14,
    total_stars: 320
  },
  {
    id: 5,
    classroom_id: 2,
    first_name: "Joaquín",
    last_name: "Castro Peña",
    age: 8,
    grade: "2° Primaria",
    reading_level: "Intermedio",
    avatar: "🐼",
    streak_days: 5,
    total_stars: 175
  }
];

export const initialParentStudent = [
  { parent_id: 4, student_id: 1, relationship: "Madre" }
];

export const initialActivities: ActivitySeed[] = [
  {
    id: 1,
    title: "El Mundo Mágico de las Vocales",
    category: "letters",
    level: "Inicial",
    description: "Identifica el sonido y la forma de las vocales A, E, I, O, U con ilustraciones animadas y pronunciación.",
    points: 20,
    content: {
      type: "phonics_letters",
      letters: [
        { letter: "A", sound: "a", word: "Avión", image: "✈️", example: "A de Avión" },
        { letter: "E", sound: "e", word: "Estrella", image: "⭐", example: "E de Estrella" },
        { letter: "I", sound: "i", word: "Isla", image: "🏝️", example: "I de Isla" },
        { letter: "O", sound: "o", word: "Oso", image: "🐻", example: "O de Oso" },
        { letter: "U", sound: "u", word: "Uva", image: "🍇", example: "U de Uva" }
      ],
      exercises: [
        {
          question: "¿Con qué vocal empieza la palabra 'Oso'?",
          options: ["A", "O", "E", "U"],
          correct: "O",
          image: "🐻"
        },
        {
          question: "¿Cuál de estos objetos empieza con la letra 'E'?",
          options: ["Avión", "Estrella", "Uva", "Isla"],
          correct: "Estrella",
          image: "⭐"
        },
        {
          question: "Escucha el sonido: /a/. ¿Qué letra es?",
          options: ["I", "U", "A", "O"],
          correct: "A",
          soundTarget: "a"
        }
      ]
    }
  },
  {
    id: 2,
    title: "La Fábrica de Sílabas con la M y P",
    category: "syllables",
    level: "Inicial",
    description: "Combina consonantes con vocales para crear sílabas directas (ma, me, mi, mo, mu / pa, pe, pi, po, pu).",
    points: 25,
    content: {
      type: "syllable_builder",
      consonants: ["M", "P"],
      syllables: ["ma", "me", "mi", "mo", "mu", "pa", "pe", "pi", "po", "pu"],
      exercises: [
        {
          targetWord: "MAPA",
          image: "🗺️",
          syllablesNeeded: ["MA", "PA"],
          availableSyllables: ["MA", "ME", "PA", "PO", "LU", "SA"]
        },
        {
          targetWord: "PUMA",
          image: "🐆",
          syllablesNeeded: ["PU", "MA"],
          availableSyllables: ["PU", "PA", "MA", "MI", "TO", "RO"]
        },
        {
          targetWord: "MESA",
          image: "🪑",
          syllablesNeeded: ["ME", "SA"],
          availableSyllables: ["ME", "MO", "SA", "SE", "CA", "PI"]
        }
      ]
    }
  },
  {
    id: 3,
    title: "Safari de Palabras Frecuentes",
    category: "words",
    level: "Básico",
    description: "Reconoce palabras de uso frecuente a alta velocidad y fortalece la memoria visual.",
    points: 30,
    content: {
      type: "sight_words",
      wordsList: [
        { word: "CASA", icon: "🏠", hint: "Lugar donde vivimos con la familia" },
        { word: "LUNA", icon: "🌙", hint: "Brilla en la noche en el cielo" },
        { word: "SOL", icon: "☀️", hint: "Nos da luz y calor cada mañana" },
        { word: "GATO", icon: "🐱", hint: "Mascota juguetona que dice miau" },
        { word: "PERRO", icon: "🐶", hint: "El mejor amigo fiel que mueve la colita" },
        { word: "LIBRO", icon: "📖", hint: "Lleno de historias maravillosas" }
      ],
      speedChallengeSeconds: 60
    }
  },
  {
    id: 4,
    title: "El Constructor de Oraciones",
    category: "sentences",
    level: "Básico",
    description: "Ordena las palabras desordenadas para formar oraciones con sentido completo y buena entonación.",
    points: 35,
    content: {
      type: "sentence_ordering",
      sentences: [
        {
          id: "s1",
          correctSentence: "El gato bebe leche tibia.",
          jumbledWords: ["bebe", "El", "tibia.", "leche", "gato"],
          image: "🐱🥛"
        },
        {
          id: "s2",
          correctSentence: "Mamá lee un cuento hermoso.",
          jumbledWords: ["un", "Mamá", "hermoso.", "cuento", "lee"],
          image: "👩‍👧📖"
        },
        {
          id: "s3",
          correctSentence: "Los niños juegan en el parque.",
          jumbledWords: ["en", "juegan", "el", "Los", "parque.", "niños"],
          image: "👦👧🌳"
        }
      ]
    }
  },
  {
    id: 5,
    title: "El Colibrí Valiente y la Montaña Dorada",
    category: "comprehension",
    level: "Básico",
    description: "Cuento interactivo con lectura guiada, audio de narración y preguntas de comprensión literal e inferencial.",
    points: 50,
    content: {
      type: "story_comprehension",
      title: "El Colibrí Valiente y la Montaña Dorada",
      author: "Tradición Andina Educativa",
      wordCount: 142,
      paragraphs: [
        "En un hermoso valle rodeado de flores de cantuta vivía Kinti, un pequeño colibrí de plumas brillantes como esmeraldas. Aunque era el ave más pequeña del bosque, Kinti tenía un corazón muy valiente.",
        "Una tarde, un fuerte viento apagó la fogata mágica que calentaba a todos los animales del nevado. Los osos temblaban y las vicuñas no podían dormir de frío.",
        "Kinti no dudó ni un segundo. Batió sus diminutas alas con rapidez y voló hasta la cima de la Montaña Dorada. Con su pico recogió una pequeña chispa del sol y la llevó con mucho cuidado de regreso al valle.",
        "Todos los animales aplaudieron con alegría. Gracias a Kinti, la fogata volvió a brillar. El pequeño colibrí demostró que no se necesita ser grande para lograr cosas gigantes."
      ],
      questions: [
        {
          id: "q1",
          type: "literal",
          question: "¿Cómo se llamaba el colibrí y de qué color eran sus plumas?",
          options: [
            "Se llamaba Kinti y eran brillantes como esmeraldas.",
            "Se llamaba Piki y eran de color azul marino.",
            "Se llamaba Sol y eran plumas doradas."
          ],
          correct: 0,
          explanation: "El texto menciona que se llamaba Kinti y sus plumas eran brillantes como esmeraldas."
        },
        {
          id: "q2",
          type: "literal",
          question: "¿Qué problema ocurrió en el nevado?",
          options: [
            "Se terminó el agua de la laguna.",
            "Un fuerte viento apagó la fogata mágica.",
            "Llegó un lobo feroz a la montaña."
          ],
          correct: 1,
          explanation: "Un fuerte viento apagó la fogata que calentaba a los animales."
        },
        {
          id: "q3",
          type: "inferential",
          question: "¿Qué nos enseña la historia de Kinti?",
          options: [
            "Que solo las aves grandes pueden volar alto.",
            "Que no importa el tamaño físico cuando se tiene valentía y ganas de ayudar.",
            "Que es mejor quedarse en casa cuando hace frío."
          ],
          correct: 1,
          explanation: "La enseñanza principal es que la solidaridad y el coraje no dependen del tamaño."
        }
      ]
    }
  },
  {
    id: 6,
    title: "Desafío de Memoria Lectora",
    category: "games",
    level: "Inicial",
    description: "Juego interactivo de memoria emparejando la palabra escrita con su respectiva imagen ilustrada.",
    points: 40,
    content: {
      type: "memory_cards",
      pairs: [
        { id: 1, type: "text", content: "SOL", matchId: "p1" },
        { id: 2, type: "image", content: "☀️", matchId: "p1" },
        { id: 3, type: "text", content: "LUNA", matchId: "p2" },
        { id: 4, type: "image", content: "🌙", matchId: "p2" },
        { id: 5, type: "text", content: "FLOR", matchId: "p3" },
        { id: 6, type: "image", content: "🌸", matchId: "p3" },
        { id: 7, type: "text", content: "ÁRBOL", matchId: "p4" },
        { id: 8, type: "image", content: "🌳", matchId: "p4" },
        { id: 9, type: "text", content: "ESTRELLA", matchId: "p5" },
        { id: 10, type: "image", content: "⭐", matchId: "p5" },
        { id: 11, type: "text", content: "PÁJARO", matchId: "p6" },
        { id: 12, type: "image", content: "🐦", matchId: "p6" }
      ]
    }
  }
];

export const initialProgressAttempts = [
  {
    id: 1,
    student_id: 1,
    activity_id: 1,
    score: 20,
    max_score: 20,
    accuracy_percentage: 100,
    words_per_minute: 28,
    time_spent_seconds: 95,
    completed_at: "2026-09-18T10:30:00Z"
  },
  {
    id: 2,
    student_id: 1,
    activity_id: 2,
    score: 22,
    max_score: 25,
    accuracy_percentage: 88,
    words_per_minute: 34,
    time_spent_seconds: 140,
    completed_at: "2026-09-19T11:15:00Z"
  },
  {
    id: 3,
    student_id: 1,
    activity_id: 3,
    score: 28,
    max_score: 30,
    accuracy_percentage: 93.3,
    words_per_minute: 42,
    time_spent_seconds: 110,
    completed_at: "2026-09-20T16:00:00Z"
  },
  {
    id: 4,
    student_id: 1,
    activity_id: 5,
    score: 45,
    max_score: 50,
    accuracy_percentage: 90,
    words_per_minute: 48,
    time_spent_seconds: 240,
    completed_at: "2026-09-21T09:45:00Z"
  }
];

export const initialAIEvaluations = [
  {
    id: 1,
    student_id: 1,
    reading_level: "Básico",
    words_per_minute: 48,
    accuracy: 92.8,
    comprehension_score: 90.0,
    strengths: [
      "Excelente discriminación fonológica de vocales y consonantes bilabiales (M, P).",
      "Alta motivación y constancia en la práctica lectora (racha activa de 6 días).",
      "Comprensión adecuada de secuencias narrativas literales en textos breves."
    ],
    difficulties: [
      "Leve vacilación en la decodificación de palabras con sílabas trabadas (ej. 'bra', 'cla').",
      "Necesita reforzar la prosodia (pausas de punto y coma al leer en voz alta)."
    ],
    recommendations: [
      "Dedicar 10 minutos diarios a la lectura compartida en voz alta con entonación expresiva.",
      "Realizar ejercicios de palmadas rítmicas con sílabas de 3 letras.",
      "Asignar lecturas de nivel Básico-Intermedio con temática de animales andinos."
    ],
    pedagogical_action_plan: "Plan de Refuerzo Fonológico y Prosodia de 3 semanas con monitoreo docente semanal y actividades lúdicas en casa.",
    created_at: "2026-09-21T10:00:00Z"
  }
];

export const initialNotifications = [
  {
    id: 1,
    user_id: 4,
    title: "¡Logro alcanzado por Mateo!",
    message: "Mateo completó 'El Colibrí Valiente' obteniendo 45 puntos y un 90% de comprensión.",
    type: "success",
    is_read: false,
    created_at: "2026-09-21T09:46:00Z"
  },
  {
    id: 2,
    user_id: 2,
    title: "Nuevo informe de IA disponible",
    message: "El análisis pedagógico de Mateo Huamán ha sido actualizado con recomendaciones de prosodia.",
    type: "info",
    is_read: false,
    created_at: "2026-09-21T10:01:00Z"
  }
];

export interface BadgeSeed {
  id: number;
  title: string;
  description: string;
  category: 'fonologia' | 'velocidad' | 'constancia' | 'comprension';
  tier: 'Bronce' | 'Plata' | 'Oro' | 'Diamante';
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rewardXP: number;
}

export const initialBadges: BadgeSeed[] = [
  {
    id: 1,
    title: "Primeros Pasos Fonológicos",
    description: "Reconoce 15 letras y sus sonidos correspondientes.",
    category: "fonologia",
    tier: "Bronce",
    icon: "🔤",
    unlocked: true,
    progress: 15,
    maxProgress: 15,
    rewardXP: 100
  },
  {
    id: 2,
    title: "Maestro de las Sílabas",
    description: "Construye 25 sílabas directas y trabadas sin errores.",
    category: "fonologia",
    tier: "Plata",
    icon: "🧩",
    unlocked: true,
    progress: 25,
    maxProgress: 25,
    rewardXP: 250
  },
  {
    id: 3,
    title: "Lince de la Lectura Rápida",
    description: "Alcanza una velocidad de 45 palabras por minuto.",
    category: "velocidad",
    tier: "Oro",
    icon: "⚡",
    unlocked: true,
    progress: 48,
    maxProgress: 45,
    rewardXP: 500
  },
  {
    id: 4,
    title: "Detective de Historias",
    description: "Responde correctamente 10 preguntas inferenciales de cuentos.",
    category: "comprension",
    tier: "Oro",
    icon: "🔍",
    unlocked: false,
    progress: 7,
    maxProgress: 10,
    rewardXP: 600
  },
  {
    id: 5,
    title: "Racha Legendaria de 7 Días",
    description: "Lee todos los días de la semana de forma ininterrumpida.",
    category: "constancia",
    tier: "Diamante",
    icon: "🔥",
    unlocked: false,
    progress: 6,
    maxProgress: 7,
    rewardXP: 1000
  },
  {
    id: 6,
    title: "Guardián de la Biblioteca",
    description: "Lee 5 cuentos completos de la Biblioteca Digital.",
    category: "comprension",
    tier: "Plata",
    icon: "📚",
    unlocked: false,
    progress: 3,
    maxProgress: 5,
    rewardXP: 400
  }
];

export interface WeeklyGoalSeed {
  id: number;
  title: string;
  description: string;
  current: number;
  target: number;
  unit: string;
  rewardStars: number;
  completed: boolean;
}

export const initialWeeklyGoals: WeeklyGoalSeed[] = [
  {
    id: 1,
    title: "Meta de Lecturas Semanales",
    description: "Completa 5 actividades o cuentos en la plataforma.",
    current: 4,
    target: 5,
    unit: "lecturas",
    rewardStars: 50,
    completed: false
  },
  {
    id: 2,
    title: "Minutos de Lectura Familiar",
    description: "Acumula 90 minutos de lectura con tu familia.",
    current: 85,
    target: 90,
    unit: "min",
    rewardStars: 40,
    completed: false
  },
  {
    id: 3,
    title: "Racha de Lectura Activa",
    description: "Mantén una racha de al menos 5 días consecutivos.",
    current: 6,
    target: 5,
    unit: "días",
    rewardStars: 60,
    completed: true
  },
  {
    id: 4,
    title: "Precisión de Campeón",
    description: "Consigue más del 90% de precisión en 3 ejercicios.",
    current: 3,
    target: 3,
    unit: "aciertos",
    rewardStars: 45,
    completed: true
  }
];

export interface BookSeed {
  id: number;
  title: string;
  author: string;
  category: 'Cuentos Andinos' | 'Fábulas y Valores' | 'Aventuras Mágicas' | 'Ciencia para Niños';
  level: 'Inicial' | 'Básico' | 'Intermedio' | 'Avanzado';
  readTimeMinutes: number;
  coverImage: string;
  description: string;
  isFavorite: boolean;
  paragraphs: string[];
  vocabularyWords: { word: string; meaning: string }[];
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }[];
}

export const initialBooks: BookSeed[] = [
  {
    id: 1,
    title: "El Colibrí Valiente y la Montaña Dorada",
    author: "Tradición Oral Andina",
    category: "Cuentos Andinos",
    level: "Básico",
    readTimeMinutes: 4,
    coverImage: "https://images.unsplash.com/photo-1551893478-d726eaf0442c?w=400&auto=format&fit=crop&q=80",
    description: "Kinti, un pequeño colibrí de plumas brillantes como esmeraldas, demuestra que la valentía no depende del tamaño físico.",
    isFavorite: true,
    paragraphs: [
      "En un hermoso valle rodeado de flores de cantuta vivía Kinti, un pequeño colibrí de plumas brillantes como esmeraldas. Aunque era el ave más pequeña del bosque, Kinti tenía un corazón muy valiente.",
      "Una tarde, un fuerte viento apagó la fogata mágica que calentaba a todos los animales del nevado. Los osos temblaban y las vicuñas no podían dormir de frío.",
      "Kinti no dudó ni un segundo. Batió sus diminutas alas con rapidez y voló hasta la cima de la Montaña Dorada. Con su pico recogió una pequeña chispa del sol y la llevó con mucho cuidado de regreso al valle.",
      "Todos los animales aplaudieron con alegría. Gracias a Kinti, la fogata volvió a brillar. El pequeño colibrí demostró que no se necesita ser grande para lograr cosas gigantes."
    ],
    vocabularyWords: [
      { word: "Cantuta", meaning: "Flor sagrada de los Andes peruanos de vivos colores rojo y amarillo." },
      { word: "Esmeralda", meaning: "Piedra preciosa de color verde brillante." },
      { word: "Vicuña", meaning: "Mamífero andino de lana muy fina y suave que vive en el altiplano." }
    ],
    quiz: [
      {
        question: "¿Cómo se llamaba el colibrí y de qué color eran sus plumas?",
        options: [
          "Se llamaba Kinti y eran brillantes como esmeraldas.",
          "Se llamaba Piki y eran de color azul oscuro.",
          "Se llamaba Sol y eran plumas blancas."
        ],
        correct: 0,
        explanation: "El texto señala expresamente que se llamaba Kinti y sus plumas eran brillantes como esmeraldas."
      },
      {
        question: "¿Qué ocurrió en el nevado?",
        options: [
          "Se inundó la laguna mágica.",
          "Un viento fuerte apagó la fogata mágica.",
          "Llegó un cazador misterioso."
        ],
        correct: 1,
        explanation: "Un viento helado apagó la fogata que mantenía calientes a los animales."
      },
      {
        question: "¿Cuál es la lección principal de Kinti?",
        options: [
          "Que solo las aves grandes pueden volar alto.",
          "Que el valor y el deseo de ayudar valen más que el tamaño físico.",
          "Que es mejor descansar cuando hace frío."
        ],
        correct: 1,
        explanation: "Kinti demostró que la solidaridad y el coraje permiten superar cualquier obstáculo."
      }
    ]
  },
  {
    id: 2,
    title: "El Zorro Astuto y el Secreto de la Luna",
    author: "Cuentos Populares Peruanos",
    category: "Fábulas y Valores",
    level: "Inicial",
    readTimeMinutes: 3,
    coverImage: "https://images.unsplash.com/photo-1516934024742-b461fba47600?w=400&auto=format&fit=crop&q=80",
    description: "Antonio el zorro aprende que la verdadera sabiduría no está en hacer bromas, sino en compartir con sus amigos.",
    isFavorite: true,
    paragraphs: [
      "Antonio era un zorro muy curioso que vivía cerca de un cerro plateado. Cada noche, miraba la luna llena y pensaba que era un delicioso queso redondo flotando en el cielo.",
      "Un día, invitó a la lechuza sabihonda y al cuy saltarín a trepar la roca más alta. '¡Vamos a atrapar el queso del cielo!', les dijo entusiasmado.",
      "Cuando llegaron a la cumbre, la lechuza le explicó suavemente: 'Antonio, la luna no es de queso. Es el farol de la noche que cuida nuestro camino y refleja la luz del sol'.",
      "Antonio comprendió la belleza de aprender cosas reales. Desde esa noche, los tres amigos se reunían a leer cuentos bajo la suave luz de la luna."
    ],
    vocabularyWords: [
      { word: "Cumbre", meaning: "La parte más alta de una montaña o cerro." },
      { word: "Farol", meaning: "Luz grande que sirve para alumbrar en la oscuridad." }
    ],
    quiz: [
      {
        question: "¿Qué pensaba Antonio que era la luna?",
        options: [
          "Un globo de plata.",
          "Un delicioso queso redondo flotando.",
          "Una estrella gigante."
        ],
        correct: 1,
        explanation: "Antonio imaginaba con picardía que la luna era un queso de gran tamaño."
      },
      {
        question: "¿Qué aprendió Antonio gracias a la lechuza?",
        options: [
          "Que la luna refleja la luz del sol y alumbra la noche.",
          "Que las rocas altas son peligrosas.",
          "Que debía comer más rápido."
        ],
        correct: 0,
        explanation: "La lechuza le explicó la verdad científica y poética sobre la luna."
      }
    ]
  },
  {
    id: 3,
    title: "El Árbol de las Letras Encantadas",
    author: "María Valdivia",
    category: "Aventuras Mágicas",
    level: "Básico",
    readTimeMinutes: 5,
    coverImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&auto=format&fit=crop&q=80",
    description: "En medio del bosque verde, un árbol milenario deja caer hojas con letras doradas que cobran vida al ser pronunciadas.",
    isFavorite: false,
    paragraphs: [
      "En el corazón del bosque Yachay crecía un árbol enorme llamado Florisanto. Sus ramas no daban manzanas ni peras, sino hermosas hojas doradas con letras escritas.",
      "Dos hermanos, Lucía y Mateo, visitaban el árbol cada mañana. Al pronunciar fuerte y claro el sonido de cada letra, la hoja desprendía chispitas de luz de colores.",
      "Al juntar las letras S-O-L, un rayito cálido acariciaba sus mejillas. Al decir L-U-N-A, las luciérnagas bailaban al compás de su voz.",
      "Así descubrieron que cada palabra leída con amor y atención tiene el poder mágico de transformar el mundo que nos rodea."
    ],
    vocabularyWords: [
      { word: "Milenario", meaning: "Que tiene miles de años de existencia y antigüedad." },
      { word: "Luciérnaga", meaning: "Pequeño insecto que emite luz brillante en la oscuridad." }
    ],
    quiz: [
      {
        question: "¿Qué daba el árbol Florisanto en lugar de frutas comunes?",
        options: [
          "Flores de papel.",
          "Hojas doradas con letras mágicas.",
          "Semillas de caramelo."
        ],
        correct: 1,
        explanation: "El cuento relata que daba hojas con letras doradas que brillaban al ser leídas."
      }
    ]
  },
  {
    id: 4,
    title: "El Viaje de la Gotita de Agua",
    author: "Equipo Pedagógico Yachay",
    category: "Ciencia para Niños",
    level: "Intermedio",
    readTimeMinutes: 4,
    coverImage: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&auto=format&fit=crop&q=80",
    description: "Acompaña a Clotilde, una alegre gotita de agua, a través del ciclo del agua desde el río hasta las nubes.",
    isFavorite: false,
    paragraphs: [
      "Clotilde era una gotita de agua cristalina que nadaba en el río Vilcanota. Un mediodía de verano, el sol brilló con tanta fuerza que Clotilde sintió calor y comenzó a flotar hacia el cielo en forma de vapor.",
      "Arriba en el cielo se encontró con millones de amigas gotitas. Juntas formaron una hermosa nube esponjosa como algodón de azúcar.",
      "Cuando sopló el viento frío de la cordillera, las gotitas se abrazaron fuerte y cayeron a la tierra como una refrescante lluvia sobre los campos de maíz.",
      "Clotilde regó las raíces de una hermosa planta de choclo y sonrió: '¡Qué gran aventura es viajar por el cielo y ayudar a que la vida florezca!'."
    ],
    vocabularyWords: [
      { word: "Vapor", meaning: "Estado del agua cuando se calienta y sube en forma de gas invisible o humo blanco." },
      { word: "Cordillera", meaning: "Cadena continua de altas montañas nevadas." }
    ],
    quiz: [
      {
        question: "¿Cómo subió Clotilde hacia las nubes?",
        options: [
          "Montada en un ave rapaz.",
          "Evaporándose con el calor del sol hacia el cielo.",
          "Empujada por un cohete."
        ],
        correct: 1,
        explanation: "El calor del sol calentó el agua transformándola en vapor que ascendió a la atmósfera."
      }
    ]
  }
];

export interface RewardItemSeed {
  id: number;
  name: string;
  category: 'avatar' | 'marco' | 'fondo';
  costStars: number;
  icon: string;
  unlocked: boolean;
}

export const initialRewardItems: RewardItemSeed[] = [
  { id: 1, name: "Zorrito Lector", category: "avatar", costStars: 50, icon: "🦊", unlocked: true },
  { id: 2, name: "Búho Sabio", category: "avatar", costStars: 100, icon: "🦉", unlocked: true },
  { id: 3, name: "León Valiente", category: "avatar", costStars: 150, icon: "🦁", unlocked: false },
  { id: 4, name: "Panda Maestro", category: "avatar", costStars: 200, icon: "🐼", unlocked: false },
  { id: 5, name: "Marco Dorado de Campeón", category: "marco", costStars: 120, icon: "👑", unlocked: false },
  { id: 6, name: "Fondo Selva Tropical", category: "fondo", costStars: 80, icon: "🌴", unlocked: false },
  { id: 7, name: "Fondo Galaxia Lectora", category: "fondo", costStars: 160, icon: "🌌", unlocked: false }
];

