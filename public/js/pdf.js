/**
 * public/js/pdf.js
 * PDF generation using html2canvas + jsPDF.
 * Exports the #resume-paper element as an A4 PDF.
 */

const PDF = (() => {

  async function download() {
    const btn = document.getElementById('btn-download');
    const paper = document.getElementById('resume-paper');
    if (!paper) return;

    // Guard: libraries must be loaded
    if (!window.html2canvas || !window.jspdf) {
      Toast.show('PDF libraries still loading, please wait…', 'error');
      return;
    }

    btn.disabled = true;
    btn.textContent = '⏳ Generating…';
    Toast.show('Rendering PDF…');

    try {
      // Render at 2× scale for crisp output
      const canvas = await html2canvas(paper, {
        scale:           2,
        useCORS:         true,
        backgroundColor: '#ffffff',
        logging:         false,
        windowWidth:     paper.scrollWidth,
        windowHeight:    paper.scrollHeight,
        onclone: doc => {
          // Ensure all fonts are loaded in the cloned doc
          doc.fonts?.ready;
        }
      });

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      const imgRatio = canvas.width / canvas.height;
      let imgW = pageW;
      let imgH = pageW / imgRatio;

      // If content taller than one page, split across pages
      const pageHeightInPx = (pageH / pageW) * canvas.width;

      if (canvas.height <= pageHeightInPx) {
        // Single page
        if (imgH > pageH) { imgH = pageH; imgW = pageH * imgRatio; }
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgW, imgH);
      } else {
        // Multi-page: slice canvas into page-height segments
        let yOffset = 0;
        while (yOffset < canvas.height) {
          const sliceH = Math.min(pageHeightInPx, canvas.height - yOffset);
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width  = canvas.width;
          sliceCanvas.height = sliceH;
          sliceCanvas.getContext('2d').drawImage(canvas, 0, -yOffset);
          const sliceImg = sliceCanvas.toDataURL('image/png');
          const slicePageH = (sliceH / canvas.width) * pageW;
          if (yOffset > 0) pdf.addPage();
          pdf.addImage(sliceImg, 'PNG', 0, 0, pageW, slicePageH);
          yOffset += sliceH;
        }
      }

      const name = (State.get('name') || 'resume').replace(/\s+/g,'_');
      pdf.save(`${name}_resume.pdf`);
      Toast.show('PDF downloaded!', 'success');

    } catch (err) {
      console.error('[PDF]', err);
      Toast.show('PDF export failed. See console.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = '⬇ Download PDF';
    }
  }

  return { download };
})();
