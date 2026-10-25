
import React from 'react';
import { CalculatedDimensions } from '../types';

interface BoxIllustrationProps {
  calc: CalculatedDimensions;
}

const BoxIllustration: React.FC<BoxIllustrationProps> = ({ calc }) => {
  const { tPrime, wPrime, hPrime } = calc;

  // 비율 계산을 위한 스케일링
  const maxDim = Math.max(wPrime, hPrime, tPrime);
  const scale = 180 / maxDim;

  const w = wPrime * scale;
  const h = hPrime * scale;
  const t = tPrime * scale;

  // 입체감을 위한 기울기 값
  const skewX = t * 0.7;
  const skewY = t * 0.4;

  // 박스 위치 오프셋 (중앙 정렬용)
  const offsetX = (400 - (w + skewX)) / 2;
  const offsetY = (300 - (h + skewY)) / 2 + skewY;

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center">
      <svg width="400" height="300" viewBox="0 0 400 300" className="w-full h-auto max-w-md">
        <defs>
          <linearGradient id="cardboardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#e3c5a8', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#d2a679', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="noise" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
        </defs>

        <g transform={`translate(${offsetX}, ${offsetY})`}>
          {/* Top Face */}
          <path 
            d={`M 0 0 L ${skewX} ${-skewY} L ${w + skewX} ${-skewY} L ${w} 0 Z`} 
            fill="#f3e5d8" 
            stroke="#b08d6d" 
            strokeWidth="1.5" 
          />
          <path 
            d={`M 0 0 L ${skewX} ${-skewY} L ${w + skewX} ${-skewY} L ${w} 0 Z`} 
            filter="url(#noise)" 
          />

          {/* Side Face */}
          <path 
            d={`M ${w} 0 L ${w + skewX} ${-skewY} L ${w + skewX} ${h - skewY} L ${w} ${h} Z`} 
            fill="#bc9671" 
            stroke="#8d6e53" 
            strokeWidth="1.5" 
          />
          <path 
            d={`M ${w} 0 L ${w + skewX} ${-skewY} L ${w + skewX} ${h - skewY} L ${w} ${h} Z`} 
            filter="url(#noise)" 
          />

          {/* Front Face */}
          <path 
            d={`M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`} 
            fill="url(#cardboardGradient)" 
            stroke="#a67c52" 
            strokeWidth="1.5" 
          />
          <path 
            d={`M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`} 
            filter="url(#noise)" 
          />

          {/* Dimensions Labels */}
          {/* W' Label */}
          <g transform={`translate(0, ${h + 25})`}>
            <line x1="0" y1="0" x2={w} y2="0" stroke="#3b82f6" strokeWidth="2" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke="#3b82f6" strokeWidth="2" />
            <line x1={w} y1="-5" x2={w} y2="5" stroke="#3b82f6" strokeWidth="2" />
            <text x={w / 2} y="20" textAnchor="middle" fill="#1d4ed8" style={{ fontSize: '18px', fontWeight: '900' }}>W' {wPrime}</text>
          </g>

          {/* H' Label */}
          <g transform={`translate(-25, 0)`}>
            <line x1="0" y1="0" x2="0" y2={h} stroke="#3b82f6" strokeWidth="2" />
            <line x1="-5" y1="0" x2="5" y2="0" stroke="#3b82f6" strokeWidth="2" />
            <line x1="-5" y1={h} x2={5} y2={h} stroke="#3b82f6" strokeWidth="2" />
            <text x="-10" y={h / 2} textAnchor="end" dominantBaseline="middle" fill="#1d4ed8" style={{ fontSize: '18px', fontWeight: '900' }}>H' {hPrime}</text>
          </g>

          {/* T' Label */}
          <g transform={`translate(${w + 10}, ${h})`}>
            <line x1="0" y1="0" x2={skewX} y2={-skewY} stroke="#3b82f6" strokeWidth="2" />
            <line x1="-3" y1="3" x2="3" y2="-3" stroke="#3b82f6" strokeWidth="2" />
            <line x1={skewX - 3} y1={-skewY + 3} x2={skewX + 3} y2={-skewY - 3} stroke="#3b82f6" strokeWidth="2" />
            <text x={skewX + 5} y={-skewY + 5} textAnchor="start" dominantBaseline="middle" fill="#1d4ed8" style={{ fontSize: '18px', fontWeight: '900' }}>T' {tPrime}</text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default BoxIllustration;
