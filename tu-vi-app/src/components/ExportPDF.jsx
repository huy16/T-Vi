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

      // Temporarily add print-mode class for better PDF styling
      resultPage.classList.add('pdf-export-mode');
      setProgress(20);

      // Wait for styles to apply
      await new Promise(r => setTimeout(r, 300));

      // Capture the entire result page
      setProgress(30);
      const canvas = await html2canvas(resultPage, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#faf5eb',
        logging: false,
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          // Ensure cloned document has proper width
          const clonedResult = clonedDoc.querySelector('.result-page');
          if (clonedResult) {
            clonedResult.style.width = '1200px';
            clonedResult.style.maxWidth = '1200px';
            clonedResult.style.margin = '0 auto';
          }
        }
      });

      setProgress(70);

      // Generate PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 8;
      const contentWidth = pdfWidth - margin * 2;

      // Scale image to fit PDF width
      const ratio = contentWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;

      // Calculate total pages needed
      const pageContentHeight = pdfHeight - margin * 2;
      const totalPages = Math.ceil(scaledHeight / pageContentHeight);

      const pdf = new jsPDF('p', 'mm', 'a4');

      setProgress(80);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        // Calculate source coordinates for this page
        const sourceY = page * (pageContentHeight / ratio);
        const sourceHeight = Math.min(pageContentHeight / ratio, imgHeight - sourceY);

        // Create a temporary canvas for this page slice
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = sourceHeight;
        const ctx = pageCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight);

        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.92);
        const sliceScaledHeight = sourceHeight * ratio;

        pdf.addImage(pageImgData, 'JPEG', margin, margin, contentWidth, sliceScaledHeight);

        // Footer with page number
        pdf.setFontSize(8);
        pdf.setTextColor(150, 130, 100);
        pdf.text(`Trang ${page + 1} / ${totalPages}`, pdfWidth / 2, pdfHeight - 4, { align: 'center' });
        pdf.text('☯ Mệnh Thư Đại Sư — Lá Số Tử Vi', margin, pdfHeight - 4);
      }

      setProgress(95);

      // Generate filename
      const name = chartData?.userInfo?.name || 'TuVi';
      const date = new Date();
      const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      const fileName = `LasoTuVi_${name.replace(/\s+/g, '_')}_${dateStr}.pdf`;

      pdf.save(fileName);

      // Remove print-mode class
      resultPage.classList.remove('pdf-export-mode');
      setProgress(100);

      setTimeout(() => {
        setIsExporting(false);
        setProgress(0);
      }, 1500);

    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Lỗi khi xuất PDF. Vui lòng thử lại!');
      const resultPage = document.querySelector('.result-page');
      if (resultPage) resultPage.classList.remove('pdf-export-mode');
      setIsExporting(false);
      setProgress(0);
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
            <span className="export-icon">📄</span>
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
