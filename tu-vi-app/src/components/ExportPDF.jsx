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

      // Identify all major sections to capture - Using a Set-like approach to avoid duplicates
      const sections = Array.from(resultPage.querySelectorAll('.chart-view-section, .result-section'));
      const totalSteps = sections.length;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        
        // Skip hidden sections or very small ones
        if (section.offsetHeight < 10) continue;

        // Capture section
        const canvas = await html2canvas(section, {
          scale: 2, // Scale 2 is optimized for A4 print quality while keeping size low
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          windowWidth: 1200
        });

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const hasForcedBreak = section.classList.contains('luangiai-section') || 
                               section.classList.contains('tongquan-section') ||
                               section.classList.contains('vanhan-section') ||
                               section.classList.contains('career-section') ||
                               section.classList.contains('love-section') ||
                               section.classList.contains('wealth-section') ||
                               section.classList.contains('health-section') ||
                               section.classList.contains('children-section') ||
                               section.classList.contains('realestate-section') ||
                               section.classList.contains('stages-section') ||
                               section.classList.contains('fengshui-section') ||
                               section.classList.contains('monthly-section') ||
                               section.classList.contains('stars-analysis-section');

        // --- NEW: ADVANCED IMAGE SPLITTING LOGIC ---
        let imgRemainingHeight = imgHeight;
        let imgCurrentY = 0; // Current Y position in the SOURCE image (in pixels)

        while (imgRemainingHeight > 0) {
            const ratio = contentWidth / imgWidth;
            const availablePageHeight = maxPageHeight - currentY;
            
            // How many pixels of the source image can we fit in the remaining space?
            let pixelsToFit = availablePageHeight / ratio;
            
            // If we are at the start of a section and it can't even fit 20% of a page, 
            // or it's a forced break section, move to a new page first
            if (imgCurrentY === 0 && (pixelsToFit < imgHeight * 0.2 || (hasForcedBreak && currentY > margin + 20))) {
                addFooter(pdf, currentPage, pdfWidth, pdfHeight, margin);
                pdf.addPage();
                currentPage++;
                currentY = margin;
                pixelsToFit = (maxPageHeight - currentY) / ratio;
            }

            // Determine how much we will actually take in this step
            const srcHeightToTake = Math.min(imgRemainingHeight, pixelsToFit);
            const targetHeight = srcHeightToTake * ratio;

            // Create a temporary canvas to crop the image
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = imgWidth;
            tempCanvas.height = srcHeightToTake;
            const ctx = tempCanvas.getContext('2d');
            
            // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            ctx.drawImage(canvas, 0, imgCurrentY, imgWidth, srcHeightToTake, 0, 0, imgWidth, srcHeightToTake);
            
            const croppedImgData = tempCanvas.toDataURL('image/jpeg', 0.9);
            
            pdf.addImage(croppedImgData, 'JPEG', margin, currentY, contentWidth, targetHeight, undefined, 'FAST');

            imgRemainingHeight -= srcHeightToTake;
            imgCurrentY += srcHeightToTake;
            currentY += targetHeight;

            // If we still have image left, it means we hit the bottom of the page
            if (imgRemainingHeight > 0) {
                addFooter(pdf, currentPage, pdfWidth, pdfHeight, margin);
                pdf.addPage();
                currentPage++;
                currentY = margin;
            } else {
                currentY += 10; // Padding after the section finishes
            }
        }
        // --- END SPLITTING LOGIC ---

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
    } catch {
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
