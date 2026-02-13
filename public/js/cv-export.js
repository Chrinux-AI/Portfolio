/**
 * CV PDF Export
 * =============
 * Automatic PDF download with dark theme preservation.
 * Uses html2pdf.js (lazy-loaded on first click).
 *
 * Strategy: render #cvRoot directly, telling html2canvas to
 * skip every <svg> element via ignoreElements. No DOM mutation,
 * no cloning — simple and reliable.
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
      success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
      error: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
      info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'
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
      s.onload = ok;
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

  /* ── Download handler ───────────────────────────────────── */
  var busy = false;

  function downloadPDF() {
    if (busy) return;
    busy = true;
    downloadBtn.classList.add("loading");
    downloadBtn.disabled = true;
    showToast("Generating PDF…", "info");

    // Disable animations
    document.body.classList.add("exporting");

    ensureLib()
      .then(function () {
        if (!window.html2pdf) throw new Error("Library did not load");

        var opt = {
          margin: [6, 6, 6, 6],
          filename: "Christopher_Olabiyi_CV.pdf",
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: {
            scale: 2,
            logging: false,
            backgroundColor: "#0b0f17",
            letterRendering: true,
            useCORS: true,
            allowTaint: true,
            // ★ This is the key — skip every SVG so html2canvas
            //   never tries to parse them (no "Unsupported image type")
            ignoreElements: function (el) {
              return el.tagName === "svg" || el.tagName === "SVG";
            }
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: {
            mode: ["avoid-all", "css", "legacy"],
            avoid: [
              ".cv-section",
              ".cv-project",
              ".cv-skill-group",
              ".cv-education-card"
            ]
          }
        };

        // Render directly from #cvRoot — no cloning, no DOM mutation
        return window.html2pdf().set(opt).from(cvRoot).save();
      })
      .then(function () {
        showToast("CV downloaded successfully!", "success");
      })
      .catch(function (err) {
        console.error("PDF export failed:", err);
        showToast("PDF export failed. Try Print instead.", "error");
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
})();
