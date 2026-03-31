import React from 'react';
import { Lightbulb, AlertCircle, Target, Sparkles } from 'lucide-react';
import { renderToString } from 'katex';

// --- GELİŞMİŞ MARKDOWN RENDERER ---

export function formatSubSup(str) {
  let safeStr = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return safeStr
    .replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
    .replace(/\^([a-zA-Z0-9+\-]+)/g, '<sup>$1</sup>')
    .replace(/_\{([^}]+)\}/g, '<sub>$1</sub>')
    .replace(/_([a-zA-Z0-9+\-]+)/g, '<sub>$1</sub>');
}

export function formatInline(text) {
  if (!text) return "";

  // Replace a few common LaTeX commands with unicode as a convenience
  let processedText = text
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\pi/g, 'π')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\rightarrow/g, '→');

  const parts = processedText.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  // Helper: render a text segment, replacing math with KaTeX HTML while escaping and
  // formatting the rest using formatSubSup.
  function renderTextWithMath(s) {
    if (!s) return '';
    // Match $$...$$ (display), $...$ (inline), \[...\] (display), \(...\) (inline)
    const mathRegex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+\$|\\\[[\s\S]+?\\\]|\\\([^\n]+?\\\))/g;
    let lastIndex = 0;
    let result = '';
    let match;
    while ((match = mathRegex.exec(s)) !== null) {
      const idx = match.index;
      const matchText = match[0];
      const before = s.substring(lastIndex, idx);
      result += formatSubSup(before);

      let mathContent = matchText;
      let display = false;
      if (matchText.startsWith('$$') && matchText.endsWith('$$')) {
        mathContent = matchText.slice(2, -2);
        display = true;
      } else if (matchText.startsWith('\\[') && matchText.endsWith('\\]')) {
        mathContent = matchText.slice(2, -2);
        display = true;
      } else if (matchText.startsWith('$') && matchText.endsWith('$')) {
        mathContent = matchText.slice(1, -1);
        display = false;
      } else if (matchText.startsWith('\\(') && matchText.endsWith('\\)')) {
        mathContent = matchText.slice(2, -2);
        display = false;
      }

      try {
        result += renderToString(mathContent, { throwOnError: false, displayMode: display });
      } catch (e) {
        // Fallback: show the raw (escaped) math if KaTeX fails
        result += formatSubSup(matchText);
      }

      lastIndex = idx + matchText.length;
    }

    result += formatSubSup(s.substring(lastIndex));
    return result;
  }

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-slate-800 dark:text-slate-200" dangerouslySetInnerHTML={{ __html: renderTextWithMath(part.slice(2, -2)) }} />;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: renderTextWithMath(part.slice(1, -1)) }} />;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-slate-100 dark:bg-slate-700 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded-md font-mono text-sm">{part.slice(1, -1)}</code>;
    }
    return <span key={i} dangerouslySetInnerHTML={{ __html: renderTextWithMath(part) }} />;
  });
}

const splitTableRow = (row) => {
  const parts = row.split('|');
  if (parts[0].trim() === '') parts.shift();
  if (parts.length > 0 && parts[parts.length - 1].trim() === '') parts.pop();
  return parts.map(p => p.trim());
};

export function renderMarkdown(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    let line = lines[i];

    // Fenced code blocks: ```lang ... ```
    if (line.trim().startsWith('```')) {
      const lang = line.trim().replace(/^```/, '').trim().toLowerCase();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // closing ```
      const codeContent = codeLines.join('\n');
      // text/plain blokları monospace preformatted (pedigree, dallanma hesapları için)
      if (lang === 'text' || lang === 'plain' || lang === '') {
        elements.push(
          <pre key={`code-${i}`} className="my-4 bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed border border-slate-700 whitespace-pre break-inside-avoid">
            {codeContent}
          </pre>
        );
      } else {
        elements.push(
          <div key={`code-${i}`} className="my-4 bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed border border-slate-700 break-inside-avoid">
            <pre><code>{codeContent}</code></pre>
          </div>
        );
      }
      continue;
    }

    let cleanLine = line.trim().replace(/^[-*\d+.]\s+/, '').trim();

    // GitHub-style callouts: > [!TIP], > [!NOTE], > [!WARNING], > [!IMPORTANT], > [!CAUTION]
    if (line.trim().startsWith('>')) {
      const blockquoteContent = line.trim().replace(/^>\s?/, '').trim();
      const ghCalloutMatch = blockquoteContent.match(/^\[!(TIP|NOTE|WARNING|IMPORTANT|CAUTION)\]\s*(.*)/i);
      if (ghCalloutMatch) {
        const type = ghCalloutMatch[1].toUpperCase();
        const rest = ghCalloutMatch[2].trim();
        // Collect continuation lines
        const contentLines = rest ? [rest] : [];
        i++;
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          const cont = lines[i].trim().replace(/^>\s?/, '').trim();
          if (cont) contentLines.push(cont);
          i++;
        }
        const fullText = contentLines.join(' ');
        if (type === 'TIP' || type === 'NOTE') {
          elements.push(
            <div key={i} className="my-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:bg-purple-950 dark:from-purple-950 dark:to-indigo-950 border border-purple-100 dark:border-purple-800 p-5 rounded-2xl shadow-sm relative overflow-hidden break-inside-avoid">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 dark:bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm no-print shrink-0"><Lightbulb className="text-purple-600 dark:text-purple-400" size={24} /></div>
                <div>
                  <span className="font-extrabold text-purple-700 dark:text-purple-300 uppercase tracking-widest text-xs mb-1.5 block opacity-80">Sınav Tüyosu</span>
                  <p className="text-purple-900 dark:text-purple-100 font-medium leading-relaxed">{formatInline(fullText)}</p>
                </div>
              </div>
            </div>
          );
        } else if (type === 'WARNING' || type === 'CAUTION') {
          elements.push(
            <div key={i} className="my-6 bg-gradient-to-br from-rose-50 to-red-50 dark:bg-rose-950 dark:from-rose-950 dark:to-red-950 border border-rose-100 dark:border-rose-800 p-5 rounded-2xl shadow-sm relative overflow-hidden break-inside-avoid">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 dark:bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm no-print shrink-0"><AlertCircle className="text-rose-600 dark:text-rose-400" size={24} /></div>
                <div>
                  <span className="font-extrabold text-rose-700 dark:text-rose-300 uppercase tracking-widest text-xs mb-1.5 block opacity-80">Kavram Yanılgısı / Tuzak</span>
                  <p className="text-rose-900 dark:text-rose-100 font-medium leading-relaxed">{formatInline(fullText)}</p>
                </div>
              </div>
            </div>
          );
        } else { // IMPORTANT
          elements.push(
            <div key={i} className="my-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:bg-emerald-950 dark:from-emerald-950 dark:to-teal-950 border border-emerald-100 dark:border-emerald-800 p-5 rounded-2xl shadow-sm relative overflow-hidden break-inside-avoid">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 dark:bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm no-print shrink-0"><Target className="text-emerald-600 dark:text-emerald-400" size={24} /></div>
                <div>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest text-xs mb-1.5 block opacity-80">Kritik Vurgu</span>
                  <p className="text-emerald-900 dark:text-emerald-100 font-medium leading-relaxed">{formatInline(fullText)}</p>
                </div>
              </div>
            </div>
          );
        }
        continue;
      }
    }

    // Normalize: **[TÜYO]**, **[DİKKAT]**, **[ÖNEMLİ]**, **[METAFOR]** → strip bold markers
    cleanLine = cleanLine.replace(/^\*\*(\[(?:TÜYO|DİKKAT|ÖNEMLİ|METAFOR)\])\*\*/, '$1');

    // [TÜYO] — mor/indigo
    if (cleanLine.startsWith('[TÜYO]')) {
      elements.push(
        <div key={i} className="my-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:bg-purple-950 dark:from-purple-950 dark:to-indigo-950 border border-purple-100 dark:border-purple-800 p-5 rounded-2xl shadow-sm relative overflow-hidden break-inside-avoid">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 dark:bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm no-print shrink-0">
              <Lightbulb className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div>
              <span className="font-extrabold text-purple-700 dark:text-purple-300 uppercase tracking-widest text-xs mb-1.5 block opacity-80">Sınav Tüyosu</span>
              <p className="text-purple-900 dark:text-purple-100 font-medium leading-relaxed">{formatInline(cleanLine.replace('[TÜYO]', '').trim())}</p>
            </div>
          </div>
        </div>
      );
      i++; continue;
    }

    // [DİKKAT] — kırmızı/rose
    if (cleanLine.startsWith('[DİKKAT]')) {
      elements.push(
        <div key={i} className="my-6 bg-gradient-to-br from-rose-50 to-red-50 dark:bg-rose-950 dark:from-rose-950 dark:to-red-950 border border-rose-100 dark:border-rose-800 p-5 rounded-2xl shadow-sm relative overflow-hidden break-inside-avoid">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 dark:bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm no-print shrink-0">
              <AlertCircle className="text-rose-600 dark:text-rose-400" size={24} />
            </div>
            <div>
              <span className="font-extrabold text-rose-700 dark:text-rose-300 uppercase tracking-widest text-xs mb-1.5 block opacity-80">Kavram Yanılgısı / Tuzak</span>
              <p className="text-rose-900 dark:text-rose-100 font-medium leading-relaxed">{formatInline(cleanLine.replace('[DİKKAT]', '').trim())}</p>
            </div>
          </div>
        </div>
      );
      i++; continue;
    }

    // [ÖNEMLİ] — yeşil/emerald
    if (cleanLine.startsWith('[ÖNEMLİ]')) {
      elements.push(
        <div key={i} className="my-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:bg-emerald-950 dark:from-emerald-950 dark:to-teal-950 border border-emerald-100 dark:border-emerald-800 p-5 rounded-2xl shadow-sm relative overflow-hidden break-inside-avoid">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 dark:bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm no-print shrink-0">
              <Target className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <div>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest text-xs mb-1.5 block opacity-80">Kritik Vurgu</span>
              <p className="text-emerald-900 dark:text-emerald-100 font-medium leading-relaxed">{formatInline(cleanLine.replace('[ÖNEMLİ]', '').trim())}</p>
            </div>
          </div>
        </div>
      );
      i++; continue;
    }

    // [METAFOR] — mavi/cyan
    if (cleanLine.startsWith('[METAFOR]')) {
      elements.push(
        <div key={i} className="my-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:bg-blue-950 dark:from-blue-950 dark:to-cyan-950 border border-blue-100 dark:border-blue-800 p-5 rounded-2xl shadow-sm relative overflow-hidden break-inside-avoid">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 dark:bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm no-print shrink-0">
              <Sparkles className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <span className="font-extrabold text-blue-700 dark:text-blue-300 uppercase tracking-widest text-xs mb-1.5 block opacity-80">Akılda Kalıcı Analoji</span>
              <p className="text-blue-900 dark:text-blue-100 font-medium leading-relaxed">{formatInline(cleanLine.replace('[METAFOR]', '').trim())}</p>
            </div>
          </div>
        </div>
      );
      i++; continue;
    }

    if (line.startsWith('##### ')) {
      elements.push(<h5 key={i} className="text-base font-bold mt-4 mb-2 text-indigo-700 dark:text-indigo-400 pl-2 break-after-avoid">{formatInline(line.replace('##### ', ''))}</h5>);
      i++; continue;
    }
    if (line.startsWith('#### ')) {
      elements.push(<h4 key={i} className="text-lg font-bold mt-6 mb-3 text-indigo-800 dark:text-indigo-300 border-l-[3px] border-indigo-400 dark:border-indigo-600 pl-3 py-1 bg-indigo-50/30 dark:bg-indigo-950/30 rounded-r-lg break-after-avoid">{formatInline(line.replace('#### ', ''))}</h4>);
      i++; continue;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-xl font-bold mt-8 mb-4 text-indigo-900 dark:text-indigo-200 border-l-[4px] border-indigo-500 dark:border-indigo-600 pl-4 py-1.5 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-r-xl break-after-avoid">{formatInline(line.replace('### ', ''))}</h3>);
      i++; continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-bold mt-10 mb-4 text-slate-800 dark:text-slate-100 border-b-2 border-slate-100 dark:border-slate-700 pb-2 break-after-avoid">{formatInline(line.replace('## ', ''))}</h2>);
      i++; continue;
    }
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-3xl font-extrabold mt-8 mb-6 text-indigo-950 dark:text-indigo-100 break-after-avoid">{formatInline(line.replace('# ', ''))}</h1>);
      i++; continue;
    }

    // Tablo — daha esnek algılama: hem |...| hem de pipe-less ("a | b") stilleri
    const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
    const looksLikeTableHeader = line.includes('|') && nextLine.includes('---');
    if (looksLikeTableHeader) {
      const tableRows = [];
      // Topla: satırlar ya pipe içeriyorsa ya da ayırıcı (---) satırıysa tabloya dahil et
      while (i < lines.length && (lines[i].includes('|') || lines[i].includes('---'))) {
        tableRows.push(lines[i]);
        i++;
      }

      if (tableRows.length >= 2) {
        const headers = splitTableRow(tableRows[0]);
        const dataRows = tableRows.slice(2).map(splitTableRow);

        elements.push(
          <div key={`table-${i}`} className="overflow-x-auto my-6 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm break-inside-avoid">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead>
                <tr>
                  {headers.map((h, idx) => (
                    <th key={idx} className="px-6 py-4 text-left text-sm font-bold text-slate-700 dark:text-slate-200 tracking-wider bg-slate-100 dark:bg-slate-800">{formatInline(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{formatInline(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    if (line.trim().match(/^\d+\.\s/)) {
      const listItems = [];
      let startNumMatch = line.trim().match(/^(\d+)\.\s/);
      let startNum = startNumMatch ? parseInt(startNumMatch[1], 10) : 1;

      while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
        let currentCleanLine = lines[i].trim().replace(/^\d+\.\s/, '').trim();
        if (currentCleanLine.startsWith('[TÜYO]') || currentCleanLine.startsWith('[DİKKAT]') || currentCleanLine.startsWith('[ÖNEMLİ]') || currentCleanLine.startsWith('[METAFOR]')) {
          break;
        }
        listItems.push(currentCleanLine);
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} start={startNum} className="ml-6 mb-6 list-decimal marker:text-indigo-600 dark:marker:text-indigo-400 marker:font-bold font-medium pl-2 text-slate-800 dark:text-slate-200 space-y-2">
          {listItems.map((item, idx) => <li key={idx}>{formatInline(item)}</li>)}
        </ol>
      );
      continue;
    }

    if (line.trim().match(/^[-*]\s/)) {
      const listItems = [];
      while (i < lines.length && lines[i].trim().match(/^[-*]\s/)) {
        let currentCleanLine = lines[i].trim().replace(/^[-*]\s/, '').trim();
        if (currentCleanLine.startsWith('[TÜYO]') || currentCleanLine.startsWith('[DİKKAT]') || currentCleanLine.startsWith('[ÖNEMLİ]') || currentCleanLine.startsWith('[METAFOR]')) {
          break;
        }
        listItems.push(currentCleanLine);
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="ml-6 mb-6 list-disc marker:text-indigo-400 dark:marker:text-indigo-500 pl-2 space-y-2 text-slate-700 dark:text-slate-300">
          {listItems.map((item, idx) => <li key={idx}>{formatInline(item)}</li>)}
        </ul>
      );
      continue;
    }

    if (line.trim().startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="my-4 border-l-4 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-r-xl text-slate-700 dark:text-slate-300 italic break-inside-avoid">
          <p>{formatInline(line.substring(2))}</p>
        </blockquote>
      );
      i++; continue;
    }

    if (line.trim() === '') {
      elements.push(<div key={i} className="h-4"></div>);
      i++; continue;
    }

    elements.push(<p key={i} className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300 text-lg">{formatInline(line)}</p>);
    i++;
  }

  return elements;
}
