import React, { useState } from 'react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import './ExportPDF.css';

const ExportPDF = ({ chartData }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportToPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setProgress(10);

    try {
      const resultPage = document.querySelector('.result-page');
      if (!resultPage) {
        alert('Không tìm thấy nội dung lá số để xuất!');
        setIsExporting(false);
        return;
      }

      // Add print-mode class
      resultPage.classList.add('pdf-export-mode');
      setProgress(15);
      await new Promise(r => setTimeout(r, 500));

      // PDF Setup (A4)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 12;
      const contentWidth = pdfWidth - margin * 2;
      const maxPageHeight = pdfHeight - margin * 2.5; // Reserve space for footer

      let currentY = margin;
      let currentPage = 1;

      // Identify all major sections to capture
      const sections = Array.from(resultPage.querySelectorAll('.chart-view-section, .result-section, .detail-section'));
      const totalSteps = sections.length;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        
        // Skip hidden sections or very small ones
        if (section.offsetHeight < 10) continue;

        // Capture section
        const canvas = await html2canvas(section, {
          scale: 3, // Giữ nguyên scale 3 nhưng xuất PNG sẽ nét hơn nhiều
          useCORS: true,
          backgroundColor: '#fffcf5',
          logging: false,
          windowWidth: 1200
        });

        // Đổi từ JPEG sang PNG để tránh bị mờ (ringing artifacts) ở những nét chữ nhỏ
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = contentWidth / imgWidth;
        const scaledHeight = imgHeight * ratio;

        // Check if section fits on current page
        // Or if it has a forced page break class (Chapter starters)
        const hasForcedBreak = section.classList.contains('luangiai-section') || 
                               section.classList.contains('vanhan-section') ||
                               section.classList.contains('career-section') ||
                               section.classList.contains('wealth-section') ||
                               section.classList.contains('children-section') ||
                               section.classList.contains('stages-section') ||
                               section.classList.contains('monthly-section');

        if (currentY + scaledHeight > maxPageHeight || (hasForcedBreak && i > 0)) {
          // Add footer before moving to new page
          addFooter(pdf, currentPage, pdfWidth, pdfHeight, margin);
          
          pdf.addPage();
          currentPage++;
          currentY = margin;
        }

        // Add image to PDF as PNG
        pdf.addImage(imgData, 'PNG', margin, currentY, contentWidth, scaledHeight);
        currentY += scaledHeight + 8; // Padding between sections

        setProgress(15 + Math.round(((i + 1) / totalSteps) * 75));
      }

      // Add final footer
      addFooter(pdf, currentPage, pdfWidth, pdfHeight, margin);

      // Save with Name and Date (all lowercase)
      const name = chartData?.userInfo?.name || 'TuVi';
      const now = new Date();
      const dateStr = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
      const fileName = `lasotuvi_${name.toLowerCase().replace(/\s+/g, '_')}_${dateStr}.pdf`;
      pdf.save(fileName);

      resultPage.classList.remove('pdf-export-mode');
      setProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        setProgress(0);
      }, 1000);

    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Lỗi khi xuất PDF. Vui lòng thử lại!');
      document.querySelector('.result-page')?.classList.remove('pdf-export-mode');
      setIsExporting(false);
      setProgress(0);
    }
  };

  // Helper to add consistent footer with logo
  const addFooter = (pdf, pageNum, width, height, margin) => {
    // Add small logo (favicon)
    try {
      const logoSize = 4;
      // Using /favicon.png - assuming it's available in public
      pdf.addImage('/favicon.png', 'PNG', margin, height - 10.5, logoSize, logoSize);
      
      pdf.setFontSize(8.5);
      pdf.setTextColor(179, 145, 88); // Match the UI Gold (#b39158)
      // Offset text by logo size + small gap
      pdf.text(`MENH THU DAI SU - LA SO TU VI`, margin + logoSize + 2, height - 8);
      pdf.text(`Trang ${pageNum}`, width - margin, height - 8, { align: 'right' });
    } catch (e) {
      // Fallback if logo fails
      pdf.setFontSize(8.5);
      pdf.setTextColor(179, 145, 88);
      pdf.text(`MENH THU DAI SU - LA SO TU VI`, margin, height - 8);
      pdf.text(`Trang ${pageNum}`, width - margin, height - 8, { align: 'right' });
    }
  };

  return (
    <div className="export-pdf-wrapper">
      <button
        className={`export-pdf-btn ${isExporting ? 'exporting' : ''}`}
        onClick={exportToPDF}
        disabled={isExporting}
        title="Xuất lá số ra file PDF"
      >
        {isExporting ? (
          <>
            <span className="export-spinner"></span>
            <span>Đang xuất... {progress}%</span>
          </>
        ) : (
          <>
            <span className="export-pdf-char-icon">印</span>
            <span>Xuất PDF</span>
          </>
        )}
      </button>

      {isExporting && (
        <div className="export-progress-bar">
          <div className="export-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
};

export default ExportPDF;
