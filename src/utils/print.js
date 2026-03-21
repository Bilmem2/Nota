// --- PDF YAZDIRMA YARDIMCISI ---
export function handlePrint(elementId, title) {
  const content = document.getElementById(elementId).innerHTML;
  const printWindow = window.open('', '_blank');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>${title} - Yapay Öğretmen</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
            .page-break { page-break-after: always; clear: both; padding-top: 2rem; }
          }
        </style>
      </head>
      <body class="p-8 md:p-12 font-sans text-slate-800 bg-white">
        <div class="mb-8 border-b-2 border-slate-200 pb-4 flex items-center gap-4">
          <h1 class="text-3xl font-extrabold text-indigo-900">${title}</h1>
        </div>
        <div class="prose prose-slate max-w-none">
          ${content}
        </div>
        <script>
          setTimeout(() => {
            window.print();
            window.close();
          }, 1000);
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
