
import { CuttingLayout, PlacedPiece } from './types';

// 지정한 영역 안에 같은 방향의 전개도를 격자로 채웁니다.
const fillGrid = (
  x0: number, y0: number, regionW: number, regionH: number,
  pw: number, ph: number, rotated: boolean
): PlacedPiece[] => {
  const cols = Math.floor(regionW / pw);
  const rows = Math.floor(regionH / ph);
  const pieces: PlacedPiece[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      pieces.push({ x: x0 + c * pw, y: y0 + r * ph, w: pw, h: ph, rotated });
    }
  }
  return pieces;
};

const makeLayout = (label: string, pieces: PlacedPiece[], sheetW: number, sheetH: number): CuttingLayout => {
  const used = pieces.reduce((sum, p) => sum + p.w * p.h, 0);
  return { label, pieces, count: pieces.length, usage: used / (sheetW * sheetH) };
};

/**
 * @description 원장(sheetW x sheetH)에서 전개도(pieceW x pieceH)를 최대한 많이 뽑는 배치를 찾습니다.
 * 정방향 / 90° 회전 / 두 방향을 한 번의 직선 재단으로 나눠 섞는 혼합 배치를 비교합니다.
 */
export const findLayouts = (sheetW: number, sheetH: number, pieceW: number, pieceH: number) => {
  const normal = makeLayout('정방향', fillGrid(0, 0, sheetW, sheetH, pieceW, pieceH, false), sheetW, sheetH);
  const rotated = makeLayout('90° 회전', fillGrid(0, 0, sheetW, sheetH, pieceH, pieceW, true), sheetW, sheetH);

  let mixed: CuttingLayout | null = null;
  const tryMixed = (pieces: PlacedPiece[]) => {
    if (!mixed || pieces.length > mixed.count) mixed = makeLayout('혼합', pieces, sheetW, sheetH);
  };

  // [먼저 채울 방향의 가로, 세로, 회전 여부] → 나머지 영역은 반대 방향으로 채움
  const orders: [number, number, boolean][] = [
    [pieceW, pieceH, false],
    [pieceH, pieceW, true],
  ];
  for (const [aw, ah, aRot] of orders) {
    const [bw, bh] = [ah, aw];
    // 세로로 잘라 왼쪽/오른쪽 영역 나누기
    for (let i = 1; i * aw < sheetW; i++) {
      const split = i * aw;
      tryMixed([
        ...fillGrid(0, 0, split, sheetH, aw, ah, aRot),
        ...fillGrid(split, 0, sheetW - split, sheetH, bw, bh, !aRot),
      ]);
    }
    // 가로로 잘라 위/아래 영역 나누기
    for (let j = 1; j * ah < sheetH; j++) {
      const split = j * ah;
      tryMixed([
        ...fillGrid(0, 0, sheetW, split, aw, ah, aRot),
        ...fillGrid(0, split, sheetW, sheetH - split, bw, bh, !aRot),
      ]);
    }
  }

  const candidates = [normal, rotated];
  const m = mixed as CuttingLayout | null;
  // 혼합 배치는 단순 배치보다 많이 나올 때만 후보로 보여줍니다.
  if (m && m.count > Math.max(normal.count, rotated.count)) candidates.push(m);

  // 수량이 같으면 정방향 → 회전 순으로 단순한 배치를 추천합니다.
  const best = candidates.reduce((a, b) => (b.count > a.count ? b : a));
  return { candidates, best };
};
