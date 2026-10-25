
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
}

export interface CuttingLayout {
  label: string;
  pieces: PlacedPiece[];
  count: number;
  usage: number;
}
