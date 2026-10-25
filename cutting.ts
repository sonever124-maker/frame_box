
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

// 폭이 전개도 가로와 같은 띠 하나. horizontal이면 x축 방향으로, 아니면 y축 방향으로 length만큼 이어집니다.
interface Strip {
  x: number;
  y: number;
  length: number;
  horizontal: boolean;
}

// DP 계산량 상한 (아주 작은 치수를 입력하는 도중에 화면이 멈추지 않도록)
const MAX_DP_STEPS = 300000;

/**
 * @description 띠들에 H1 조각(pieceW x h1)과 H나머지 조각(pieceW x rest)을 나눠 담아
 * 짝(박스 1개분)이 최대한 많이 나오게 합니다. 띠마다 H1 조각 수를 정하면 나머지 길이에 H나머지 조각을 채웁니다.
 */
const packSplitStrips = (strips: Strip[], pieceW: number, h1: number, rest: number, maxSets: number): PlacedPiece[] | null => {
  const n = strips.length;
  const U = maxSets;
  const steps = strips.reduce((sum, s) => sum + (Math.floor(s.length / h1) + 1) * (U + 1), 0);
  if (n === 0 || U === 0 || steps > MAX_DP_STEPS) return null;

  // dp[i][t]: 앞의 i개 띠에서 H1 조각을 t개(U에서 자름) 뽑을 때 H나머지 조각의 최대 개수
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(U + 1).fill(-1));
  const pickA = Array.from({ length: n + 1 }, () => new Int32Array(U + 1));
  const prevT = Array.from({ length: n + 1 }, () => new Int32Array(U + 1));
  dp[0][0] = 0;
  for (let i = 0; i < n; i++) {
    const L = strips[i].length;
    for (let t = 0; t <= U; t++) {
      if (dp[i][t] < 0) continue;
      for (let a = 0; a * h1 <= L; a++) {
        const b = Math.floor((L - a * h1) / rest);
        const nt = Math.min(U, t + a);
        if (dp[i][t] + b > dp[i + 1][nt]) {
          dp[i + 1][nt] = dp[i][t] + b;
          pickA[i + 1][nt] = a;
          prevT[i + 1][nt] = t;
        }
      }
    }
  }

  let sets = 0;
  let endT = 0;
  for (let t = 0; t <= U; t++) {
    const s = Math.min(t, dp[n][t]);
    if (s > sets) { sets = s; endT = t; }
  }
  if (sets === 0) return null;

  // 띠별 H1 조각 수 복원
  const counts: number[] = new Array(n);
  for (let i = n, t = endT; i > 0; i--) {
    counts[i - 1] = pickA[i][t];
    t = prevT[i][t];
  }

  // 짝이 맞는 만큼만 배치합니다. 한 띠 안에서는 H1·H나머지를 번갈아 놓아 붙어 있는 짝이 많도록 합니다.
  const pieces: PlacedPiece[] = [];
  let needA = sets;
  let needB = sets;
  strips.forEach((strip, i) => {
    const a = Math.min(counts[i], needA);
    const b = Math.min(Math.floor((strip.length - counts[i] * h1) / rest), needB);
    needA -= a;
    needB -= b;
    const order: ('H1' | 'rest')[] = [];
    for (let k = 0; k < Math.max(a, b); k++) {
      if (k < a) order.push('H1');
      if (k < b) order.push('rest');
    }
    let offset = 0;
    for (const part of order) {
      const len = part === 'H1' ? h1 : rest;
      pieces.push(strip.horizontal
        ? { x: strip.x + offset, y: strip.y, w: len, h: pieceW, rotated: true, part }
        : { x: strip.x, y: strip.y + offset, w: pieceW, h: len, rotated: false, part });
      offset += len;
    }
  });
  return pieces;
};

/**
 * @description 전개도를 H1 조각과 H나머지 조각 2개로 나눠 재단하는 배치를 찾습니다.
 * 원장을 세로 띠(정방향)와 가로 띠(90° 회전) 영역으로 한 번 나누는 모든 경우를 비교합니다.
 */
const findSplitLayout = (sheetW: number, sheetH: number, pieceW: number, pieceH: number, h1: number) => {
  const rest = pieceH - h1;
  if (h1 <= 0 || rest <= 0) return null;
  const maxSets = Math.floor((sheetW * sheetH) / (pieceW * pieceH));
  const cols = Math.floor(sheetW / pieceW);
  const rows = Math.floor(sheetH / pieceW);
  let best: PlacedPiece[] | null = null;

  const tryStrips = (strips: Strip[]) => {
    const pieces = packSplitStrips(strips, pieceW, h1, rest, maxSets);
    if (pieces && (!best || pieces.length > best.length)) best = pieces;
  };

  // 왼쪽 i줄은 세로 띠, 오른쪽 남는 폭은 가로 띠
  for (let i = 0; i <= cols; i++) {
    const strips: Strip[] = [];
    for (let c = 0; c < i; c++) strips.push({ x: c * pieceW, y: 0, length: sheetH, horizontal: false });
    if (sheetW - i * pieceW > 0) {
      for (let r = 0; r < rows; r++) strips.push({ x: i * pieceW, y: r * pieceW, length: sheetW - i * pieceW, horizontal: true });
    }
    tryStrips(strips);
  }
  // 위쪽 j줄은 가로 띠, 아래 남는 높이는 세로 띠
  for (let j = 1; j < rows; j++) {
    const strips: Strip[] = [];
    for (let r = 0; r < j; r++) strips.push({ x: 0, y: r * pieceW, length: sheetW, horizontal: true });
    for (let c = 0; c < cols; c++) strips.push({ x: c * pieceW, y: j * pieceW, length: sheetH - j * pieceW, horizontal: false });
    tryStrips(strips);
  }
  return best as PlacedPiece[] | null;
};

/**
 * @description 원장(sheetW x sheetH)에서 전개도(pieceW x pieceH)를 최대한 많이 뽑는 배치를 찾습니다.
 * 정방향 / 90° 회전 / 두 방향을 한 번의 직선 재단으로 나눠 섞는 혼합 배치를 비교합니다.
 * h1을 주면 전개도를 (가로 x H1)과 (가로 x H나머지) 2개로 나눠 재단하는 배치도 비교하고,
 * 통째로 재단할 때보다 박스가 더 많이 나올 때만 추천합니다.
 */
export const findLayouts = (sheetW: number, sheetH: number, pieceW: number, pieceH: number, h1?: number) => {
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
  let best = candidates.reduce((a, b) => (b.count > a.count ? b : a));

  if (h1 !== undefined) {
    const splitPieces = findSplitLayout(sheetW, sheetH, pieceW, pieceH, h1);
    // 박스 1개 = H1 조각 1개 + H나머지 조각 1개
    if (splitPieces && splitPieces.length / 2 > best.count) {
      const split = makeLayout('2분할', splitPieces, sheetW, sheetH);
      split.count = splitPieces.length / 2;
      candidates.push(split);
      best = split;
    }
  }
  return { candidates, best };
};
