/**
 * CV PDF Export
 * =============
 * Automatic PDF download with dark theme preservation
 * Uses html2pdf.js (lazy-loaded for performance)
 */

(async function () {
  // Lazy-load html2pdf.js only when needed
  async function loadHtml2Pdf() {
    if (window.html2pdf) return;

    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      // Use a reliable CDN with fallback
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.crossOrigin = "anonymous";
      script.onload = () => {
        // Give it a moment to initialize
        setTimeout(resolve, 100);
      };
      script.onerror = () => {
        // Try alternate CDN
        const fallback = document.createElement("script");
        fallback.src =
          "https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js";
        fallback.onload = () => setTimeout(resolve, 100);
        fallback.onerror = reject;
        document.head.appendChild(fallback);
      };
      document.head.appendChild(script);
    });
  }

  // DOM elements
  const downloadBtn = document.getElementById("downloadCvBtn");
  const printBtn = document.getElementById("printCvBtn");
  const cvRoot = document.getElementById("cvRoot");
  const toast = document.getElementById("cv-toast");
  const toastMessage = document.getElementById("toast-message");

  if (!downloadBtn || !cvRoot) {
    console.warn("CV Export: Required elements not found");
    return;
  }

  // Toast notification
  function showToast(message, type = "info") {
    if (!toast || !toastMessage) {
      // Fallback to alert if toast elements don't exist
      if (type === "error") {
        alert(message);
      }
      return;
    }

    const iconPaths = {
      success:
        '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
      error:
        '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
      info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    };

    const svg = toast.querySelector("svg");
    if (svg) svg.innerHTML = iconPaths[type] || iconPaths.info;

    toast.className = "cv-toast " + type;
    toastMessage.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }

  // Convert SVG to PNG data URL
  async function svgToPng(svg) {
    return new Promise((resolve, reject) => {
      try {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        // Get SVG dimensions
        const bbox = svg.getBoundingClientRect();
        canvas.width = bbox.width * 2 || 32;
        canvas.height = bbox.height * 2 || 32;

        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/png"));
        };

        img.onerror = () => {
          resolve(null); // Return null on error, we'll handle it
        };

        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        img.src = URL.createObjectURL(svgBlob);
      } catch (e) {
        resolve(null);
      }
    });
  }

  // PDF Download handler
  async function downloadPDF() {
    // Set loading state
    downloadBtn.classList.add("loading");
    downloadBtn.disabled = true;

    // Store original SVGs for restoration
    const svgReplacements = [];

    try {
      // Load library on demand
      await loadHtml2Pdf();

      if (!window.html2pdf) {
        throw new Error("html2pdf library failed to load");
      }

      // Add exporting class to disable animations
      document.body.classList.add("exporting");

      // Replace SVGs with PNG images
      const svgs = cvRoot.querySelectorAll("svg");
      for (const svg of svgs) {
        try {
          const pngDataUrl = await svgToPng(svg);
          if (pngDataUrl) {
            const img = document.createElement("img");
            img.src = pngDataUrl;
            img.style.width = svg.getBoundingClientRect().width + "px";
            img.style.height = svg.getBoundingClientRect().height + "px";
            img.style.display = "inline-block";
            img.style.verticalAlign = "middle";

            svgReplacements.push({
              svg,
              parent: svg.parentNode,
              nextSibling: svg.nextSibling,
            });
            svg.parentNode.replaceChild(img, svg);
          } else {
            // Hide SVGs that can't be converted
            svg.style.setProperty("display", "none", "important");
            svgReplacements.push({ svg, hidden: true });
          }
        } catch (e) {
          svg.style.setProperty("display", "none", "important");
          svgReplacements.push({ svg, hidden: true });
        }
      }

      // Configure for high-quality dark theme export
      const opt = {
        margin: [8, 8, 8, 8],
        filename: "Christopher_Olabiyi_CV.pdf",
        image: { type: "jpeg", quality: 0.92 },
        html2canvas: {
          scale: 2,
          useCORS: false,
          logging: false,
          backgroundColor: "#0b0f17",
          letterRendering: true,
          allowTaint: true,
          foreignObjectRendering: false,
          removeContainer: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
          avoid: [
            ".cv-project",
            ".cv-skill-group",
            ".cv-education-card",
            ".cv-section",
          ],
        },
      };

      // Generate and auto-download PDF (no print dialog)
      await window.html2pdf().set(opt).from(cvRoot).save();

      showToast("CV downloaded successfully!", "success");
    } catch (error) {
      console.error("PDF export failed:", error);
      showToast("PDF export failed. Try the Print option instead.", "error");
    } finally {
      // Restore SVGs
      svgReplacements.forEach(({ svg, parent, nextSibling, hidden }) => {
        if (hidden) {
          svg.style.removeProperty("display");
        } else if (parent) {
          // Find the replacement img and swap back
          const currentImg = parent.querySelector('img[src^="data:image/png"]');
          if (currentImg) {
            parent.replaceChild(svg, currentImg);
          } else if (nextSibling) {
            parent.insertBefore(svg, nextSibling);
          } else {
            parent.appendChild(svg);
          }
        }
      });

      // Cleanup
      document.body.classList.remove("exporting");
      downloadBtn.classList.remove("loading");
      downloadBtn.disabled = false;
    }
  }

  // Event listeners
  downloadBtn.addEventListener("click", downloadPDF);

  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }
})();
