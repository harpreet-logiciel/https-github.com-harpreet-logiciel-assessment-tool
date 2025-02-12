import jsPDF from 'jspdf';
import type { AssessmentState, Question } from '../types';

export async function generatePDF(state: AssessmentState, questions: Question[]) {
  const pdf = new jsPDF();
  let yPosition = 20;
  const lineHeight = 10;
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.width;

  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MVP Assessment Report', margin, yPosition);
  yPosition += lineHeight * 2;

  // Date
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += lineHeight * 2;

  // Questions and Answers
  pdf.setFontSize(14);
  questions.forEach((question, index) => {
    // Add new page if needed
    if (yPosition > pdf.internal.pageSize.height - 40) {
      pdf.addPage();
      yPosition = 20;
    }

    // Question
    pdf.setFont('helvetica', 'bold');
    const questionText = `${index + 1}. ${question.text}`;
    const splitQuestion = pdf.splitTextToSize(questionText, pageWidth - margin * 2);
    pdf.text(splitQuestion, margin, yPosition);
    yPosition += lineHeight * splitQuestion.length;

    // Answer
    pdf.setFont('helvetica', 'normal');
    const answer = state.answers[question.id] || 'Not answered';
    const splitAnswer = pdf.splitTextToSize(answer, pageWidth - margin * 2);
    pdf.text(splitAnswer, margin, yPosition);
    yPosition += lineHeight * splitAnswer.length;

    // Additional Info if exists
    const additionalInfo = state.additionalInfo?.[question.id];
    if (additionalInfo) {
      yPosition += lineHeight;
      pdf.setFont('helvetica', 'italic');
      const additionalText = pdf.splitTextToSize(`Additional Info: ${additionalInfo}`, pageWidth - margin * 2);
      pdf.text(additionalText, margin, yPosition);
      yPosition += lineHeight * additionalText.length;
    }

    yPosition += lineHeight * 1.5;
  });

  // Save the PDF
  pdf.save('mvp-assessment-report.pdf');
}
