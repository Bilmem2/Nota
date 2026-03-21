import React from 'react';

const VisualSummaryComponent = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl shadow-sm border border-teal-100 dark:border-teal-900 mb-8">
            <h3 className="text-2xl font-extrabold text-teal-900 dark:text-teal-300 mb-10 text-center border-b-2 border-teal-100 dark:border-teal-800 pb-4">
                {data.title}
            </h3>

            {/* Timeline */}
            {data.layout === 'timeline' && data.items && (
                <div className="relative border-l-4 border-teal-200 dark:border-teal-700 ml-4 md:ml-8 space-y-12 pb-8">
                    {data.items.map((item, idx) => (
                        <div key={idx} className="relative pl-8 md:pl-12 break-inside-avoid">
                            <div className="absolute w-6 h-6 bg-teal-500 dark:bg-teal-600 rounded-full -left-[15px] top-1 border-4 border-white dark:border-slate-800 shadow-sm"></div>
                            <div className="bg-teal-50/50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-sm font-bold text-teal-600 dark:text-teal-400 mb-2 block tracking-wider uppercase">ADIM {idx + 1}</span>
                                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">{item.subtitle}</h4>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{item.details}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Grid */}
            {data.layout === 'grid' && data.items && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.items.map((item, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-teal-100/50 dark:border-teal-800/50 p-6 rounded-2xl shadow-sm hover:border-teal-300 dark:hover:border-teal-600 transition-colors h-full flex flex-col break-inside-avoid">
                            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center font-black text-xl mb-4 shrink-0">
                                {idx + 1}
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">{item.subtitle}</h4>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium flex-1">{item.details}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Comparison */}
            {data.layout === 'comparison' && data.comparisonData && (
                <div className="overflow-x-auto break-inside-avoid">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="px-6 py-3 bg-teal-600 dark:bg-teal-700 text-white font-bold rounded-xl shadow-md text-lg">{data.comparisonData.conceptA}</div>
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center font-black text-slate-400 dark:text-slate-300 text-sm">VS</div>
                        <div className="px-6 py-3 bg-indigo-600 dark:bg-indigo-700 text-white font-bold rounded-xl shadow-md text-lg">{data.comparisonData.conceptB}</div>
                    </div>
                    <table className="min-w-full border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                        <thead className="bg-slate-100 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider text-xs w-1/3 border-b-2 border-slate-200 dark:border-slate-600">Karşılaştırma Noktası</th>
                                <th className="px-6 py-4 text-left font-bold text-teal-800 dark:text-teal-300 border-b-2 border-slate-200 dark:border-slate-600 w-1/3 border-l-2 dark:border-l-slate-600">{data.comparisonData.conceptA}</th>
                                <th className="px-6 py-4 text-left font-bold text-indigo-800 dark:text-indigo-300 border-b-2 border-slate-200 dark:border-slate-600 w-1/3 border-l-2 dark:border-l-slate-600">{data.comparisonData.conceptB}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                            {data.comparisonData.points.map((pt, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-5 font-bold text-slate-700 dark:text-slate-200">{pt.feature}</td>
                                    <td className="px-6 py-5 text-slate-600 dark:text-slate-300 font-medium border-l-2 border-slate-100 dark:border-slate-700">{pt.valA}</td>
                                    <td className="px-6 py-5 text-slate-600 dark:text-slate-300 font-medium border-l-2 border-slate-100 dark:border-slate-700">{pt.valB}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Table */}
            {data.layout === 'table' && data.tableData && (
                <div className="overflow-x-auto break-inside-avoid border-2 border-slate-200 dark:border-slate-700 rounded-2xl">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-100 dark:bg-slate-700">
                            <tr>
                                {data.tableData.headers.map((h, idx) => (
                                    <th key={idx} className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200 tracking-wider text-sm">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {data.tableData.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    {row.map((cell, cIdx) => (
                                        <td key={cIdx} className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium">{cell}</td>
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
