
import React, { useState, useMemo } from 'react';
import { BoxDimensions, CalculatedDimensions } from './types';
import InputGroup from './components/InputGroup';
import Box2D from './components/Box2D';
import BoxIllustration from './components/BoxIllustration';

/**
 * @description Gemini API나 외부 서버 통신 없이 
 * 브라우저 내에서만 동작하는 순수 로컬 박스 계산기입니다.
 */
const App: React.FC = () => {
  const [dims, setDims] = useState<BoxDimensions>({
    thickness: 0,
    width: 0,
    height: 0,
  });

  const updateDim = (key: keyof BoxDimensions, value: number) => {
    setDims(prev => ({ ...prev, [key]: value }));
  };

  // 모든 계산은 여기서 실시간으로 처리됩니다 (No API required)
  const calc: CalculatedDimensions = useMemo(() => {
    const tPrime = dims.thickness + 5;
    const wPrime = dims.width + 10;
    const hPrime = dims.height + 10;

    const totalX = tPrime + wPrime + tPrime;
    const totalY = 40 + tPrime + hPrime + tPrime + hPrime;

    return { tPrime, wPrime, hPrime, totalX, totalY };
  }, [dims]);

  const isValid = dims.thickness > 0 && dims.width > 0 && dims.height > 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-xl font-black tracking-tight text-gray-900">박스 치수 계산기</h1>
          </div>
          <button 
            onClick={() => setDims({ thickness: 0, width: 0, height: 0 })}
            className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            초기화
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-8 space-y-8">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
            기본 치수 입력 (mm)
          </h2>
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            <InputGroup 
              label="두께 (T)" 
              value={dims.thickness} 
              onChange={(val) => updateDim('thickness', val)} 
            />
            <InputGroup 
              label="가로 (W)" 
              value={dims.width} 
              onChange={(val) => updateDim('width', val)} 
            />
            <InputGroup 
              label="세로 (H)" 
              value={dims.height} 
              onChange={(val) => updateDim('height', val)} 
            />
          </div>
        </section>

        {isValid ? (
          <div className="space-y-8">
            <section className="animate-in fade-in slide-in-from-top-4 duration-500">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                박스 시각화 (+10mm 보정)
              </h2>
              <BoxIllustration calc={calc} />
            </section>

            <section className="animate-in slide-in-from-bottom-8 duration-700">
              <Box2D calc={calc} />
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-inner">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <p className="text-xl font-black text-gray-600">준비 완료!</p>
            <p className="text-sm mt-2 font-medium text-gray-400">치수를 입력하면 도면이 실시간으로 생성됩니다.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
