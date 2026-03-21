import React from 'react';

const VisualSummaryComponent = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-teal-100 mb-8">
            <h3 className="text-2xl font-extrabold text-teal-900 mb-10 text-center border-b-2 border-teal-100 pb-4">
                {data.title}
            </h3>

            {data.layout === 'timeline' && data.items && (
                <div className="relative border-l-4 border-teal-200 ml-4 md:ml-8 space-y-12 pb-8">
                    {data.items.map((item, idx) => (
                        <div key={idx} className="relative pl-8 md:pl-12 break-inside-avoid">
                            <div className="absolute w-6 h-6 bg-teal-500 rounded-full -left-[15px] top-1 border-4 border-white shadow-sm"></div>
                            <div className="bg-teal-50/50 border border-teal-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-sm font-bold text-teal-600 mb-2 block tracking-wider uppercase">ADIM {idx + 1}</span>
                                <h4 className="text-xl font-bold text-slate-800 mb-3">{item.subtitle}</h4>
                                <p className="text-slate-600 leading-relaxed font-medium">{item.details}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {data.layout === 'grid' && data.items && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.items.map((item, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-white to-slate-50 border-2 border-teal-100/50 p-6 rounded-2xl shadow-sm hover:border-teal-300 transition-colors h-full flex flex-col break-inside-avoid">
                            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center font-black text-xl mb-4 shrink-0">
                                {idx + 1}
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 mb-3">{item.subtitle}</h4>
                            <p className="text-slate-600 leading-relaxed font-medium flex-1">{item.details}</p>
                        </div>
                    ))}
                </div>
            )}

            {data.layout === 'comparison' && data.comparisonData && (
                <div className="overflow-x-auto break-inside-avoid">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="px-6 py-3 bg-teal-600 text-white font-bold rounded-xl shadow-md text-lg">{data.comparisonData.conceptA}</div>
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 text-sm">VS</div>
                        <div className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md text-lg">{data.comparisonData.conceptB}</div>
                    </div>
                    <table className="min-w-full border-2 border-slate-200 rounded-2xl overflow-hidden">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase tracking-wider text-xs w-1/3 border-b-2 border-slate-200">Karşılaştırma Noktası</th>
                                <th className="px-6 py-4 text-left font-bold text-teal-800 border-b-2 border-slate-200 w-1/3 border-l-2">{data.comparisonData.conceptA}</th>
                                <th className="px-6 py-4 text-left font-bold text-indigo-800 border-b-2 border-slate-200 w-1/3 border-l-2">{data.comparisonData.conceptB}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {data.comparisonData.points.map((pt, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-5 font-bold text-slate-700">{pt.feature}</td>
                                    <td className="px-6 py-5 text-slate-600 font-medium border-l-2 border-slate-100">{pt.valA}</td>
                                    <td className="px-6 py-5 text-slate-600 font-medium border-l-2 border-slate-100">{pt.valB}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {data.layout === 'table' && data.tableData && (
                <div className="overflow-x-auto break-inside-avoid border-2 border-slate-200 rounded-2xl">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-100">
                            <tr>
                                {data.tableData.headers.map((h, idx) => (
                                    <th key={idx} className="px-6 py-4 text-left font-bold text-slate-700 tracking-wider text-sm">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {data.tableData.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-slate-50">
                                    {row.map((cell, cIdx) => (
                                        <td key={cIdx} className="px-6 py-4 text-sm text-slate-600 font-medium">{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default VisualSummaryComponent;
