
import React, { useMemo } from 'react';
import { CalculatedDimensions, CuttingLayout, SheetDimensions } from '../types';
import { findLayouts } from '../cutting';

interface SheetLayoutProps {
  calc: CalculatedDimensions;
  sheet: SheetDimensions;
}

interface SheetSvgProps {
  layout: CuttingLayout;
  sheet: SheetDimensions;
  detailed?: boolean;
}

// 원장 위에 전개도 배치를 그립니다. detailed가 아니면 비교용 썸네일로 그립니다.
const SheetSvg: React.FC<SheetSvgProps> = ({ layout, sheet, detailed = false }) => {
  const W = sheet.width;
  const H = sheet.height;
  const unit = Math.max(W, H) / 40;
  const padding = detailed ? unit * 4 : unit;
  const labelStyle = { fontSize: `${unit * 1.4}px`, fontWeight: '900' };
  const dimStyle = { fontSize: `${unit * 1.2}px`, fontWeight: '900' };

  return (
    <svg
      viewBox={`${-padding} ${-padding} ${W + padding * 2} ${H + padding * 2}`}
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="scrap" width={unit} height={unit} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2={unit} stroke="#d1d5db" strokeWidth={unit * 0.15} />
        </pattern>
      </defs>

      {/* 원장 (남는 부분은 빗금) */}
      <rect x={0} y={0} width={W} height={H} fill="url(#scrap)" stroke="#374151" strokeWidth={unit * 0.15} />

      {/* 배치된 전개도 */}
      {layout.pieces.map((p, i) => (
        <g key={i}>
          <rect
            x={p.x} y={p.y} width={p.w} height={p.h}
            fill={p.rotated ? '#e0e7ff' : '#dbeafe'}
            stroke={p.rotated ? '#4f46e5' : '#2563eb'}
            strokeWidth={unit * 0.12}
          />
          {detailed && (
            <>
              <text x={p.x + p.w / 2} y={p.y + p.h / 2} textAnchor="middle" dominantBaseline="middle" fill="#1e3a8a" style={labelStyle}>
                #{i + 1}
              </text>
              <text x={p.x + p.w / 2} y={p.y + p.h / 2 + unit * 1.8} textAnchor="middle" dominantBaseline="middle" fill="#6b7280" style={dimStyle}>
                {p.w}×{p.h}{p.rotated ? ' ↻' : ''}
              </text>
            </>
          )}
        </g>
      ))}

      {/* 원장 치수 */}
      {detailed && (
        <>
          <g transform={`translate(0, ${H + unit * 1.5})`}>
            <line x1="0" y1="0" x2={W} y2="0" stroke="#1e3a8a" strokeWidth={unit * 0.15} />
            <line x1="0" y1={-unit * 0.5} x2="0" y2={unit * 0.5} stroke="#1e3a8a" strokeWidth={unit * 0.15} />
            <line x1={W} y1={-unit * 0.5} x2={W} y2={unit * 0.5} stroke="#1e3a8a" strokeWidth={unit * 0.15} />
            <text x={W / 2} y={unit * 1.8} textAnchor="middle" fill="#1e3a8a" style={dimStyle}>원장 가로 {W}mm</text>
          </g>
          <g transform={`translate(${W + unit * 1.5}, 0) rotate(90)`}>
            <line x1="0" y1="0" x2={H} y2="0" stroke="#1e3a8a" strokeWidth={unit * 0.15} />
            <line x1="0" y1={-unit * 0.5} x2="0" y2={unit * 0.5} stroke="#1e3a8a" strokeWidth={unit * 0.15} />
            <line x1={H} y1={-unit * 0.5} x2={H} y2={unit * 0.5} stroke="#1e3a8a" strokeWidth={unit * 0.15} />
            <text x={H / 2} y={-unit * 0.8} textAnchor="middle" fill="#1e3a8a" style={dimStyle}>원장 세로 {H}mm</text>
          </g>
        </>
      )}
    </svg>
  );
};

const SheetLayout: React.FC<SheetLayoutProps> = ({ calc, sheet }) => {
  const { totalX, totalY } = calc;
  const { candidates, best } = useMemo(
    () => findLayouts(sheet.width, sheet.height, totalX, totalY),
    [sheet.width, sheet.height, totalX, totalY]
  );

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
        원장 재단 배치도
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        원장 {sheet.width} × {sheet.height}mm (두께 {sheet.thickness}mm)에서 전개도 {totalX} × {totalY}mm를 뽑는 배치입니다.
      </p>

      {best.count === 0 ? (
        <div className="py-12 text-center bg-red-50 rounded-2xl border border-red-200">
          <p className="text-lg font-black text-red-600">전개도가 원장보다 커서 재단할 수 없습니다.</p>
          <p className="text-sm text-red-400 mt-2">원장 크기를 늘리거나 박스 치수를 확인해 주세요.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* 배치 방식 비교 */}
          <div className={`grid gap-4 ${candidates.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {candidates.map(c => {
              const isBest = c === best;
              return (
                <div
                  key={c.label}
                  className={`p-3 rounded-2xl border-2 ${isBest ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-bold text-gray-700">{c.label}</p>
                    {isBest && <span className="text-[10px] font-black text-white bg-blue-600 px-2 py-0.5 rounded-full">추천</span>}
                  </div>
                  <div className="max-w-[160px] mx-auto">
                    <SheetSvg layout={c} sheet={sheet} />
                  </div>
                  <p className="text-center mt-2">
                    <span className={`text-2xl font-black ${isBest ? 'text-blue-600' : 'text-gray-700'}`}>{c.count}</span>
                    <span className="text-sm font-bold text-gray-400"> 개</span>
                  </p>
                  <p className="text-center text-[11px] text-gray-400 font-medium">사용률 {(c.usage * 100).toFixed(1)}%</p>
                </div>
              );
            })}
          </div>

          {/* 추천 배치 상세 */}
          <div className="w-full flex justify-center bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 shadow-inner">
            <div className="w-full max-w-xl">
              <SheetSvg layout={best} sheet={sheet} detailed />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <p className="text-blue-800 text-sm font-bold">
              추천: {best.label} 배치 · 원장 1장당 {best.count}개 · 사용률 {(best.usage * 100).toFixed(1)}% · 남는 부분 {(100 - best.usage * 100).toFixed(1)}%
            </p>
            <p className="text-blue-600 text-[11px] mt-1 leading-relaxed">
              파란색은 정방향, 보라색(↻)은 90° 돌려 놓은 전개도이고, 빗금은 남는 부분입니다. 칼날 두께 등 재단 여유는 포함되지 않았습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SheetLayout;
