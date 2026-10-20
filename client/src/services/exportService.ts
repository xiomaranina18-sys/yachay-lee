import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Student, ProgressAttempt, AIEvaluation } from '../types';

export const exportService = {
  // Export Student PDF Report
  generateStudentPDF: (student: Student, attempts: ProgressAttempt[], aiEvaluation: AIEvaluation | null) => {
    const doc = new jsPDF();

    // Institutional Header Banner (Blue #2563EB)
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 36, 'F');

    // Header Accent Line (Orange #F97316)
    doc.setFillColor(249, 115, 22);
    doc.rect(0, 36, 210, 3, 'F');

    // Title & Brand
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('YACHAY LEE', 15, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema Integral de Fortalecimiento de Lectura Infantil', 15, 26);
    doc.text('Reporte Oficial de Rendimiento Lector', 15, 32);

    // Date
    const today = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFontSize(9);
    doc.text(`Fecha de emisión: ${today}`, 145, 32);

    // Student Info Card
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Datos del Estudiante', 15, 48);

    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, 52, 180, 28, 3, 3, 'FD');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Estudiante: ${student.first_name} ${student.last_name}`, 20, 60);
    doc.text(`Grado / Aula: ${student.grade} - ${student.classroom_name || 'Sección A'}`, 20, 67);
    doc.text(`Nivel Lector Actual: ${student.reading_level}`, 20, 74);

    doc.text(`Edad: ${student.age} años`, 120, 60);
    doc.text(`Estrellas Ganadas: ⭐ ${student.total_stars}`, 120, 67);
    doc.text(`Racha de Lectura: 🔥 ${student.streak_days} días`, 120, 74);

    // AI Pedagogical Diagnostic Section
    let currentY = 88;
    if (aiEvaluation) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('2. Diagnóstico Pedagógico de Inteligencia Artificial (IA Yachay)', 15, currentY);

      // AI Summary Box
      currentY += 5;
      doc.setFillColor(239, 246, 255);
      doc.setDrawColor(191, 219, 254);
      doc.roundedRect(15, currentY, 180, 38, 3, 3, 'FD');

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Velocidad Lectora: ${aiEvaluation.words_per_minute} Palabras/Minuto (PPM)`, 20, currentY + 8);
      doc.text(`Precisión Fonológica: ${aiEvaluation.accuracy}%`, 20, currentY + 16);
      doc.text(`Comprensión Lectora: ${aiEvaluation.comprehension_score}%`, 20, currentY + 24);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Plan de Acción: ${doc.splitTextToSize(aiEvaluation.pedagogical_action_plan, 170)[0]}`, 20, currentY + 32);

      currentY += 46;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129); // Green
      doc.text('Fortalezas Identificadas:', 15, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      aiEvaluation.strengths.forEach((str, i) => {
        currentY += 5;
        doc.text(`• ${str}`, 20, currentY);
      });

      currentY += 8;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(249, 115, 22); // Orange
      doc.text('Recomendaciones para Hogar y Aula:', 15, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      aiEvaluation.recommendations.forEach((rec, i) => {
        currentY += 5;
        doc.text(`• ${rec}`, 20, currentY);
      });

      currentY += 12;
    }

    // Reading Activity History Table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('3. Registro de Actividades y Evaluaciones', 15, currentY);

    const tableData = attempts.map((att, index) => [
      index + 1,
      att.activity_title || 'Lectura',
      att.activity_category?.toUpperCase() || 'GENERAL',
      `${att.score} / ${att.max_score}`,
      `${Math.round(att.accuracy_percentage)}%`,
      att.words_per_minute > 0 ? `${att.words_per_minute} PPM` : '-',
      new Date(att.completed_at).toLocaleDateString('es-PE')
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: [['#', 'Actividad', 'Categoría', 'Puntos', 'Precisión', 'Velocidad', 'Fecha']],
      body: tableData.length > 0 ? tableData : [['-', 'Sin registros recientes', '-', '-', '-', '-', '-']],
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      }
    });

    // Institutional Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('YACHAY LEE - Plataforma Educativa Oficial | Fortalecimiento Lector Infantil', 15, 290);
      doc.text(`Página ${i} de ${pageCount}`, 180, 290);
    }

    doc.save(`YachayLee_Reporte_${student.first_name}_${student.last_name}.pdf`);
  },

  // Export Excel Spreadsheet
  generateExcelReport: (rows: any[], filename = 'YachayLee_Reporte_General_2026.xlsx') => {
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Set column widths
    const columnWidths = [
      { wch: 6 },  // item
      { wch: 18 }, // nombres
      { wch: 20 }, // apellidos
      { wch: 25 }, // aula
      { wch: 14 }, // grado
      { wch: 15 }, // nivel lector
      { wch: 12 }, // estrellas
      { wch: 12 }, // racha
      { wch: 15 }, // ppm
      { wch: 18 }, // precision
      { wch: 22 }, // actividades
      { wch: 18 }, // estado
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rendimiento Lector');
    XLSX.writeFile(workbook, filename);
  }
};
