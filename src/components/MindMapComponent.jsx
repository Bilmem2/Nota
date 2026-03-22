import React, { useRef, useState, useEffect, useCallback } from 'react';

// ─── Renk paleti ───────────────────────────────────────────────────────────────
const LEVEL_COLORS = {
  0: { bg: '#6366f1', text: '#fff', border: '#4f46e5', shadow: 'rgba(99,102,241,0.4)' },
  1: { bg: '#0ea5e9', text: '#fff', border: '#0284c7', shadow: 'rgba(14,165,233,0.35)' },
  2: { bg: '#10b981', text: '#fff', border: '#059669', shadow: 'rgba(16,185,129,0.3)' },
  3: { bg: '#f59e0b', text: '#fff', border: '#d97706', shadow: 'rgba(245,158,11,0.3)' },
};
const NODE_W = [130, 110, 95, 80];   // rect genişlikleri
const NODE_H = [44, 38, 32, 28];     // rect yükseklikleri
const NODE_R = [54, 44, 36, 28];     // radial mod için daire yarıçapı

// ─── Radial layout ─────────────────────────────────────────────────────────────
function computeRadial(data) {
  const nodes = [], edges = [], nodeMap = {};
  const root = { id: 'root', label: data.root, description: data.rootDescription || '',
    importance: '', keyFacts: [], example: '', level: 0, x: 0, y: 0 };
  nodes.push(root); nodeMap['root'] = root;

  const cats = data.nodes || [];
  cats.forEach((cat, ci) => {
    const angle = (2 * Math.PI * ci) / cats.length - Math.PI / 2;
    const r1 = 260;
    const catNode = { id: cat.id, label: cat.label, description: cat.description || '',
      importance: cat.importance || '', keyFacts: cat.keyFacts || [], example: cat.example || '',
      level: 1, x: Math.cos(angle) * r1, y: Math.sin(angle) * r1, angle };
    nodes.push(catNode); nodeMap[cat.id] = catNode;
    edges.push({ from: 'root', to: cat.id, label: cat.relation || '' });

    (cat.children || []).forEach((child, chi) => {
      const childCount = (cat.children || []).length;
      const spread = Math.min(Math.PI * 0.65, childCount * 0.32);
      const childAngle = angle - spread / 2 + (spread / Math.max(childCount - 1, 1)) * chi;
      const r2 = 500;
      const childNode = { id: child.id, label: child.label, description: child.description || '',
        importance: child.importance || '', keyFacts: child.keyFacts || [], example: child.example || '',
        level: 2, x: Math.cos(childAngle) * r2, y: Math.sin(childAngle) * r2, angle: childAngle };
      nodes.push(childNode); nodeMap[child.id] = childNode;
      edges.push({ from: cat.id, to: child.id, label: child.relation || '' });

      (child.children || []).forEach((detail, di) => {
        const detailCount = (child.children || []).length;
        const dSpread = Math.min(Math.PI * 0.35, detailCount * 0.22);
        const dAngle = childAngle - dSpread / 2 + (dSpread / Math.max(detailCount - 1, 1)) * di;
        const r3 = 730;
        const detailNode = { id: detail.id, label: detail.label, description: detail.description || '',
          importance: detail.importance || '', keyFacts: detail.keyFacts || [], example: detail.example || '',
          level: 3, x: Math.cos(dAngle) * r3, y: Math.sin(dAngle) * r3 };
        nodes.push(detailNode); nodeMap[detail.id] = detailNode;
        edges.push({ from: child.id, to: detail.id, label: detail.relation || '' });
      });
    });
  });
  (data.crossLinks || []).forEach(link => {
    if (nodeMap[link.from] && nodeMap[link.to])
      edges.push({ from: link.from, to: link.to, label: link.label || '', isCross: true });
  });
  return { nodes, edges, nodeMap };
}

// ─── Tree (hiyerarşik) layout ──────────────────────────────────────────────────
function computeTree(data) {
  const nodes = [], edges = [], nodeMap = {};
  const X_GAP = 180, Y_GAP = 90;

  // Önce tüm node'ları düz listeye al, sonra x/y ata
  function flatten(node, level, parentId) {
    const n = { id: node.id || 'root', label: node.label || node.root || '',
      description: node.description || node.rootDescription || '',
      importance: node.importance || '', keyFacts: node.keyFacts || [],
      example: node.example || '', level, x: 0, y: 0,
      children: node.children || [] };
    nodes.push(n); nodeMap[n.id] = n;
    if (parentId) edges.push({ from: parentId, to: n.id, label: node.relation || '' });
    (node.children || []).forEach(c => flatten(c, level + 1, n.id));
  }

  const rootNode = { id: 'root', root: data.root, rootDescription: data.rootDescription,
    children: data.nodes || [] };
  flatten(rootNode, 0, null);

  // Reingold-Tilford benzeri: her node'a subtree genişliği hesapla
  function subtreeWidth(id) {
    const n = nodeMap[id];
    if (!n.children.length) return 1;
    return n.children.reduce((s, c) => s + subtreeWidth(c.id || c), 0);
  }

  function assignX(id, startX) {
    const n = nodeMap[id];
    if (!n.children.length) { n.x = startX + 0.5; return; }
    let cx = startX;
    n.children.forEach(c => {
      const cid = c.id || c;
      const w = subtreeWidth(cid);
      assignX(cid, cx);
      cx += w;
    });
    const firstChild = nodeMap[n.children[0].id || n.children[0]];
    const lastChild = nodeMap[n.children[n.children.length - 1].id || n.children[n.children.length - 1]];
    n.x = (firstChild.x + lastChild.x) / 2;
  }

  assignX('root', 0);
  nodes.forEach(n => { n.x = n.x * X_GAP; n.y = n.level * Y_GAP; });

  (data.crossLinks || []).forEach(link => {
    if (nodeMap[link.from] && nodeMap[link.to])
      edges.push({ from: link.from, to: link.to, label: link.label || '', isCross: true });
  });
  return { nodes, edges, nodeMap };
}

// ─── Force-directed (serbest) layout — basit iteratif ─────────────────────────
function computeForce(data) {
  // Önce radial ile başla, sonra force uygula
  const base = computeRadial(data);
  const nodes = base.nodes.map(n => ({ ...n }));
  const edges = base.edges;
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  const REPEL = 18000, ATTRACT = 0.04, DAMP = 0.85, STEPS = 80;
  const vx = {}, vy = {};
  nodes.forEach(n => { vx[n.id] = 0; vy[n.id] = 0; });

  for (let step = 0; step < STEPS; step++) {
    const fx = {}, fy = {};
    nodes.forEach(n => { fx[n.id] = 0; fy[n.id] = 0; });

    // Repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = b.x - a.x || 0.1, dy = b.y - a.y || 0.1;
        const dist2 = dx * dx + dy * dy + 1;
        const f = REPEL / dist2;
        fx[a.id] -= f * dx / Math.sqrt(dist2);
        fy[a.id] -= f * dy / Math.sqrt(dist2);
        fx[b.id] += f * dx / Math.sqrt(dist2);
        fy[b.id] += f * dy / Math.sqrt(dist2);
      }
    }
    // Attraction along edges
    edges.forEach(e => {
      if (e.isCross) return;
      const a = nodeMap[e.from], b = nodeMap[e.to];
      if (!a || !b) return;
      const dx = b.x - a.x, dy = b.y - a.y;
      fx[a.id] += ATTRACT * dx; fy[a.id] += ATTRACT * dy;
      fx[b.id] -= ATTRACT * dx; fy[b.id] -= ATTRACT * dy;
    });

    nodes.forEach(n => {
      if (n.id === 'root') return; // root sabit
      vx[n.id] = (vx[n.id] + fx[n.id]) * DAMP;
      vy[n.id] = (vy[n.id] + fy[n.id]) * DAMP;
      n.x += vx[n.id]; n.y += vy[n.id];
    });
  }
  return { nodes, edges, nodeMap };
}

// ─── Ana bileşen ───────────────────────────────────────────────────────────────
export default function MindMapComponent({ data, darkMode, lang = 'tr', layoutMode = 'radial' }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [svgSize, setSvgSize] = useState({ w: 900, h: 600 });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [selected, setSelected] = useState(null);
  const [layout, setLayout] = useState(null);
  const [nodePos, setNodePos] = useState({});

  const canvasDrag = useRef(null);
  const nodeDrag = useRef(null);
  const transformRef = useRef(transform);
  useEffect(() => { transformRef.current = transform; }, [transform]);

  // ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries)
        setSvgSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(el);
    setSvgSize({ w: el.clientWidth || 900, h: el.clientHeight || 600 });
    return () => ro.disconnect();
  }, []);

  // Layout hesapla
  useEffect(() => {
    if (!data) return;
    let l;
    if (layoutMode === 'tree') l = computeTree(data);
    else if (layoutMode === 'force') l = computeForce(data);
    else l = computeRadial(data);
    setLayout(l);
    setSelected(null);
    const pos = {};
    l.nodes.forEach(n => { pos[n.id] = { x: n.x, y: n.y }; });
    setNodePos(pos);

    // Otomatik fit
    if (l.nodes.length > 0) {
      const xs = l.nodes.map(n => n.x), ys = l.nodes.map(n => n.y);
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      const minY = Math.min(...ys), maxY = Math.max(...ys);
      const cw = svgSize.w || 900, ch = svgSize.h || 600;
      const pad = 120;
      const scaleX = (cw - pad * 2) / (maxX - minX + 1);
      const scaleY = (ch - pad * 2) / (maxY - minY + 1);
      const scale = Math.min(1.2, Math.max(0.25, Math.min(scaleX, scaleY)));
      const cx = -(minX + maxX) / 2 * scale;
      const cy = -(minY + maxY) / 2 * scale;
      setTransform({ x: cx, y: cy, scale });
    }
  }, [data, layoutMode]); // svgSize intentionally omitted to avoid re-fit on resize

  // Wheel zoom
  const onWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(t => ({ ...t, scale: Math.min(4, Math.max(0.12, t.scale * delta)) }));
  }, []);
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  const toSVGCoords = useCallback((cx, cy) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const t = transformRef.current;
    const ox = rect.width / 2 + t.x, oy = rect.height / 2 + t.y;
    return { x: (cx - rect.left - ox) / t.scale, y: (cy - rect.top - oy) / t.scale };
  }, []);

  // Mouse
  const onMouseDown = useCallback((e) => {
    if (nodeDrag.current || e.button !== 0) return;
    canvasDrag.current = { startX: e.clientX - transformRef.current.x, startY: e.clientY - transformRef.current.y };
  }, []);
  const onNodeMouseDown = useCallback((e, id) => {
    e.stopPropagation();
    const c = toSVGCoords(e.clientX, e.clientY);
    nodeDrag.current = { id, startX: e.clientX, startY: e.clientY, origX: c.x, origY: c.y, moved: false };
  }, [toSVGCoords]);
  const onMouseMove = useCallback((e) => {
    if (nodeDrag.current) {
      const dx = e.clientX - nodeDrag.current.startX, dy = e.clientY - nodeDrag.current.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) nodeDrag.current.moved = true;
      const c = toSVGCoords(e.clientX, e.clientY);
      setNodePos(p => ({ ...p, [nodeDrag.current.id]: { x: c.x, y: c.y } }));
    } else if (canvasDrag.current) {
      setTransform(t => ({ ...t, x: e.clientX - canvasDrag.current.startX, y: e.clientY - canvasDrag.current.startY }));
    }
  }, [toSVGCoords]);
  const onMouseUp = useCallback(() => {
    if (nodeDrag.current) {
      if (!nodeDrag.current.moved) {
        const id = nodeDrag.current.id;
        setSelected(p => p === id ? null : id);
      }
      nodeDrag.current = null;
    }
    canvasDrag.current = null;
  }, []);

  // Touch
  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 1)
      canvasDrag.current = { startX: e.touches[0].clientX - transformRef.current.x, startY: e.touches[0].clientY - transformRef.current.y };
  }, []);
  const onNodeTouchStart = useCallback((e, id) => {
    e.stopPropagation();
    if (e.touches.length === 1) {
      const c = toSVGCoords(e.touches[0].clientX, e.touches[0].clientY);
      nodeDrag.current = { id, startX: e.touches[0].clientX, startY: e.touches[0].clientY, origX: c.x, origY: c.y, moved: false };
    }
  }, [toSVGCoords]);
  const onTouchMove = useCallback((e) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    if (nodeDrag.current) {
      const dx = t.clientX - nodeDrag.current.startX, dy = t.clientY - nodeDrag.current.startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) nodeDrag.current.moved = true;
      const c = toSVGCoords(t.clientX, t.clientY);
      setNodePos(p => ({ ...p, [nodeDrag.current.id]: { x: c.x, y: c.y } }));
    } else if (canvasDrag.current) {
      setTransform(tr => ({ ...tr, x: t.clientX - canvasDrag.current.startX, y: t.clientY - canvasDrag.current.startY }));
    }
  }, [toSVGCoords]);
  const onTouchEnd = useCallback(() => {
    if (nodeDrag.current) {
      if (!nodeDrag.current.moved) {
        const id = nodeDrag.current.id;
        setSelected(p => p === id ? null : id);
      }
      nodeDrag.current = null;
    }
    canvasDrag.current = null;
  }, []);

  if (!layout) return null;
  const { nodes, edges } = layout;
  const selectedNode = selected ? nodes.find(n => n.id === selected) : null;
  const isTree = layoutMode === 'tree';

  // Node şekli: tree modda rect, diğerlerinde circle
  function renderNode(n) {
    const pos = nodePos[n.id] || { x: n.x, y: n.y };
    const c = LEVEL_COLORS[n.level] || LEVEL_COLORS[3];
    const isSelected = selected === n.id;

    // Metin satırlarına böl
    const maxChars = n.level === 0 ? 16 : n.level === 1 ? 14 : 12;
    const words = (n.label || '').split(' ');
    const lines = [];
    let cur = '';
    words.forEach(w => {
      if ((cur + ' ' + w).trim().length > maxChars) { lines.push(cur.trim()); cur = w; }
      else cur = (cur + ' ' + w).trim();
    });
    if (cur) lines.push(cur);

    const fontSize = n.level === 0 ? 13 : n.level === 1 ? 11.5 : n.level === 2 ? 10.5 : 9.5;
    const lineH = fontSize * 1.3;

    if (isTree) {
      const w = NODE_W[n.level] ?? 80, h = Math.max(NODE_H[n.level] ?? 28, lines.length * lineH + 10);
      const rx = n.level === 0 ? 14 : n.level === 1 ? 10 : 7;
      return (
        <g key={n.id} style={{ cursor: 'grab' }}
          onMouseDown={e => onNodeMouseDown(e, n.id)}
          onTouchStart={e => onNodeTouchStart(e, n.id)}>
          <rect
            x={pos.x - w / 2} y={pos.y - h / 2} width={w} height={h} rx={rx}
            fill={isSelected ? c.border : c.bg}
            stroke={isSelected ? '#fff' : c.border}
            strokeWidth={isSelected ? 2.5 : 1.5}
            filter={`url(#shadow-${n.id})`}
            style={{ transition: 'fill 0.15s' }}
          />
          {lines.map((line, li) => (
            <text key={li}
              x={pos.x}
              y={pos.y + (li - (lines.length - 1) / 2) * lineH}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={fontSize} fontWeight={n.level <= 1 ? 'bold' : '600'}
              fill={c.text} style={{ pointerEvents: 'none', userSelect: 'none' }}>
              {line}
            </text>
          ))}
        </g>
      );
    } else {
      const r = NODE_R[n.level] ?? 28;
      return (
        <g key={n.id} style={{ cursor: 'grab' }}
          onMouseDown={e => onNodeMouseDown(e, n.id)}
          onTouchStart={e => onNodeTouchStart(e, n.id)}>
          <circle
            cx={pos.x} cy={pos.y} r={isSelected ? r + 5 : r}
            fill={isSelected ? c.border : c.bg}
            stroke={isSelected ? '#fff' : c.border}
            strokeWidth={isSelected ? 3 : 1.5}
            filter={`url(#shadow-${n.id})`}
            style={{ transition: 'r 0.15s, fill 0.15s' }}
          />
          {lines.map((line, li) => (
            <text key={li}
              x={pos.x} y={pos.y + (li - (lines.length - 1) / 2) * lineH}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={fontSize} fontWeight={n.level <= 1 ? 'bold' : '600'}
              fill={c.text} style={{ pointerEvents: 'none', userSelect: 'none' }}>
              {line}
            </text>
          ))}
        </g>
      );
    }
  }

  // Edge çizgisi: tree modda dirsekli (elbow), diğerlerinde bezier
  function renderEdge(edge, i) {
    const fromPos = nodePos[edge.from];
    const toPos = nodePos[edge.to];
    const toNode = nodes.find(n => n.id === edge.to);
    if (!fromPos || !toPos || !toNode) return null;
    const isCross = edge.isCross;
    const strokeColor = isCross ? '#f59e0b' : (darkMode ? '#334155' : '#cbd5e1');
    const strokeW = isCross ? 1.5 : (toNode.level === 1 ? 2.5 : 1.5);

    let d;
    if (isTree && !isCross) {
      // Dirsekli bağlantı: from'un altından to'nun üstüne
      const fromN = nodes.find(n => n.id === edge.from);
      const fh = Math.max(NODE_H[fromN?.level ?? 0] ?? 28, 28);
      const th = Math.max(NODE_H[toNode.level] ?? 28, 28);
      const x1 = fromPos.x, y1 = fromPos.y + fh / 2;
      const x2 = toPos.x, y2 = toPos.y - th / 2;
      const my = (y1 + y2) / 2;
      d = `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
    } else {
      const mx = (fromPos.x + toPos.x) / 2;
      const my = (fromPos.y + toPos.y) / 2;
      const r = NODE_R[toNode.level] ?? 28;
      const dx = toPos.x - fromPos.x, dy = toPos.y - fromPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const tx = toPos.x - (dx / dist) * r;
      const ty = toPos.y - (dy / dist) * r;
      d = `M${fromPos.x},${fromPos.y} Q${mx + (isCross ? 60 : 0)},${my + (isCross ? -60 : 0)} ${tx},${ty}`;
    }

    return (
      <g key={i}>
        <path d={d} fill="none" stroke={strokeColor} strokeWidth={strokeW}
          strokeDasharray={isCross ? '5,4' : 'none'}
          markerEnd={`url(#${isCross ? 'arrow-cross' : 'arrow'})`}
          opacity={0.75} />
        {edge.label && (
          <text
            x={(fromPos.x + toPos.x) / 2 + (isCross ? 30 : 0)}
            y={(fromPos.y + toPos.y) / 2 + (isCross ? -30 : -7)}
            textAnchor="middle" fontSize={isCross ? 9 : 10}
            fill={isCross ? '#f59e0b' : (darkMode ? '#64748b' : '#94a3b8')}
            fontStyle="italic" style={{ pointerEvents: 'none' }}>
            {edge.label}
          </text>
        )}
      </g>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col" style={{ minHeight: 680 }}>
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"
        style={{ background: darkMode ? '#0f172a' : '#f8fafc', cursor: 'grab', minHeight: 620, userSelect: 'none' }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      >
        {/* Zoom controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
          {[['＋', 1.2], ['－', 0.8], ['⊙', 'reset']].map(([label, val]) => (
            <button key={label} onMouseDown={e => e.stopPropagation()}
              onClick={() => setTransform(t => val === 'reset'
                ? { x: 0, y: 0, scale: 1 }
                : { ...t, scale: Math.min(4, Math.max(0.12, t.scale * val)) })}
              className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-bold shadow hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              {label}
            </button>
          ))}
          <button onMouseDown={e => e.stopPropagation()}
            onClick={() => {
              const el = svgRef.current; if (!el) return;
              const s = new XMLSerializer().serializeToString(el);
              const a = document.createElement('a');
              a.href = URL.createObjectURL(new Blob([s], { type: 'image/svg+xml;charset=utf-8' }));
              a.download = 'mindmap.svg'; a.click();
            }}
            title={lang === 'en' ? 'Download SVG' : 'SVG İndir'}
            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-bold shadow hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center">
            ↓
          </button>
        </div>

        <div className="absolute bottom-3 left-3 z-10 text-xs text-slate-400 dark:text-slate-500 pointer-events-none select-none">
          {lang === 'en' ? 'Drag nodes · Scroll to zoom · Click for details' : 'Düğümleri sürükle · Kaydır = zoom · Tıkla = detay'}
        </div>

        <svg ref={svgRef} width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={darkMode ? '#475569' : '#94a3b8'} />
            </marker>
            <marker id="arrow-cross" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
            </marker>
            {nodes.map(n => {
              const c = LEVEL_COLORS[n.level] || LEVEL_COLORS[3];
              return (
                <filter key={`shadow-${n.id}`} id={`shadow-${n.id}`} x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={c.shadow} floodOpacity="0.55" />
                </filter>
              );
            })}
          </defs>
          <g transform={`translate(${svgSize.w / 2 + transform.x}, ${svgSize.h / 2 + transform.y}) scale(${transform.scale})`}>
            {edges.map((edge, i) => renderEdge(edge, i))}
            {nodes.map(n => renderNode(n))}
          </g>
        </svg>
      </div>

      {/* Seçili node detay paneli */}
      {selectedNode && (
        <div className="mt-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full shrink-0 mt-1" style={{ background: LEVEL_COLORS[selectedNode.level]?.bg }} />
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{selectedNode.label}</h3>
            </div>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none shrink-0">×</button>
          </div>
          {selectedNode.description && <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">{selectedNode.description}</p>}
          {selectedNode.importance && (
            <div className="mb-3 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{lang === 'en' ? 'Why It Matters' : 'Önemi'}</span>
              <p className="mt-1 text-sm text-indigo-800 dark:text-indigo-200">{selectedNode.importance}</p>
            </div>
          )}
          {selectedNode.keyFacts?.length > 0 && (
            <div className="mb-3 px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{lang === 'en' ? 'Key Facts' : 'Anahtar Bilgiler'}</span>
              <ul className="mt-2 space-y-1">
                {selectedNode.keyFacts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: LEVEL_COLORS[selectedNode.level]?.bg }} />
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
