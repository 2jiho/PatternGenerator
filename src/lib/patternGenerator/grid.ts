import { PatternGenerator } from "$lib/patternGenerator/types";

export class GridPatternGenerator extends PatternGenerator {
  constructor() {
    super([
      { id: "gap", label: "Gap", min: -0.5, max: 3, step: 0.1, unit: "x", default: 0 },
      { id: "cols", label: "Columns", min: 1, max: 20, step: 1, unit: "ea", default: 3 },
      { id: "rows", label: "Rows", min: 1, max: 20, step: 1, unit: "ea", default: 3 },
    ]);
  }

  async generate(source: ImageBitmap, paramValues: {}): Promise<ImageBitmap> {
    // 파라미터 추출 및 타입 지정
    const {
      gap,
      cols,
      rows,
      canvasWidth: canvasW,
    } = paramValues as {
      gap: number;
      cols: number;
      rows: number;
      canvasWidth: number;
    };

    // 소스 이미지 크기 추출
    const { width: imgW, height: imgH } = source;

    // 캔버스 설정 계산
    const aspect = imgH / imgW;
    const canvasH = Math.ceil((aspect * canvasW * rows) / cols);

    // 캔버스 생성
    const canvas = new OffscreenCanvas(canvasW, canvasH);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");

    // 비율 및 크기 계산
    const baseScale = canvasW / (cols * imgW);
    const sizeScale = 1 / (gap + 1);
    const combinedScale = baseScale * sizeScale;

    // 타일 크기 계산
    const tileW = imgW * combinedScale;
    const tileH = imgH * combinedScale;
    const tileW2 = tileW / 2;
    const tileH2 = tileH / 2;

    // 그리드 패턴 간격 계산
    const gridW = imgW * baseScale;
    const gridH = imgH * baseScale;
    const gridW2 = gridW / 2;
    const gridH2 = gridH / 2;

    // 시작 위치 계산
    const startX = gridW2 - tileW2;
    const startY = gridH2 - tileH2;

    // 뷰포트 최적화 (옵션)
    const startRow = 0;
    const endRow = rows;
    const startCol = 0;
    const endCol = cols;

    // 드로잉 묶기
    ctx.save();

    // 각 행과 열에 타일 배치
    for (let ri = startRow; ri < endRow; ri++) {
      const y = ri * gridH + startY;
      const drawY = Math.round(y);

      for (let ci = startCol; ci < endCol; ci++) {
        const x = ci * gridW + startX;
        const drawX = Math.round(x);

        ctx.drawImage(source, drawX, drawY, tileW, tileH);
      }
    }

    ctx.restore();

    return createImageBitmap(canvas);
  }
}
