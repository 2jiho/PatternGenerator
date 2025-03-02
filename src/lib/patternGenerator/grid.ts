import { PatternGenerator } from "$lib/patternGenerator";

export class GridPatternGenerator extends PatternGenerator {
  constructor() {
    super([
      { id: "distance", label: "Distance", min: -0.5, max: 3, step: 0.1, unit: "x", default: 1 },
      { id: "col", label: "Column", min: 1, max: 20, step: 1, unit: "ea", default: 3 },
      { id: "row", label: "Row", min: 1, max: 20, step: 1, unit: "ea", default: 2 },
    ]);
  }
  async generate(source: ImageBitmap, paramValues: {}): Promise<ImageBitmap> {
    const { distance, col, row, canvasWidth } = paramValues as {
      distance: number;
      col: number;
      row: number;
      canvasWidth: number;
    };
    // 이미지 크기 및 캔버스 설정
    const { width: imgWidth, height: imgHeight } = source;
    const canvasHeight = ((imgHeight / imgWidth) * canvasWidth * row) / col;

    const offscreenCanvas = new OffscreenCanvas(canvasWidth, canvasHeight);
    const ctx = offscreenCanvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");

    // 이미지 스케일 및 간격 계산 (반복문 외부에서 미리 계산)
    const scaleRatio = canvasWidth / (col * imgWidth);
    const imageScaledWidth = (imgWidth / (distance + 1)) * scaleRatio;
    const imageScaledHeight = (imgHeight / (distance + 1)) * scaleRatio;
    const gridColumnSpacing = imageScaledWidth * (distance + 1);
    const gridRowSpacing = imageScaledHeight * (distance + 1);

    // 중심점 및 오프셋 계산
    const halfImageHeight = imageScaledHeight / 2;
    const halfImageWidth = imageScaledWidth / 2;
    const gridRowOffset = gridRowSpacing / 2;
    const gridColumnOffset = gridColumnSpacing / 2;
    const rowPositionOffset = gridRowOffset - halfImageHeight;
    const colPositionOffset = gridColumnOffset - halfImageWidth;

    for (let rowIndex = 0; rowIndex < row; rowIndex++) {
      // 각 행의 yPosition을 계산
      const yPosition = rowIndex * gridRowSpacing + rowPositionOffset;
      for (let colIndex = 0; colIndex < col; colIndex++) {
        const xPosition = colIndex * gridColumnSpacing + colPositionOffset;
        ctx.drawImage(source, xPosition, yPosition, imageScaledWidth, imageScaledHeight);
      }
    }

    return createImageBitmap(offscreenCanvas);
  }
}
