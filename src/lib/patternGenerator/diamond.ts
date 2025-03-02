import { PatternGenerator } from "$lib/patternGenerator";

export class DiamondPatternGenerator extends PatternGenerator {
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

    // 이미지 스케일 및 오프셋 계산 (반복문 외부에서 미리 계산)
    const scaleRatio = canvasWidth / (col * imgWidth);
    const scaledWidth = (imgWidth / (distance + 1)) * scaleRatio;
    const scaledHeight = (imgHeight / (distance + 1)) * scaleRatio;
    const offsetX = scaledWidth * (distance + 1);
    const offsetY = scaledHeight * (distance + 1);
    const startEvenX = -scaledWidth / 2 + offsetX / 2;
    const startOddX = -scaledWidth / 2;

    // 미리 계산한 값들
    const halfScaledHeight = scaledHeight / 2;
    const halfOffsetY = offsetY / 2;

    // totalRows 대신 실제로 캔버스에 그릴 가능성이 있는 행 범위를 계산할 수도 있겠지만
    // 여기서는 기존 로직(totalRows)을 유지합니다.
    const totalRows = row * 2 + 1;
    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      const isEvenRow = rowIndex % 2 === 0;
      const startX = isEvenRow ? startEvenX : startOddX;
      // yPosition: 반복마다 halfOffsetY와 halfScaledHeight를 사용하여 계산 부담 줄임
      const yPosition = rowIndex * halfOffsetY - halfScaledHeight;

      // 캔버스 범위 검사: yPosition 값에 따라 전체 행을 건너뛸 수 있음
      if (yPosition + scaledHeight < 0 || yPosition > canvasHeight) continue;
      for (let colIndex = 0; colIndex <= (isEvenRow ? col - 1 : col); colIndex++) {
        const xPosition = startX + colIndex * offsetX;
        if (xPosition + scaledWidth < 0 || xPosition > canvasWidth) continue;
        ctx.drawImage(source, xPosition, yPosition, scaledWidth, scaledHeight);
      }
    }
    return createImageBitmap(offscreenCanvas);
  }
}
