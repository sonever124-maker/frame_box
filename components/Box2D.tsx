
import React from 'react';
import { CalculatedDimensions } from '../types';

interface Box2DProps {
  calc: CalculatedDimensions;
}

const Box2D: React.FC<Box2DProps> = ({ calc }) => {
  const { tPrime, wPrime, hPrime, totalX, totalY } = calc;

  // SVG 설정을 위한 여백 및 스케일 계산
  const padding = 120;
  const viewBoxWidth = totalX + padding * 3;
  const viewBoxHeight = totalY + padding * 3;

  // 가로 구분점
  const x0 = padding;
  const x1 = padding + tPrime;
  const x2 = padding + tPrime + wPrime;
  const x3 = padding + totalX;

  // 세로 구분점
  const y0 = padding;
  const y1 = padding + 40;
  const y2 = padding + 40 + tPrime;
  const y3 = padding + 40 + tPrime + hPrime;
  const y4 = padding + 40 + tPrime + hPrime + tPrime;
  const y5 = padding + totalY;

  // 내부 치수 텍스트 스타일 (시인성 극대화)
  const mainLabelStyle = { fontSize: '48px', fill: '#000000', fontWeight: '900' };
  // 합계 치수 텍스트 스타일
  const totalLabelStyle = { fontSize: '36px', fontWeight: '900' };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        박스 전개도 상세 설계
      </h3>

      <div className="flex flex-col gap-8">
        {/* SVG Diagram Section */}
        <div className="w-full flex justify-center bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 overflow-hidden shadow-inner">
          <svg 
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
            className="w-full h-auto max-h-[800px]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* 전체 외곽선 */}
            <rect 
              x={x0} y={y0} width={totalX} height={totalY} 
              fill="#ffffff" stroke="#1e40af" strokeWidth="4" 
            />

            {/* 가로 접는 선 */}
            <line x1={x1} y1={y0} x2={x1} y2={y5} stroke="#3b82f6" strokeWidth="3" strokeDasharray="10 5" />
            <line x1={x2} y1={y0} x2={x2} y2={y5} stroke="#3b82f6" strokeWidth="3" strokeDasharray="10 5" />

            {/* 세로 접는 선 */}
            <line x1={x0} y1={y1} x2={x3} y2={y1} stroke="#3b82f6" strokeWidth="3" strokeDasharray="10 5" />
            <line x1={x0} y1={y2} x2={x3} y2={y2} stroke="#3b82f6" strokeWidth="3" strokeDasharray="10 5" />
            <line x1={x0} y1={y3} x2={x3} y2={y3} stroke="#3b82f6" strokeWidth="3" strokeDasharray="10 5" />
            <line x1={x0} y1={y4} x2={x3} y2={y4} stroke="#3b82f6" strokeWidth="3" strokeDasharray="10 5" />

            {/* 내부 구역 레이블 */}
            <text x={x0 + (x1-x0)/2} y={y1 + (y2-y1)/2} textAnchor="middle" dominantBaseline="middle" style={mainLabelStyle}>T' {tPrime}</text>
            <text x={x1 + (x2-x1)/2} y={y1 + (y2-y1)/2} textAnchor="middle" dominantBaseline="middle" style={mainLabelStyle}>W' {wPrime}</text>
            <text x={x2 + (x3-x2)/2} y={y1 + (y2-y1)/2} textAnchor="middle" dominantBaseline="middle" style={mainLabelStyle}>T' {tPrime}</text>
            
            <text x={x1 + (x2-x1)/2} y={y0 + (y1-y0)/2} textAnchor="middle" dominantBaseline="middle" style={mainLabelStyle}>날개 40</text>
            <text x={x1 + (x2-x1)/2} y={y2 + (y3-y2)/2} textAnchor="middle" dominantBaseline="middle" style={mainLabelStyle}>H' {hPrime}</text>
            <text x={x1 + (x2-x1)/2} y={y3 + (y4-y3)/2} textAnchor="middle" dominantBaseline="middle" style={mainLabelStyle}>T' {tPrime}</text>
            <text x={x1 + (x2-x1)/2} y={y4 + (y5-y4)/2} textAnchor="middle" dominantBaseline="middle" style={mainLabelStyle}>H' {hPrime}</text>

            {/* 가로 합계 가이드라인 */}
            <g transform={`translate(${x0}, ${y5 + 80})`}>
              <line x1="0" y1="0" x2={totalX} y2="0" stroke="#1e3a8a" strokeWidth="5" />
              <line x1="0" y1="-15" x2="0" y2="15" stroke="#1e3a8a" strokeWidth="5" />
              <line x1={totalX} y1="-15" x2={totalX} y2="15" stroke="#1e3a8a" strokeWidth="5" />
              <text x={totalX/2} y="50" textAnchor="middle" fill="#1e3a8a" style={totalLabelStyle}>가로 합계: {totalX}mm</text>
            </g>

            {/* 세로 합계 가이드라인 */}
            <g transform={`translate(${x3 + 80}, ${y0}) rotate(90)`}>
              <line x1="0" y1="0" x2={totalY} y2="0" stroke="#1e3a8a" strokeWidth="5" />
              <line x1="0" y1="-15" x2="0" y2="15" stroke="#1e3a8a" strokeWidth="5" />
              <line x1={totalY} y1="-15" x2={totalY} y2="15" stroke="#1e3a8a" strokeWidth="5" />
              <text x={totalY/2} y="-25" textAnchor="middle" fill="#1e3a8a" style={totalLabelStyle}>세로 합계: {totalY}mm</text>
            </g>
          </svg>
        </div>

        {/* Total Summary Section - 한 단(Row) 좌우 배치 레이아웃, 배경색 삭제 */}
        <div className="space-y-4">
          <div className="py-6 px-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              {/* Width Summary (Left) */}
              <div className="flex flex-col items-center justify-center py-2 px-4">
                <p className="text-[11px] text-gray-500 font-bold mb-1 uppercase tracking-wider">전체 가로 (W_Total)</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-4xl font-black text-blue-600">{totalX}</p>
                  <span className="text-sm font-bold text-gray-400">mm</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 font-medium">수식: {tPrime} + {wPrime} + {tPrime}</p>
              </div>

              {/* Height Summary (Right) */}
              <div className="flex flex-col items-center justify-center py-2 px-4">
                <p className="text-[11px] text-gray-500 font-bold mb-1 uppercase tracking-wider">전체 세로 (H_Total)</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-4xl font-black text-indigo-600">{totalY}</p>
                  <span className="text-sm font-bold text-gray-400">mm</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                   <p className="text-lg font-black text-indigo-500">({hPrime}, {totalY - hPrime})</p>
                   <span className="text-[10px] text-gray-400 font-medium leading-tight">
                     H' /<br />나머지
                   </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <p className="text-yellow-800 text-[11px] flex items-center gap-2 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              안내사항
            </p>
            <p className="text-yellow-700 text-[10px] mt-1 leading-relaxed">
              도면의 점선은 접는 선(Creg line), 실선은 절단 선(Cut line)입니다. 위 수치는 가공 시의 보정 여유분(+10mm)이 포함된 최종 생산용 데이터입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Box2D;
