import React, { useRef, useState, useEffect, useCallback } from 'react';

// --- Layout hesaplama ---
function computeLayout(data) {
  const nodes = [];
  const edges = [];
  const nodeMap = {};

  const root = { id: 'root', label: data.root, description: data.rootDescription || '', level: 0, x: 0, y: 0, children: [] };
  nodes.push(root);
  nodeMap['root'] = root;

  const cats = data.nodes || [];
  const catCount = cats.length;
  cats.forEach((cat, ci) => {
    const angle = (2 * Math.PI * ci) / catCount - Math.PI / 2;
    const r1 = 240;
    const catNode = {
      id: cat.id, label: cat.label, description: cat.description || '',
      example: cat.example || '', level: 1,
      x: Math.cos(angle) * r1, y: Math.sin(angle) * r1,
      children: [], angle,
    };
    nodes.push(catNode);
    nodeMap[cat.id] = catNode;
    edges.push({ from: 'root', to: cat.id, label: cat.relation || '' });

    const children = cat.children || [];
    const childCount = children.length;
    children.forEach((child, chi) => {
      const spread = Math.min(Math.PI * 0.7, childCount * 0.35);
      const childAngle = angle - spread / 2 + (spread / Math.max(childCount - 1, 1)) * chi;
      const r2 = 460;
      const childNode = {
        id: child.id, label: child.label, description: child.description || '',
        example: child.example || '', level: 2,
        x: Math.cos(childAngle) * r2, y: Math.sin(childAngle) * r2,
        children: [], angle: childAngle,
      };
      nodes.push(childNode);
      nodeMap[child.id] = childNode;
      edges.push({ from: cat.id, to: child.id, label: child.relation || '' });

      const details = child.children || [];
      const detailCount = details.length;
      details.forEach((detail, di) => {
        const dSpread = Math.min(Math.PI * 0.4, detailCount * 0.25);
        const dAngle = childAngle - dSpread / 2 + (dSpread / Math.max(detailCount - 1, 1)) * di;
        const r3 = 680;
        const detailNode = {
          id: detail.id, label: detail.label, description: detail.description || '',
          example: detail.example || '', level: 3,
          x: Math.cos(dAngle) * r3, y: Math.sin(dAngle) * r3,
          children: [],
        };
        nodes.push(detailNode);
        nodeMap[detail.id] = detailNode;
        edges.push({ from: child.id, to: detail.id, label: detail.relation || '' });
      });
    });
  });

  (data.crossLinks || []).forEach(link => {
    if (nodeMap[link.from] && nodeMap[link.to]) {
      edges.push({ from: link.from, to: link.to, label: link.label || '', isCross: true });
    }
  });

  return { nodes, edges, nodeMap };
}

const LEVEL_COLORS = {
  0: { bg: '#6366f1', text: '#fff', border: '#4f46e5', shadow: 'rgba(99,102,241,0.4)' },
  1: { bg: '#0ea5e9', text: '#fff', border: '#0284c7', shadow: 'rgba(14,165,233,0.35)' },
  2: { bg: '#10b981', text: '#fff', border: '#059669', shadow: 'rgba(16,185,129,0.3)' },
  3: { bg: '#f59e0b', text: '#fff', border: '#d97706', shadow: 'rgba(245,158,11,0.3)' },
};

const NODE_RADIUS = [54, 44, 36, 28];

export default function MindMapComponent({ data, darkMode, lang = 'tr' }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.85 });
  const [selected, setSelected] = useState(null);
  const [layout, setLayout] = useState(null);
  // Node pozisyonları: { [id]: {x, y} }
  const [nodePos, setNodePos] = useState({});

  // Canvas drag state
  const canvasDrag = useRef(null);
  // Node drag state
  const nodeDrag = useRef(null); // { id, startX, startY, origX, origY }

  useEffect(() => {
    if (data) {
      const l = computeLayout(data);
      setLayout(l);
      setSelected(null);
      setTransform({ x: 0, y: 0, scale: 0.85 });
      // Pozisyonları başlat
      const pos = {};
      l.nodes.forEach(n => { pos[n.id] = { x: n.x, y: n.y }; });
      setNodePos(pos);
    }
  }, [data]);

  // Wheel zoom
  const onWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(t => ({ ...t, scale: Math.min(4, Math.max(0.15, t.scale * delta)) }));
  }, []);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  // SVG koordinatına çevir
  const toSVGCoords = useCallback((clientX, clientY) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const svgW = rect.width;
    const svgH = rect.height;
    const cx = svgW / 2 + transform.x;
    const cy = svgH / 2 + transform.y;
    return {
      x: (clientX - rect.left - cx) / transform.scale,
      y: (clientY - rect.top - cy) / transform.scale,
    };
  }, [transform]);

  // --- Mouse handlers ---
  const onMouseDown = useCallback((e) => {
    // Node drag başlatıldıysa canvas drag yapma
    if (nodeDrag.current) return;
    if (e.button !== 0) return;
    canvasDrag.current = { startX: e.clientX - transform.x, startY: e.clientY - transform.y };
  }, [transform]);

  const onNodeMouseDown = useCallback((e, nodeId) => {
    e.stopPropagation();
    const svgCoords = toSVGCoords(e.clientX, e.clientY);
    nodeDrag.current = {
      id: nodeId,
      startX: e.clientX,
      startY: e.clientY,
      origX: svgCoords.x,
      origY: svgCoords.y,
      moved: false,
    };
  }, [toSVGCoords]);

  const onMouseMove = useCallback((e) => {
    if (nodeDrag.current) {
      const dx = e.clientX - nodeDrag.current.startX;
      const dy = e.clientY - nodeDrag.current.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) nodeDrag.current.moved = true;
      const svgCoords = toSVGCoords(e.clientX, e.clientY);
      setNodePos(prev => ({
        ...prev,
        [nodeDrag.current.id]: { x: svgCoords.x, y: svgCoords.y },
      }));
    } else if (canvasDrag.current) {
      setTransform(t => ({
        ...t,
        x: e.clientX - canvasDrag.current.startX,
        y: e.clientY - canvasDrag.current.startY,
      }));
    }
  }, [toSVGCoords]);

  const onMouseUp = useCallback((e) => {
    if (nodeDrag.current) {
      if (!nodeDrag.current.moved) {
        // Click olarak say
        const id = nodeDrag.current.id;
        setSelected(prev => prev === id ? null : id);
      }
      nodeDrag.current = null;
    }
    canvasDrag.current = null;
  }, []);

  // --- Touch handlers ---
  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      canvasDrag.current = {
        startX: e.touches[0].clientX - transform.x,
        startY: e.touches[0].clientY - transform.y,
      };
    }
  }, [transform]);

  const onNodeTouchStart = useCallback((e, nodeId) => {
    e.stopPropagation();
    if (e.touches.length === 1) {
      const svgCoords = toSVGCoords(e.touches[0].clientX, e.touches[0].clientY);
      nodeDrag.current = {
        id: nodeId,
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        origX: svgCoords.x,
        origY: svgCoords.y,
        moved: false,
      };
    }
  }, [toSVGCoords]);

  const onTouchMove = useCallback((e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    if (nodeDrag.current) {
      const dx = touch.clientX - nodeDrag.current.startX;
      const dy = touch.clientY - nodeDrag.current.startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) nodeDrag.current.moved = true;
      const svgCoords = toSVGCoords(touch.clientX, touch.clientY);
      setNodePos(prev => ({
        ...prev,
        [nodeDrag.current.id]: { x: svgCoords.x, y: svgCoords.y },
      }));
    } else if (canvasDrag.current) {
      setTransform(t => ({
        ...t,
        x: touch.clientX - canvasDrag.current.startX,
        y: touch.clientY - canvasDrag.current.startY,
      }));
    }
  }, [toSVGCoords]);

  const onTouchEnd = useCallback((e) => {
    if (nodeDrag.current) {
      if (!nodeDrag.current.moved) {
        const id = nodeDrag.current.id;
        setSelected(prev => prev === id ? null : id);
      }
      nodeDrag.current = null;
    }
    canvasDrag.current = null;
  }, []);

  if (!layout) return null;
  const { nodes, edges } = layout;
  const selectedNode = selected ? nodes.find(n => n.id === selected) : null;

  const isDraggingNode = () => nodeDrag.current !== null;
  const isDraggingCanvas = () => canvasDrag.current !== null;

  return (
    <div className="relative w-full h-full flex flex-col" style={{ minHeight: 700 }}>
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"
        style={{
          background: darkMode ? '#0f172a' : '#f8fafc',
          cursor: 'grab',
          minHeight: 640,
          userSelect: 'none',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Zoom controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
          {[['＋', 1.2], ['－', 0.8], ['⊙', 'reset']].map(([label, val]) => (
            <button
              key={label}
              onMouseDown={e => e.stopPropagation()}
              onClick={() => setTransform(t => val === 'reset'
                ? { x: 0, y: 0, scale: 0.85 }
                : { ...t, scale: Math.min(4, Math.max(0.15, t.scale * val)) }
              )}
              className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-bold shadow hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Hint */}
        <div className="absolute bottom-3 left-3 z-10 text-xs text-slate-400 dark:text-slate-500 pointer-events-none select-none">
          {lang === 'en' ? 'Drag nodes • Scroll to zoom • Click for details' : 'Düğümleri sürükle • Kaydır = zoom • Tıkla = detay'}
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
                <filter key={`shadow-${n.id}`} id={`shadow-${n.id}`} x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor={c.shadow} floodOpacity="0.6" />
                </filter>
              );
            })}
          </defs>

          <g transform={`translate(${(svgRef.current?.clientWidth || 800) / 2 + transform.x}, ${(svgRef.current?.clientHeight || 500) / 2 + transform.y}) scale(${transform.scale})`}>
            {/* Edges — pozisyonları nodePos'tan al */}
            {edges.map((edge, i) => {
              const fromPos = nodePos[edge.from];
              const toPos = nodePos[edge.to];
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromPos || !toPos || !toNode) return null;
              const mx = (fromPos.x + toPos.x) / 2;
              const my = (fromPos.y + toPos.y) / 2;
              const isCross = edge.isCross;
              const strokeColor = isCross ? '#f59e0b' : (darkMode ? '#334155' : '#cbd5e1');
              const r = NODE_RADIUS[toNode.level] || 28;
              const dx = toPos.x - fromPos.x, dy = toPos.y - fromPos.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const tx = toPos.x - (dx / dist) * r;
              const ty = toPos.y - (dy / dist) * r;

              return (
                <g key={i}>
                  <path
                    d={`M${fromPos.x},${fromPos.y} Q${mx + (isCross ? 60 : 0)},${my + (isCross ? -60 : 0)} ${tx},${ty}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isCross ? 1.5 : (toNode.level === 1 ? 2.5 : 1.5)}
                    strokeDasharray={isCross ? '5,4' : 'none'}
                    markerEnd={`url(#${isCross ? 'arrow-cross' : 'arrow'})`}
                    opacity={0.7}
                  />
                  {edge.label && (
                    <text
                      x={mx + (isCross ? 30 : 0)} y={my + (isCross ? -30 : -6)}
                      textAnchor="middle" fontSize={isCross ? 9 : 10}
                      fill={isCross ? '#f59e0b' : (darkMode ? '#64748b' : '#94a3b8')}
                      fontStyle="italic" style={{ pointerEvents: 'none' }}
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map(n => {
              const pos = nodePos[n.id] || { x: n.x, y: n.y };
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
                  style={{ cursor: 'grab' }}
                  onMouseDown={e => onNodeMouseDown(e, n.id)}
                  onTouchStart={e => onNodeTouchStart(e, n.id)}
                >
                  <circle
                    cx={pos.x} cy={pos.y} r={isSelected ? r + 5 : r}
                    fill={isSelected ? c.border : c.bg}
                    stroke={isSelected ? '#fff' : c.border}
                    strokeWidth={isSelected ? 3 : 1.5}
                    filter={`url(#shadow-${n.id})`}
                    style={{ transition: 'r 0.15s, fill 0.15s' }}
                  />
                  {lines.map((line, li) => (
                    <text
                      key={li}
                      x={pos.x} y={pos.y + (li - (lines.length - 1) / 2) * (n.level === 0 ? 14 : 12)}
                      textAnchor="middle" dominantBaseline="middle"
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
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full shrink-0 mt-1" style={{ background: LEVEL_COLORS[selectedNode.level].bg }} />
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{selectedNode.label}</h3>
            </div>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none shrink-0">×</button>
          </div>

          {selectedNode.description && (
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">{selectedNode.description}</p>
          )}

          {selectedNode.importance && (
            <div className="mb-3 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{lang === 'en' ? 'Why It Matters' : 'Önemi'}</span>
              <p className="mt-1 text-sm text-indigo-800 dark:text-indigo-200">{selectedNode.importance}</p>
            </div>
          )}

          {selectedNode.keyFacts && selectedNode.keyFacts.length > 0 && (
            <div className="mb-3 px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{lang === 'en' ? 'Key Facts' : 'Anahtar Bilgiler'}</span>
              <ul className="mt-2 space-y-1">
                {selectedNode.keyFacts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: LEVEL_COLORS[selectedNode.level].bg }} />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedNode.example && (
            <div className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">{lang === 'en' ? 'Example' : 'Örnek'}</span>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">{selectedNode.example}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
