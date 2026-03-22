// --- SINAV RAPORU İNDİR ---
export function downloadQuizReport({ quiz, answers, verdicts, isAnswerCorrect, studyTitle, appLang }) {
  const correctCount = quiz.filter((q, i) => verdicts[i]?.isCorrect ?? isAnswerCorrect(answers[i], q.dogruCevap)).length;
  const answeredCount = quiz.filter((q, i) => answers[i] && answers[i].toString().trim() !== '').length;
  const wrongCount = answeredCount - correctCount;
  const emptyCount = quiz.length - answeredCount;
  const score = Math.round((correctCount / quiz.length) * 100);
  const date = new Date().toLocaleDateString(appLang === 'en' ? 'en-US' : 'tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
  const scoreColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  const questionsHtml = quiz.map((q, i) => {
    const uAnswer = answers[i];
    const verdict = verdicts[i];
    const isCorrect = verdict ? verdict.isCorrect : isAnswerCorrect(uAnswer, q.dogruCevap);
    const isEmpty = !uAnswer || uAnswer.toString().trim() === '';
    const borderColor = isCorrect ? '#d1fae5' : '#fee2e2';
    const bgColor = isCorrect ? '#f0fdf4' : '#fff5f5';
    return `
      <div style="border:2px solid ${borderColor};background:${bgColor};border-radius:12px;padding:16px;margin-bottom:12px;">
        <p style="font-weight:700;margin:0 0 8px;font-size:14px;">
          <span style="background:#e2e8f0;padding:2px 8px;border-radius:6px;font-size:11px;margin-right:8px;">${q.tip.replace('_', ' ')}</span>
          ${i + 1}. ${q.soru}
        </p>
        <p style="margin:4px 0;font-size:13px;color:${isCorrect ? '#065f46' : isEmpty ? '#64748b' : '#991b1b'};">
          <strong>${appLang === 'en' ? 'Your Answer:' : 'Cevabınız:'}</strong> ${isEmpty ? (appLang === 'en' ? 'Left Blank' : 'Boş Bırakıldı') : uAnswer}
        </p>
        ${!isCorrect ? `
          <p style="margin:4px 0;font-size:13px;color:#065f46;"><strong>${appLang === 'en' ? 'Correct Answer:' : 'Doğru Cevap:'}</strong> ${q.dogruCevap}</p>
          <p style="margin:8px 0 0;font-size:12px;color:#3730a3;background:#eef2ff;padding:8px 12px;border-radius:8px;">${verdict?.feedback || q.aciklama || ''}</p>
        ` : (verdict?.feedback ? `<p style="margin:8px 0 0;font-size:12px;color:#065f46;background:#d1fae5;padding:8px 12px;border-radius:8px;">${verdict.feedback}</p>` : '')}
      </div>`;
  }).join('');

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`<!DOCTYPE html><html lang="${appLang === 'en' ? 'en' : 'tr'}"><head>
    <meta charset="UTF-8"><title>${studyTitle} - ${appLang === 'en' ? 'Quiz Report' : 'Sınav Raporu'}</title>
    <style>
      body{font-family:system-ui,sans-serif;color:#1e293b;background:#fff;margin:0;padding:32px;}
      @media print{body{padding:16px;}.no-print{display:none!important;}}
    </style>
  </head><body>
    <div style="border-bottom:3px solid #6366f1;padding-bottom:16px;margin-bottom:24px;">
      <h1 style="margin:0;font-size:24px;color:#4f46e5;">${studyTitle}</h1>
      <p style="margin:4px 0 0;color:#64748b;font-size:14px;">${appLang === 'en' ? 'Quiz Report' : 'Sınav Raporu'} · ${date}</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px;">
      <div style="text-align:center;padding:16px;border-radius:12px;background:#f8fafc;border:2px solid #e2e8f0;">
        <div style="font-size:36px;font-weight:900;color:${scoreColor};">${score}</div>
        <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;">${appLang === 'en' ? 'Score' : 'Puan'}</div>
      </div>
      <div style="text-align:center;padding:16px;border-radius:12px;background:#f0fdf4;border:2px solid #d1fae5;">
        <div style="font-size:36px;font-weight:900;color:#10b981;">${correctCount}</div>
        <div style="font-size:12px;font-weight:700;color:#065f46;text-transform:uppercase;">${appLang === 'en' ? 'Correct' : 'Doğru'}</div>
      </div>
      <div style="text-align:center;padding:16px;border-radius:12px;background:#fff5f5;border:2px solid #fee2e2;">
        <div style="font-size:36px;font-weight:900;color:#ef4444;">${wrongCount}</div>
        <div style="font-size:12px;font-weight:700;color:#991b1b;text-transform:uppercase;">${appLang === 'en' ? 'Wrong' : 'Yanlış'}</div>
      </div>
      <div style="text-align:center;padding:16px;border-radius:12px;background:#f8fafc;border:2px solid #e2e8f0;">
        <div style="font-size:36px;font-weight:900;color:#64748b;">${emptyCount}</div>
        <div style="font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;">${appLang === 'en' ? 'Blank' : 'Boş'}</div>
      </div>
    </div>
    <h2 style="font-size:16px;font-weight:800;margin:0 0 16px;">${appLang === 'en' ? 'Question Details' : 'Soru Detayları'}</h2>
    ${questionsHtml}
    <script>setTimeout(()=>{window.print();window.close();},800);<\/script>
  </body></html>`);
  printWindow.document.close();
}

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
