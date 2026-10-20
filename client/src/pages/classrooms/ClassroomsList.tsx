import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Classroom } from '../../types';
import { School, Plus, Users, BookOpen, ArrowRight, X } from 'lucide-react';

export const ClassroomsList: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    grade: '1° Primaria',
    section: 'A',
    teacher_id: 2,
    academic_year: '2026'
  });

  const loadData = () => {
    setLoading(true);
    api.classrooms.getAll().then(data => {
      setClassrooms(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.classrooms.create(formData);
      setShowModal(false);
      setFormData({
        name: '',
        grade: '1° Primaria',
        section: 'A',
        teacher_id: 2,
        academic_year: '2026'
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error al crear aula');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <School className="w-7 h-7 text-primary-500" />
            <span>Gestión de Aulas y Docentes</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organización escolar, distribución de secciones y docentes responsables
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nueva Aula</span>
        </button>
      </div>

      {/* Classrooms Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Cargando aulas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classrooms.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                    {c.grade} - Sección {c.section}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Año Escolar {c.academic_year}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  {c.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Docente a cargo: <span className="font-semibold text-slate-700 dark:text-slate-200">{c.teacher_name || 'Prof. María Valdivia'}</span>
                </p>

                <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Estudiantes</p>
                    <p className="text-base font-extrabold text-primary-600 dark:text-primary-400 mt-0.5">
                      {c.student_count || 3}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Fluidez Media</p>
                    <p className="text-base font-extrabold text-secondary-600 dark:text-secondary-400 mt-0.5">
                      42 PPM
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Precisión</p>
                    <p className="text-base font-extrabold text-accent-600 dark:text-accent-400 mt-0.5">
                      91%
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 flex items-center justify-end">
                <Link
                  to={`/classrooms/${c.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-primary-500 hover:text-white dark:bg-slate-700 dark:hover:bg-primary-600 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <span>Ver Aula y Estudiantes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Crear Aula */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Registrar Nueva Aula
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClassroom} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Identificador del Aula
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. 1° Grado C - Pequeños Científicos"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Grado
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="1° Primaria">1° Primaria</option>
                    <option value="2° Primaria">2° Primaria</option>
                    <option value="3° Primaria">3° Primaria</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sección
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="Ej. A, B, C"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-md shadow-primary-500/20"
                >
                  Crear Aula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
