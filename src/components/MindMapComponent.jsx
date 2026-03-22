import React, { useRef, useState, useEffect, useCallback } from 'react';

const LEVEL_COLORS = {
  0: { bg: '#6366f1', text: '#fff', border: '#4f46e5', shadow: 'rgba(99,102,241,0.4)' },
  1: { bg: '#0ea5e9', text: '#fff', border: '#0284c7', shadow: 'rgba(14,165,233,0.35)' },
  2: { bg: '#10b981', text: '#fff', border: '#059669', shadow: 'rgba(16,185,129,0.3)' },
  3: { bg: '#f59e0b', text: '#fff', border: '#d97706', shadow: 'rgba(245,158,11,0.3)' },
};
const NODE_W = [160, 136, 116, 96];
const NODE_H = [52, 44, 38, 32];
const NODE_R = [62, 50, 42, 34];

// ─── Radial ────────────────────────────────────────────────────────────────────
function computeRadial(data) {
  const nodes = [], edges = [], nodeMap = {};
  const root = { id: 'root', label: data.root, description: data.rootDescription || '',
    importance: '', keyFacts: [], example: '', level: 0, x: 0, y: 0 };
  nodes.push(root); nodeMap['root'] = root;
  const cats = data.nodes || [];
  cats.forEach((cat, ci) => {
    const angle = (2 * Math.PI * ci) / cats.length - Math.PI / 2;
    const catNode = { id: cat.id, label: cat.label, description: cat.description || '',
      importance: cat.importance || '', keyFacts: cat.keyFacts || [], example: cat.example || '',
      level: 1, x: Math.cos(angle) * 340, y: Math.sin(angle) * 340 };
    nodes.push(catNode); nodeMap[cat.id] = catNode;
    edges.push({ from: 'root', to: cat.id, label: cat.relation || '' });
    (cat.children || []).forEach((child, chi) => {
      const cc = (cat.children || []).length;
      const spread = Math.min(Math.PI * 0.65, cc * 0.35);
      const ca = angle - spread / 2 + (spread / Math.max(cc - 1, 1)) * chi;
      const childNode = { id: child.id, label: child.label, description: child.description || '',
        importance: child.importance || '', keyFacts: child.keyFacts || [], example: child.example || '',
        level: 2, x: Math.cos(ca) * 640, y: Math.sin(ca) * 640 };
      nodes.push(childNode); nodeMap[child.id] = childNode;
      edges.push({ from: cat.id, to: child.id, label: child.relation || '' });
      (child.children || []).forEach((detail, di) => {
        const dc = (child.children || []).length;
        const ds = Math.min(Math.PI * 0.35, dc * 0.25);
        const da = ca - ds / 2 + (ds / Math.max(dc - 1, 1)) * di;
        const detailNode = { id: detail.id, label: detail.label, description: detail.description || '',
          importance: detail.importance || '', keyFacts: detail.keyFacts || [], example: detail.example || '',
          level: 3, x: Math.cos(da) * 920, y: Math.sin(da) * 920 };
        nodes.push(detailNode); nodeMap[detail.id] = detailNode;
        edges.push({ from: child.id, to: detail.id, label: detail.relation || '' });
      });
    });
  });
  (data.crossLinks || []).forEach(l => {
    if (nodeMap[l.from] && nodeMap[l.to])
      edges.push({ from: l.from, to: l.to, label: l.label || '', isCross: true });
  });
  return { nodes, edges, nodeMap };
}

// ─── Dikey ağaç ────────────────────────────────────────────────────────────────
function computeTree(data) {
  const nodes = [], edges = [], nodeMap = {};
  const LEAF_W = 260, LEVEL_H = 140;
  function flatten(node, level, parentId) {
    const n = { id: node.id || 'root', label: node.label || node.root || '',
      description: node.description || node.rootDescription || '',
      importance: node.importance || '', keyFacts: node.keyFacts || [],
      example: node.example || '', level, x: 0, y: 0, _ch: node.children || [] };
    nodes.push(n); nodeMap[n.id] = n;
    if (parentId) edges.push({ from: parentId, to: n.id, label: node.relation || '' });
    n._ch.forEach(c => flatten(c, level + 1, n.id));
  }
  flatten({ id: 'root', root: data.root, rootDescription: data.rootDescription, children: data.nodes || [] }, 0, null);
  function leafCount(id) {
    const n = nodeMap[id];
    if (!n._ch.length) return 1;
    return n._ch.reduce((s, c) => s + leafCount(c.id || c), 0);
  }
  function assignX(id, startLeaf) {
    const n = nodeMap[id];
    if (!n._ch.length) { n.x = (startLeaf + 0.5) * LEAF_W; return; }
    let cur = startLeaf;
    n._ch.forEach(c => { const cid = c.id || c; assignX(cid, cur); cur += leafCount(cid); });
    const fc = nodeMap[n._ch[0].id || n._ch[0]];
    const lc = nodeMap[n._ch[n._ch.length - 1].id || n._ch[n._ch.length - 1]];
    n.x = (fc.x + lc.x) / 2;
  }
  assignX('root', 0);
  nodes.forEach(n => { n.y = n.level * LEVEL_H; });
  (data.crossLinks || []).forEach(l => {
    if (nodeMap[l.from] && nodeMap[l.to])
      edges.push({ from: l.from, to: l.to, label: l.label || '', isCross: true });
  });
  return { nodes, edges, nodeMap };
}

// ─── Yatay ağaç ────────────────────────────────────────────────────────────────
function computeHorizontal(data) {
  const nodes = [], edges = [], nodeMap = {};
  const LEAF_H = 110, LEVEL_W = 270;
  function flatten(node, level, parentId) {
    const n = { id: node.id || 'root', label: node.label || node.root || '',
      description: node.description || node.rootDescription || '',
      importance: node.importance || '', keyFacts: node.keyFacts || [],
      example: node.example || '', level, x: 0, y: 0, _ch: node.children || [] };
    nodes.push(n); nodeMap[n.id] = n;
    if (parentId) edges.push({ from: parentId, to: n.id, label: node.relation || '' });
    n._ch.forEach(c => flatten(c, level + 1, n.id));
  }
  flatten({ id: 'root', root: data.root, rootDescription: data.rootDescription, children: data.nodes || [] }, 0, null);
  function leafCount(id) {
    const n = nodeMap[id];
    if (!n._ch.length) return 1;
    return n._ch.reduce((s, c) => s + leafCount(c.id || c), 0);
  }
  function assignY(id, startLeaf) {
    const n = nodeMap[id];
    if (!n._ch.length) { n.y = (startLeaf + 0.5) * LEAF_H; return; }
    let cur = startLeaf;
    n._ch.forEach(c => { const cid = c.id || c; assignY(cid, cur); cur += leafCount(cid); });
    const fc = nodeMap[n._ch[0].id || n._ch[0]];
    const lc = nodeMap[n._ch[n._ch.length - 1].id || n._ch[n._ch.length - 1]];
    n.y = (fc.y + lc.y) / 2;
  }
  assignY('root', 0);
  nodes.forEach(n => { n.x = n.level * LEVEL_W; });
  (data.crossLinks || []).forEach(l => {
    if (nodeMap[l.from] && nodeMap[l.to])
      edges.push({ from: l.from, to: l.to, label: l.label || '', isCross: true });
  });
  return { nodes, edges, nodeMap };
}

// ─── Metin satırlara böl ───────────────────────────────────────────────────────
function wrapText(label, level) {
  const maxChars = level === 0 ? 16 : level === 1 ? 14 : 12;
  const words = (label || '').split(' ');
  const lines = []; let cur = '';
  words.forEach(w => {
    if ((cur + ' ' + w).trim().length > maxChars) { lines.push(cur.trim()); cur = w; }
    else cur = (cur + ' ' + w).trim();
  });
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}

// ─── Ana bileşen ───────────────────────────────────────────────────────────────
export default function MindMapComponent({ data, darkMode, lang = 'tr', layoutMode = 'radial', fullscreen = false }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [svgSize, setSvgSize] = useState({ w: 900, h: 580 });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [selected, setSelected] = useState(null);
  const [layout, setLayout] = useState(null);
  const [nodePos, setNodePos] = useState({});

  const canvasDrag = useRef(null);
  const nodeDrag = useRef(null);
  const transformRef = useRef(transform);
  const layoutNodesRef = useRef([]);
  const nodePosRef = useRef({});

  // setTransform'u wrap et: her güncellemede ref'i de sync olarak güncelle
  const setTransformSync = useCallback((updater) => {
    setTransform(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      transformRef.current = next;
      return next;
    });
  }, []);

  // ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setSvgSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(el);
    setSvgSize({ w: el.clientWidth || 900, h: el.clientHeight || 580 });
    return () => ro.disconnect();
  }, []);

  // Auto-fit hesapla (reusable)
  const computeFit = useCallback((nodes, w, h) => {
    if (!nodes || nodes.length === 0) return { x: 0, y: 0, scale: 1 };
    const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const cw = w || 900, ch = h || 580;
    const pad = 140;
    const sx = (cw - pad * 2) / Math.max(maxX - minX, 1);
    const sy = (ch - pad * 2) / Math.max(maxY - minY, 1);
    const scale = Math.min(0.85, Math.max(0.18, Math.min(sx, sy)));
    return {
      x: -((minX + maxX) / 2) * scale,
      y: -((minY + maxY) / 2) * scale,
      scale,
    };
  }, []);

  // Layout + auto-fit
  useEffect(() => {
    if (!data) return;
    let l;
    if (layoutMode === 'tree') l = computeTree(data);
    else if (layoutMode === 'horizontal') l = computeHorizontal(data);
    else l = computeRadial(data);
    setLayout(l);
    setSelected(null);
    const pos = {};
    l.nodes.forEach(n => { pos[n.id] = { x: n.x, y: n.y }; });
    setNodePos(pos);
    nodePosRef.current = pos;
    layoutNodesRef.current = l.nodes;
    setTransformSync(computeFit(l.nodes, svgSize.w, svgSize.h));
  }, [data, layoutMode, computeFit]); // svgSize omitted intentionally

  // Wheel zoom
  const onWheel = useCallback((e) => {
    e.preventDefault();
    setTransformSync(t => ({ ...t, scale: Math.min(4, Math.max(0.12, t.scale * (e.deltaY > 0 ? 0.9 : 1.1))) }));
  }, [setTransformSync]);
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  // SVG koordinat dönüşümü
  const toSVGCoords = useCallback((clientX, clientY) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const { x: tx, y: ty, scale: s } = transformRef.current;
    return {
      x: (clientX - rect.left - (rect.width / 2 + tx)) / s,
      y: (clientY - rect.top  - (rect.height / 2 + ty)) / s,
    };
  }, []);

  // Mouse — canvas pan
  const onMouseDown = useCallback((e) => {
    if (nodeDrag.current || e.button !== 0) return;
    canvasDrag.current = { startX: e.clientX - transformRef.current.x, startY: e.clientY - transformRef.current.y };
  }, []);

  // Node drag: node'un başlangıç pozisyonunu + mouse'un başlangıç SVG koordinatını kaydet
  // onMouseMove'da: yeniPos = nodeStart + (currentMouseSVG - mouseStart)
  const onNodeMouseDown = useCallback((e, id) => {
    e.stopPropagation();
    const mouseStart = toSVGCoords(e.clientX, e.clientY);
    const nodeStart = nodePosRef.current[id] ?? { x: 0, y: 0 };
    nodeDrag.current = { id, clientX: e.clientX, clientY: e.clientY, mouseStart, nodeStart, moved: false };
  }, [toSVGCoords]);

  const onMouseMove = useCallback((e) => {
    const nd = nodeDrag.current;
    const cd = canvasDrag.current;
    if (nd) {
      if (Math.abs(e.clientX - nd.clientX) > 3 || Math.abs(e.clientY - nd.clientY) > 3) nd.moved = true;
      const cur = toSVGCoords(e.clientX, e.clientY);
      const newPos = {
        x: nd.nodeStart.x + (cur.x - nd.mouseStart.x),
        y: nd.nodeStart.y + (cur.y - nd.mouseStart.y),
      };
      nodePosRef.current = { ...nodePosRef.current, [nd.id]: newPos };
      setNodePos(p => ({ ...p, [nd.id]: newPos }));
    } else if (cd) {
      setTransformSync(t => ({ ...t, x: e.clientX - cd.startX, y: e.clientY - cd.startY }));
    }
  }, [toSVGCoords, setTransformSync]);

  const onMouseUp = useCallback(() => {
    const nd = nodeDrag.current;
    if (nd) {
      if (!nd.moved) setSelected(p => p === nd.id ? null : nd.id);
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
      const mouseStart = toSVGCoords(e.touches[0].clientX, e.touches[0].clientY);
      const nodeStart = nodePosRef.current[id] ?? { x: 0, y: 0 };
      nodeDrag.current = { id, clientX: e.touches[0].clientX, clientY: e.touches[0].clientY, mouseStart, nodeStart, moved: false };
    }
  }, [toSVGCoords]);
  const onTouchMove = useCallback((e) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    const nd = nodeDrag.current;
    const cd = canvasDrag.current;
    if (nd) {
      if (Math.abs(t.clientX - nd.clientX) > 5 || Math.abs(t.clientY - nd.clientY) > 5) nd.moved = true;
      const cur = toSVGCoords(t.clientX, t.clientY);
      const newPos = {
        x: nd.nodeStart.x + (cur.x - nd.mouseStart.x),
        y: nd.nodeStart.y + (cur.y - nd.mouseStart.y),
      };
      nodePosRef.current = { ...nodePosRef.current, [nd.id]: newPos };
      setNodePos(p => ({ ...p, [nd.id]: newPos }));
    } else if (cd) {
      setTransformSync(tr => ({ ...tr, x: t.clientX - cd.startX, y: t.clientY - cd.startY }));
    }
  }, [toSVGCoords, setTransformSync]);
  const onTouchEnd = useCallback(() => {
    const nd = nodeDrag.current;
    if (nd) {
      if (!nd.moved) setSelected(p => p === nd.id ? null : nd.id);
      nodeDrag.current = null;
    }
    canvasDrag.current = null;
  }, []);

  if (!layout) return null;
  const { nodes, edges } = layout;
  const selectedNode = selected ? (nodes.find(n => n.id === selected) ?? null) : null;
  const isTree = layoutMode === 'tree';
  const isHoriz = layoutMode === 'horizontal';
  const isRect = isTree || isHoriz;

  const renderNode = (n) => {
    const pos = nodePos[n.id] ?? { x: n.x, y: n.y };
    const c = LEVEL_COLORS[n.level] ?? LEVEL_COLORS[3];
    const isSel = selected === n.id;
    const lines = wrapText(n.label, n.level);
    const fontSize = n.level === 0 ? 13 : n.level === 1 ? 11.5 : n.level === 2 ? 10.5 : 9.5;
    const lineH = fontSize * 1.35;
    if (isRect) {
      const w = NODE_W[n.level] ?? 96, h = Math.max(NODE_H[n.level] ?? 32, lines.length * lineH + 14);
      const rx = n.level === 0 ? 14 : n.level === 1 ? 10 : 7;
      return (
        <g key={n.id} style={{ cursor: 'grab' }}
          onMouseDown={e => onNodeMouseDown(e, n.id)} onTouchStart={e => onNodeTouchStart(e, n.id)}>
          <rect x={pos.x - w / 2} y={pos.y - h / 2} width={w} height={h} rx={rx}
            fill={isSel ? c.border : c.bg} stroke={isSel ? '#fff' : c.border}
            strokeWidth={isSel ? 2.5 : 1.5} filter={`url(#shadow-${n.id})`} style={{ transition: 'fill 0.15s' }} />
          {lines.map((line, li) => (
            <text key={li} x={pos.x} y={pos.y + (li - (lines.length - 1) / 2) * lineH}
              textAnchor="middle" dominantBaseline="middle" fontSize={fontSize}
              fontWeight={n.level <= 1 ? 'bold' : '600'} fill={c.text}
              style={{ pointerEvents: 'none', userSelect: 'none' }}>{line}</text>
          ))}
        </g>
      );
    }
    const r = NODE_R[n.level] ?? 34;
    return (
      <g key={n.id} style={{ cursor: 'grab' }}
        onMouseDown={e => onNodeMouseDown(e, n.id)} onTouchStart={e => onNodeTouchStart(e, n.id)}>
        <circle cx={pos.x} cy={pos.y} r={isSel ? r + 5 : r}
          fill={isSel ? c.border : c.bg} stroke={isSel ? '#fff' : c.border}
          strokeWidth={isSel ? 3 : 1.5} filter={`url(#shadow-${n.id})`}
          style={{ transition: 'r 0.15s, fill 0.15s' }} />
        {lines.map((line, li) => (
          <text key={li} x={pos.x} y={pos.y + (li - (lines.length - 1) / 2) * lineH}
            textAnchor="middle" dominantBaseline="middle" fontSize={fontSize}
            fontWeight={n.level <= 1 ? 'bold' : '600'} fill={c.text}
            style={{ pointerEvents: 'none', userSelect: 'none' }}>{line}</text>
        ))}
      </g>
    );
  };

  const renderEdge = (edge, i) => {
    const fp = nodePos[edge.from], tp = nodePos[edge.to];
    const toNode = nodes.find(n => n.id === edge.to);
    const fromNode = nodes.find(n => n.id === edge.from);
    if (!fp || !tp || !toNode || !fromNode) return null;
    const isCross = !!edge.isCross;
    const strokeColor = isCross ? '#f59e0b' : (darkMode ? '#334155' : '#cbd5e1');
    const strokeW = isCross ? 1.5 : (toNode.level === 1 ? 2.5 : 1.5);
    let d;
    if (isTree && !isCross) {
      const fh = NODE_H[fromNode.level] ?? 32, th = NODE_H[toNode.level] ?? 32;
      const y1 = fp.y + fh / 2, y2 = tp.y - th / 2, my = (y1 + y2) / 2;
      d = `M${fp.x},${y1} C${fp.x},${my} ${tp.x},${my} ${tp.x},${y2}`;
    } else if (isHoriz && !isCross) {
      const fw = NODE_W[fromNode.level] ?? 96, tw = NODE_W[toNode.level] ?? 96;
      const x1 = fp.x + fw / 2, x2 = tp.x - tw / 2, mx = (x1 + x2) / 2;
      d = `M${x1},${fp.y} C${mx},${fp.y} ${mx},${tp.y} ${x2},${tp.y}`;
    } else {
      const r = NODE_R[toNode.level] ?? 34;
      const dx = tp.x - fp.x, dy = tp.y - fp.y, dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const mx = (fp.x + tp.x) / 2, my = (fp.y + tp.y) / 2;
      d = `M${fp.x},${fp.y} Q${mx + (isCross ? 60 : 0)},${my + (isCross ? -60 : 0)} ${tp.x - (dx / dist) * r},${tp.y - (dy / dist) * r}`;
    }
    return (
      <g key={i}>
        <path d={d} fill="none" stroke={strokeColor} strokeWidth={strokeW}
          strokeDasharray={isCross ? '5,4' : 'none'}
          markerEnd={`url(#${isCross ? 'arrow-cross' : 'arrow'})`} opacity={0.75} />
        {edge.label && (
          <text x={(fp.x + tp.x) / 2 + (isCross ? 30 : 0)} y={(fp.y + tp.y) / 2 + (isCross ? -30 : -8)}
            textAnchor="middle" fontSize={isCross ? 9 : 10}
            fill={isCross ? '#f59e0b' : (darkMode ? '#64748b' : '#94a3b8')}
            fontStyle="italic" style={{ pointerEvents: 'none' }}>{edge.label}</text>
        )}
      </g>
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col" style={fullscreen ? { flex: 1, minHeight: 0 } : { minHeight: 640 }}>
      {/* Canvas */}
      <div ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"
        style={{ background: darkMode ? '#0f172a' : '#f8fafc', cursor: 'grab',
          width: '100%', height: fullscreen ? '100%' : 660, userSelect: 'none' }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>

        {/* Zoom controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
          {[['＋', 1.2], ['－', 0.8]].map(([label, val]) => (
            <button key={label} onMouseDown={e => e.stopPropagation()}
              onClick={() => setTransformSync(t => ({ ...t, scale: Math.min(4, Math.max(0.12, t.scale * val)) }))}
              className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-bold shadow hover:bg-slate-50 dark:hover:bg-slate-700 transition">{label}</button>
          ))}
          {/* Scale to Fit */}
          <button onMouseDown={e => e.stopPropagation()}
            onClick={() => setTransformSync(computeFit(layoutNodesRef.current, svgSize.w, svgSize.h))}
            title={lang === 'en' ? 'Fit to screen' : 'Ekrana sığdır'}
            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold shadow hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center">⊡</button>
          {/* Reset */}
          <button onMouseDown={e => e.stopPropagation()}
            onClick={() => setTransformSync({ x: 0, y: 0, scale: 1 })}
            title={lang === 'en' ? 'Reset view' : 'Görünümü sıfırla'}
            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-bold shadow hover:bg-slate-50 dark:hover:bg-slate-700 transition">⊙</button>
          {/* SVG download */}
          <button onMouseDown={e => e.stopPropagation()}
            onClick={() => { const el = svgRef.current; if (!el) return; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(el)], { type: 'image/svg+xml;charset=utf-8' })); a.download = 'mindmap.svg'; a.click(); }}
            title={lang === 'en' ? 'Download SVG' : 'SVG İndir'}
            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-bold shadow hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center">↓</button>
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
              const c = LEVEL_COLORS[n.level] ?? LEVEL_COLORS[3];
              return (
                <filter key={`shadow-${n.id}`} id={`shadow-${n.id}`} x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={c.shadow} floodOpacity="0.55" />
                </filter>
              );
            })}
          </defs>
          <g transform={`translate(${svgSize.w / 2 + transform.x},${svgSize.h / 2 + transform.y}) scale(${transform.scale})`}>
            {edges.map((edge, i) => renderEdge(edge, i))}
            {nodes.map(n => renderNode(n))}
          </g>
        </svg>
      </div>

      {/* Detay paneli */}
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
          {(selectedNode.keyFacts?.length > 0) && (
            <div className="mb-3 px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{lang === 'en' ? 'Key Facts' : 'Anahtar Bilgiler'}</span>
              <ul className="mt-2 space-y-1">
                {selectedNode.keyFacts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: LEVEL_COLORS[selectedNode.level]?.bg }} />{fact}
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
