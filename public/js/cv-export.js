/**
 * CV PDF Export
 * =============
 * Automatic PDF download with dark theme preservation.
 * Uses html2pdf.js (lazy-loaded on first click).
 *
 * Strategy: clone #cvRoot, strip every <svg> from the clone,
 * render offscreen, then download. The original DOM is never touched.
 */

(function () {
  "use strict";

  /* ── DOM refs ───────────────────────────────────────────── */
  var downloadBtn = document.getElementById("downloadCvBtn");
  var printBtn = document.getElementById("printCvBtn");
  var cvRoot = document.getElementById("cvRoot");
  var toast = document.getElementById("cv-toast");
  var toastMsg = document.getElementById("toast-message");

  if (!downloadBtn || !cvRoot) {
    console.warn("CV Export: #downloadCvBtn or #cvRoot not found");
    return;
  }

  /* ── Toast ──────────────────────────────────────────────── */
  var toastTimer;
  function showToast(msg, type) {
    if (!toast || !toastMsg) return;
    var icons = {
      success:
        '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
      error:
        '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
      info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    };
    var svg = toast.querySelector("svg");
    if (svg) svg.innerHTML = icons[type] || icons.info;
    toast.className = "cv-toast " + (type || "info");
    toastMsg.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 4500);
  }

  /* ── Lazy-load html2pdf.js ──────────────────────────────── */
  function addScript(url) {
    return new Promise(function (ok, fail) {
      var s = document.createElement("script");
      s.src = url;
      s.onload = function () {
        // Give the library a moment to initialize its globals
        setTimeout(ok, 300);
      };
      s.onerror = fail;
      document.head.appendChild(s);
    });
  }

  function ensureLib() {
    if (window.html2pdf) return Promise.resolve();
    return addScript(
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js",
    ).catch(function () {
      return addScript(
        "https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js",
      );
    });
  }

  /* ── Compute all styles for an element (for accurate cloning) ── */
  function inlineComputedStyles(sourceEl, targetEl) {
    var computed = getComputedStyle(sourceEl);
    var importantProps = [
      "color",
      "background-color",
      "background",
      "background-image",
      "font-family",
      "font-size",
      "font-weight",
      "line-height",
      "letter-spacing",
      "text-transform",
      "padding",
      "margin",
      "border",
      "border-radius",
      "display",
      "flex-direction",
      "justify-content",
      "align-items",
      "gap",
      "grid-template-columns",
      "width",
      "max-width",
      "text-align",
      "white-space",
      "overflow",
      "position",
      "box-sizing",
      "-webkit-text-fill-color",
      "-webkit-background-clip",
      "background-clip",
    ];
    importantProps.forEach(function (prop) {
      try {
        var val = computed.getPropertyValue(prop);
        if (val) targetEl.style.setProperty(prop, val);
      } catch (e) {
        /* skip */
      }
    });
  }

  /* ── Download handler ───────────────────────────────────── */
  var busy = false;

  function downloadPDF() {
    if (busy) return;
    busy = true;
    downloadBtn.classList.add("loading");
    downloadBtn.disabled = true;
    showToast("Generating PDF… please wait", "info");

    // Disable animations
    document.body.classList.add("exporting");

    ensureLib()
      .then(function () {
        if (!window.html2pdf) throw new Error("Library did not load");

        // ★ STRATEGY: Deep-clone #cvRoot, strip every <svg>,
        //   position offscreen, render, then remove.
        var clone = cvRoot.cloneNode(true);

        // Remove every SVG element from the clone
        var svgs = clone.querySelectorAll("svg");
        for (var i = svgs.length - 1; i >= 0; i--) {
          svgs[i].parentNode.removeChild(svgs[i]);
        }

        // Also remove any elements with background-image that might use SVG
        var allImgs = clone.querySelectorAll('img[src$=".svg"]');
        for (var j = allImgs.length - 1; j >= 0; j--) {
          allImgs[j].parentNode.removeChild(allImgs[j]);
        }

        // Fix gradient text rendering: inline the gradient text colors
        // because the clone loses CSS variable context
        var gradientTexts = clone.querySelectorAll(
          ".cv-section-title, .cv-doc-handles",
        );
        for (var k = 0; k < gradientTexts.length; k++) {
          gradientTexts[k].style.setProperty("background", "none", "important");
          gradientTexts[k].style.setProperty(
            "-webkit-text-fill-color",
            "#00d4ff",
            "important",
          );
          gradientTexts[k].style.setProperty("color", "#00d4ff", "important");
        }

        // Position the clone offscreen but visible (html2canvas needs it visible)
        clone.style.position = "fixed";
        clone.style.left = "-9999px";
        clone.style.top = "0";
        clone.style.width = cvRoot.offsetWidth + "px";
        clone.style.zIndex = "-1";
        clone.style.background = "#0b0f17";
        document.body.appendChild(clone);

        var opt = {
          margin: [6, 6, 6, 6],
          filename: "Christopher_Olabiyi_CV.pdf",
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: {
            scale: 2,
            logging: false,
            backgroundColor: "#0b0f17",
            letterRendering: true,
            useCORS: false,
            allowTaint: true,
            foreignObjectRendering: false,
            removeContainer: true,
            imageTimeout: 0,
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: {
            mode: ["avoid-all", "css", "legacy"],
            avoid: [
              ".cv-section",
              ".cv-project",
              ".cv-skill-group",
              ".cv-education-card",
            ],
          },
        };

        // Render from the SVG-free clone
        return window
          .html2pdf()
          .set(opt)
          .from(clone)
          .save()
          .then(function () {
            // Cleanup: remove the offscreen clone
            if (clone.parentNode) clone.parentNode.removeChild(clone);
          })
          .catch(function (err) {
            // Cleanup even on error
            if (clone.parentNode) clone.parentNode.removeChild(clone);
            throw err;
          });
      })
      .then(function () {
        showToast("CV downloaded successfully!", "success");
      })
      .catch(function (err) {
        console.error("PDF export failed:", err);
        showToast("Opening print dialog as fallback…", "error");
        // Fallback to reliable browser Print → Save as PDF
        setTimeout(function () {
          window.print();
        }, 1500);
      })
      .finally(function () {
        document.body.classList.remove("exporting");
        downloadBtn.classList.remove("loading");
        downloadBtn.disabled = false;
        busy = false;
      });
  }

  /* ── Wire up buttons ────────────────────────────────────── */
  downloadBtn.addEventListener("click", downloadPDF);

  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }

  /* ── Auto-download via hash (from index.html link) ──────── */
  if (window.location.hash === "#auto-download") {
    // Clear hash to prevent re-triggering on refresh
    if (history.replaceState) {
      history.replaceState(null, "", window.location.pathname);
    }
    // Wait for full page render before auto-triggering
    setTimeout(downloadPDF, 2000);
  }
})();
