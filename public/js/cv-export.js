/**
 * CV PDF Export
 * =============
 * Automatic dark-themed PDF download — no print dialog.
 * Uses html2pdf.js (lazy-loaded on first click).
 *
 * Root-cause of previous blank PDFs:
 *   1. html2canvas CANNOT parse radial-gradient() on #cvRoot → transparent bg
 *   2. html2canvas CANNOT do -webkit-background-clip: text → invisible text
 *   3. SVG elements crash html2canvas with "Unsupported image type"
 *
 * Fix: hide SVGs on the live DOM, then use the `onclone` callback to
 * solidify all backgrounds and fix gradient-text in html2canvas's own
 * internal clone BEFORE it renders the canvas.
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
    var svgEl = toast.querySelector("svg");
    if (svgEl) svgEl.innerHTML = icons[type] || icons.info;
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
        setTimeout(ok, 300);
      };
      s.onerror = fail;
      document.head.appendChild(s);
    });
  }

  function ensureLib() {
    if (window.html2pdf) return Promise.resolve();
    return addScript(
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
    ).catch(function () {
      return addScript(
        "https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js"
      );
    });
  }

  /* ── Fix html2canvas's internal clone before it renders ─── */
  function onCloneFix(clonedDoc) {
    var root = clonedDoc.getElementById("cvRoot");
    if (!root) return;

    // ── Inject a <style> block to override things html2canvas can't handle ──
    var patch = clonedDoc.createElement("style");
    patch.textContent = [
      // Kill the radial-gradient on #cvRoot (html2canvas can't parse it)
      "#cvRoot { background: #0b0f17 !important; }",

      // Kill gradient-text (background-clip:text is unsupported)
      ".cv-section-title, .cv-doc-handles {",
      "  background: none !important;",
      "  background-image: none !important;",
      "  -webkit-background-clip: initial !important;",
      "  background-clip: initial !important;",
      "  -webkit-text-fill-color: #00d4ff !important;",
      "  color: #00d4ff !important;",
      "}",

      // Solid background for the document card
      ".cv-document { background: #111827 !important; }",

      // Flatten the ::before gradient bar to a solid color
      ".cv-document::before { background: #00d4ff !important; }",

      // Cards
      ".cv-skill-group, .cv-project, .cv-education-card, .cv-interest-tag {",
      "  background: #1a2234 !important;",
      "}",

      // Kill all animations
      "* { animation: none !important; transition: none !important; }",
    ].join("\n");
    clonedDoc.head.appendChild(patch);
  }

  /* ── Download handler ───────────────────────────────────── */
  var busy = false;

  function downloadPDF() {
    if (busy) return;
    busy = true;
    downloadBtn.classList.add("loading");
    downloadBtn.disabled = true;
    showToast("Generating PDF… please wait", "info");

    // Disable CSS animations on the live page
    document.body.classList.add("exporting");

    // Step 1: Hide every SVG inside #cvRoot so html2canvas never sees them
    var hiddenSvgs = [];
    var allSvgs = cvRoot.querySelectorAll("svg");
    for (var i = 0; i < allSvgs.length; i++) {
      var svg = allSvgs[i];
      var prev = svg.style.display;
      svg.style.setProperty("display", "none", "important");
      hiddenSvgs.push({ el: svg, prev: prev });
    }

    ensureLib()
      .then(function () {
        if (!window.html2pdf) throw new Error("Library did not load");

        var opt = {
          margin: [6, 6, 6, 6],
          filename: "Christopher_Olabiyi_CV.pdf",
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: {
            scale: 2,
            logging: true,
            backgroundColor: "#0b0f17",
            letterRendering: true,
            useCORS: true,
            allowTaint: true,
            // ★ THE KEY FIX — onclone runs on html2canvas's internal clone
            // BEFORE it renders. We override radial-gradients & clip-text
            // with solid colors so html2canvas can actually render them.
            onclone: onCloneFix,
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

        // Step 2: Render directly from #cvRoot (SVGs hidden, onclone fixes rest)
        return window.html2pdf().set(opt).from(cvRoot).save();
      })
      .then(function () {
        showToast("CV downloaded successfully!", "success");
      })
      .catch(function (err) {
        console.error("PDF export failed:", err);
        showToast("Opening print dialog as fallback…", "error");
        setTimeout(function () {
          window.print();
        }, 1500);
      })
      .finally(function () {
        // Step 3: Restore all SVGs
        for (var j = 0; j < hiddenSvgs.length; j++) {
          var item = hiddenSvgs[j];
          if (item.prev) {
            item.el.style.display = item.prev;
          } else {
            item.el.style.removeProperty("display");
          }
        }
        hiddenSvgs = [];

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
    if (history.replaceState) {
      history.replaceState(null, "", window.location.pathname);
    }
    setTimeout(downloadPDF, 2000);
  }
})();
