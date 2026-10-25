
export interface BoxDimensions {
  thickness: number;
  width: number;
  height: number;
}

export interface CalculatedDimensions {
  tPrime: number;
  wPrime: number;
  hPrime: number;
  totalX: number;
  totalY: number;
}

export interface SheetDimensions {
  thickness: number;
  width: number;
  height: number;
}

export interface PlacedPiece {
  x: number;
  y: number;
  w: number;
  h: number;
  rotated: boolean;
  // 2분할 재단일 때의 조각 종류 (H1 조각 / H나머지 조각)
  part?: 'H1' | 'rest';
}

export interface CuttingLayout {
  label: string;
  pieces: PlacedPiece[];
  count: number;
  usage: number;
}
