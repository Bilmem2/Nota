import React from 'react';
import { Lightbulb, AlertCircle, Target } from 'lucide-react';

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

  let processedText = text
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\pi/g, 'π')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\rightarrow/g, '→')
    .replace(/\$([^\$]+)\$/g, '$1');

  const parts = processedText.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-slate-800" dangerouslySetInnerHTML={{ __html: formatSubSup(part.slice(2, -2)) }} />;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-slate-700" dangerouslySetInnerHTML={{ __html: formatSubSup(part.slice(1, -1)) }} />;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-slate-100 text-rose-600 px-1.5 py-0.5 rounded-md font-mono text-sm">{part.slice(1, -1)}</code>;
    }
    return <span key={i} dangerouslySetInnerHTML={{ __html: formatSubSup(part) }} />;
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
    let cleanLine = line.trim().replace(/^[-*\d+.]\s+/, '').trim();

    if (cleanLine.startsWith('[TÜYO]')) {
      elements.push(
        <div key={i} className="my-6 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 p-5 rounded-2xl shadow-sm relative overflow-hidden break-inside-avoid">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-white p-2 rounded-xl shadow-sm no-print">
              <Lightbulb className="shrink-0 text-purple-600" size={24} />
            </div>
            <div>
              <span className="font-extrabold text-purple-800 uppercase tracking-widest text-xs mb-1.5 block opacity-80">Sınav Tüyosu</span>
              <p className="text-purple-950 font-medium leading-relaxed">{formatInline(cleanLine.replace('[TÜYO]', '').trim())}</p>
            </div>
          </div>
        </div>
      );
      i++; continue;
    }

    if (cleanLine.startsWith('[DİKKAT]')) {
      elements.push(
        <div key={i} className="my-6 bg-gradient-to-br from-rose-50 to-red-50 border border-rose-100 p-5 rounded-2xl shadow-sm relative overflow-hidden break-inside-avoid">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-white p-2 rounded-xl shadow-sm no-print">
              <AlertCircle className="shrink-0 text-rose-600" size={24} />
            </div>
            <div>
              <span className="font-extrabold text-rose-800 uppercase tracking-widest text-xs mb-1.5 block opacity-80">Kavram Yanılgısı / Tuzak</span>
              <p className="text-rose-950 font-medium leading-relaxed">{formatInline(cleanLine.replace('[DİKKAT]', '').trim())}</p>
            </div>
          </div>
        </div>
      );
      i++; continue;
    }

    if (cleanLine.startsWith('[ÖNEMLİ]')) {
      elements.push(
        <div key={i} className="my-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-5 rounded-2xl shadow-sm relative overflow-hidden break-inside-avoid">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-white p-2 rounded-xl shadow-sm no-print">
              <Target className="shrink-0 text-emerald-600" size={24} />
            </div>
            <div>
              <span className="font-extrabold text-emerald-800 uppercase tracking-widest text-xs mb-1.5 block opacity-80">Kritik Vurgu</span>
              <p className="text-emerald-950 font-medium leading-relaxed">{formatInline(cleanLine.replace('[ÖNEMLİ]', '').trim())}</p>
            </div>
          </div>
        </div>
      );
      i++; continue;
    }

    if (line.startsWith('##### ')) {
      elements.push(<h5 key={i} className="text-base font-bold mt-4 mb-2 text-indigo-700 pl-2 break-after-avoid">{formatInline(line.replace('##### ', ''))}</h5>);
      i++; continue;
    }
    if (line.startsWith('#### ')) {
      elements.push(<h4 key={i} className="text-lg font-bold mt-6 mb-3 text-indigo-800 border-l-[3px] border-indigo-400 pl-3 py-1 bg-indigo-50/30 rounded-r-lg break-after-avoid">{formatInline(line.replace('#### ', ''))}</h4>);
      i++; continue;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-xl font-bold mt-8 mb-4 text-indigo-900 border-l-[4px] border-indigo-500 pl-4 py-1.5 bg-indigo-50/50 rounded-r-xl break-after-avoid">{formatInline(line.replace('### ', ''))}</h3>);
      i++; continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-bold mt-10 mb-4 text-slate-800 border-b-2 border-slate-100 pb-2 break-after-avoid">{formatInline(line.replace('## ', ''))}</h2>);
      i++; continue;
    }
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-3xl font-extrabold mt-8 mb-6 text-indigo-950 break-after-avoid">{formatInline(line.replace('# ', ''))}</h1>);
      i++; continue;
    }

    if (line.trim().startsWith('|') && i + 1 < lines.length && lines[i + 1].trim().startsWith('|') && lines[i + 1].includes('---')) {
      const tableRows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableRows.push(lines[i]);
        i++;
      }

      if (tableRows.length >= 2) {
        const headers = splitTableRow(tableRows[0]);
        const dataRows = tableRows.slice(2).map(splitTableRow);

        elements.push(
          <div key={`table-${i}`} className="overflow-x-auto my-6 border border-slate-200 rounded-xl shadow-sm break-inside-avoid">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {headers.map((h, idx) => (
                    <th key={idx} className="px-6 py-4 text-left text-sm font-bold text-slate-700 tracking-wider bg-slate-100">{formatInline(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-6 py-4 text-sm text-slate-600 leading-relaxed">{formatInline(cell)}</td>
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
        if (currentCleanLine.startsWith('[TÜYO]') || currentCleanLine.startsWith('[DİKKAT]') || currentCleanLine.startsWith('[ÖNEMLİ]')) {
          break;
        }
        listItems.push(currentCleanLine);
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} start={startNum} className="ml-6 mb-6 list-decimal marker:text-indigo-600 marker:font-bold font-medium pl-2 text-slate-800 space-y-2">
          {listItems.map((item, idx) => <li key={idx}>{formatInline(item)}</li>)}
        </ol>
      );
      continue;
    }

    if (line.trim().match(/^[-*]\s/)) {
      const listItems = [];
      while (i < lines.length && lines[i].trim().match(/^[-*]\s/)) {
        let currentCleanLine = lines[i].trim().replace(/^[-*]\s/, '').trim();
        if (currentCleanLine.startsWith('[TÜYO]') || currentCleanLine.startsWith('[DİKKAT]') || currentCleanLine.startsWith('[ÖNEMLİ]')) {
          break;
        }
        listItems.push(currentCleanLine);
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="ml-6 mb-6 list-disc marker:text-indigo-400 pl-2 space-y-2 text-slate-700">
          {listItems.map((item, idx) => <li key={idx}>{formatInline(item)}</li>)}
        </ul>
      );
      continue;
    }

    if (line.trim().startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="my-4 border-l-4 border-slate-300 bg-slate-50 p-4 rounded-r-xl text-slate-700 italic break-inside-avoid">
          <p>{formatInline(line.substring(2))}</p>
        </blockquote>
      );
      i++; continue;
    }

    if (line.trim() === '') {
      elements.push(<div key={i} className="h-4"></div>);
      i++; continue;
    }

    elements.push(<p key={i} className="mb-4 leading-relaxed text-slate-700 text-lg">{formatInline(line)}</p>);
    i++;
  }

  return elements;
}
