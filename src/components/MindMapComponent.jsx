import React, { useRef, useState, useEffect, useCallback } from 'react';

// --- Layout hesaplama ---
function computeLayout(data) {
  const nodes = [];
  const edges = [];
  const nodeMap = {};

  // Root
  const root = { id: 'root', label: data.root, description: data.rootDescription || '', level: 0, x: 0, y: 0, children: [] };
  nodes.push(root);
  nodeMap['root'] = root;

  // Kategoriler (level 1)
  const cats = data.nodes || [];
  const catCount = cats.length;
  cats.forEach((cat, ci) => {
    const angle = (2 * Math.PI * ci) / catCount - Math.PI / 2;
    const r1 = 220;
    const catNode = {
      id: cat.id,
      label: cat.label,
      description: cat.description || '',
      example: cat.example || '',
      level: 1,
      x: Math.cos(angle) * r1,
      y: Math.sin(angle) * r1,
      children: [],
      angle,
    };
    nodes.push(catNode);
    nodeMap[cat.id] = catNode;
    edges.push({ from: 'root', to: cat.id, label: cat.relation || '' });

    // Alt kavramlar (level 2)
    const children = cat.children || [];
    const childCount = children.length;
    children.forEach((child, chi) => {
      const spread = Math.min(Math.PI * 0.7, (childCount * 0.35));
      const childAngle = angle - spread / 2 + (spread / Math.max(childCount - 1, 1)) * chi;
      const r2 = 420;
      const childNode = {
        id: child.id,
        label: child.label,
        description: child.description || '',
        example: child.example || '',
        level: 2,
        x: Math.cos(childAngle) * r2,
        y: Math.sin(childAngle) * r2,
        children: [],
        angle: childAngle,
      };
      nodes.push(childNode);
      nodeMap[child.id] = childNode;
      edges.push({ from: cat.id, to: child.id, label: child.relation || '' });

      // Detaylar (level 3)
      const details = child.children || [];
      const detailCount = details.length;
      details.forEach((detail, di) => {
        const dSpread = Math.min(Math.PI * 0.4, detailCount * 0.25);
        const dAngle = childAngle - dSpread / 2 + (dSpread / Math.max(detailCount - 1, 1)) * di;
        const r3 = 620;
        const detailNode = {
          id: detail.id,
          label: detail.label,
          description: detail.description || '',
          example: detail.example || '',
          level: 3,
          x: Math.cos(dAngle) * r3,
          y: Math.sin(dAngle) * r3,
          children: [],
        };
        nodes.push(detailNode);
        nodeMap[detail.id] = detailNode;
        edges.push({ from: child.id, to: detail.id, label: detail.relation || '' });
      });
    });
  });

  // Cross-links (kavramlar arası ilişkiler)
  (data.crossLinks || []).forEach(link => {
    if (nodeMap[link.from] && nodeMap[link.to]) {
      edges.push({ from: link.from, to: link.to, label: link.label || '', isCross: true });
    }
  });

  return { nodes, edges, nodeMap };
}

// Renk paleti seviyeye göre
const LEVEL_COLORS = {
  0: { bg: '#6366f1', text: '#fff', border: '#4f46e5', shadow: 'rgba(99,102,241,0.4)' },
  1: { bg: '#0ea5e9', text: '#fff', border: '#0284c7', shadow: 'rgba(14,165,233,0.35)' },
  2: { bg: '#10b981', text: '#fff', border: '#059669', shadow: 'rgba(16,185,129,0.3)' },
  3: { bg: '#f59e0b', text: '#fff', border: '#d97706', shadow: 'rgba(245,158,11,0.3)' },
};

const NODE_RADIUS = [52, 42, 34, 26];

export default function MindMapComponent({ data, darkMode }) {
  const svgRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const [selected, setSelected] = useState(null);
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    if (data) {
      const l = computeLayout(data);
      setLayout(l);
      setSelected(null);
      // Başlangıç transform: ortala
      setTransform({ x: 0, y: 0, scale: 0.85 });
    }
  }, [data]);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(t => ({ ...t, scale: Math.min(3, Math.max(0.2, t.scale * delta)) }));
  }, []);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  const onMouseDown = (e) => {
    if (e.target.closest('.mind-node')) return;
    setDragging(true);
    dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    setTransform(t => ({ ...t, x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y }));
  };
  const onMouseUp = () => setDragging(false);

  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      setDragging(true);
      dragStart.current = { x: e.touches[0].clientX - transform.x, y: e.touches[0].clientY - transform.y };
    }
  };
  const onTouchMove = (e) => {
    if (!dragging || e.touches.length !== 1) return;
    setTransform(t => ({ ...t, x: e.touches[0].clientX - dragStart.current.x, y: e.touches[0].clientY - dragStart.current.y }));
  };

  if (!layout) return null;
  const { nodes, edges } = layout;

  const selectedNode = selected ? nodes.find(n => n.id === selected) : null;

  return (
    <div className="relative w-full h-full flex flex-col" style={{ minHeight: 520 }}>
      {/* SVG Canvas */}
      <div
        className="flex-1 relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"
        style={{ background: darkMode ? '#0f172a' : '#f8fafc', cursor: dragging ? 'grabbing' : 'grab', minHeight: 480 }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onMouseUp}
      >
        {/* Zoom controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
          {[['＋', 1.2], ['－', 0.8], ['⊙', 'reset']].map(([label, val]) => (
            <button
              key={label}
              onClick={() => setTransform(t => val === 'reset'
                ? { x: 0, y: 0, scale: 0.85 }
                : { ...t, scale: Math.min(3, Math.max(0.2, t.scale * val)) }
              )}
              className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-bold shadow hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              {label}
            </button>
          ))}
        </div>

        <svg
          ref={svgRef}
          width="100%" height="100%"
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={darkMode ? '#475569' : '#94a3b8'} />
            </marker>
            <marker id="arrow-cross" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
            </marker>
            {nodes.map(n => {
              const c = LEVEL_COLORS[n.level];
              return (
                <filter key={`shadow-${n.id}`} id={`shadow-${n.id}`} x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={c.shadow} floodOpacity="0.6" />
                </filter>
              );
            })}
          </defs>

          <g transform={`translate(${(svgRef.current?.clientWidth || 800) / 2 + transform.x}, ${(svgRef.current?.clientHeight || 500) / 2 + transform.y}) scale(${transform.scale})`}>
            {/* Edges */}
            {edges.map((edge, i) => {
              const from = nodes.find(n => n.id === edge.from);
              const to = nodes.find(n => n.id === edge.to);
              if (!from || !to) return null;
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2;
              const isCross = edge.isCross;
              const strokeColor = isCross ? '#f59e0b' : (darkMode ? '#334155' : '#cbd5e1');
              const r = NODE_RADIUS[to.level] || 26;
              const dx = to.x - from.x, dy = to.y - from.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const tx = to.x - (dx / dist) * r;
              const ty = to.y - (dy / dist) * r;

              return (
                <g key={i}>
                  <path
                    d={`M${from.x},${from.y} Q${mx + (isCross ? 60 : 0)},${my + (isCross ? -60 : 0)} ${tx},${ty}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isCross ? 1.5 : (to.level === 1 ? 2.5 : 1.5)}
                    strokeDasharray={isCross ? '5,4' : 'none'}
                    markerEnd={`url(#${isCross ? 'arrow-cross' : 'arrow'})`}
                    opacity={0.7}
                  />
                  {edge.label && (
                    <text
                      x={mx + (isCross ? 30 : 0)}
                      y={my + (isCross ? -30 : -6)}
                      textAnchor="middle"
                      fontSize={isCross ? 9 : 10}
                      fill={isCross ? '#f59e0b' : (darkMode ? '#64748b' : '#94a3b8')}
                      fontStyle="italic"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map(n => {
              const c = LEVEL_COLORS[n.level];
              const r = NODE_RADIUS[n.level];
              const isSelected = selected === n.id;
              const maxChars = n.level === 0 ? 14 : n.level === 1 ? 12 : 10;
              const words = n.label.split(' ');
              const lines = [];
              let cur = '';
              words.forEach(w => {
                if ((cur + ' ' + w).trim().length > maxChars) { lines.push(cur.trim()); cur = w; }
                else cur = (cur + ' ' + w).trim();
              });
              if (cur) lines.push(cur);

              return (
                <g
                  key={n.id}
                  className="mind-node"
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); setSelected(isSelected ? null : n.id); }}
                >
                  <circle
                    cx={n.x} cy={n.y} r={isSelected ? r + 5 : r}
                    fill={isSelected ? c.border : c.bg}
                    stroke={isSelected ? '#fff' : c.border}
                    strokeWidth={isSelected ? 3 : 1.5}
                    filter={`url(#shadow-${n.id})`}
                    style={{ transition: 'all 0.2s' }}
                  />
                  {lines.map((line, li) => (
                    <text
                      key={li}
                      x={n.x} y={n.y + (li - (lines.length - 1) / 2) * (n.level === 0 ? 14 : 12)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={n.level === 0 ? 13 : n.level === 1 ? 11 : n.level === 2 ? 10 : 9}
                      fontWeight={n.level <= 1 ? 'bold' : '600'}
                      fill={c.text}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Detail Panel */}
      {selectedNode && (
        <div className="mt-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shrink-0 mt-1"
                style={{ background: LEVEL_COLORS[selectedNode.level].bg }}
              />
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{selectedNode.label}</h3>
            </div>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none shrink-0">×</button>
          </div>
          {selectedNode.description && (
            <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{selectedNode.description}</p>
          )}
          {selectedNode.example && (
            <div className="mt-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">Örnek / Example</span>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">{selectedNode.example}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
