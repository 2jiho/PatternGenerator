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

    // 이미지 스케일 및 간격 계산 (반복문 외부에서 미리 계산)
    const scaleRatio = canvasWidth / (col * imgWidth);
    const imageScaledWidth = (imgWidth / (distance + 1)) * scaleRatio;
    const imageScaledHeight = (imgHeight / (distance + 1)) * scaleRatio;
    const diamondColumnSpacing = imageScaledWidth * (distance + 1);
    const diamondRowSpacing = imageScaledHeight * (distance + 1);

    // 시작 위치 계산
    const evenRowStartX = -imageScaledWidth / 2 + diamondColumnSpacing / 2;
    const oddRowStartX = -imageScaledWidth / 2;

    // 미리 계산한 값들
    const halfImageHeight = imageScaledHeight / 2;
    const halfRowSpacing = diamondRowSpacing / 2;

    // 총 행 계산
    const totalRows = row * 2 + 1;
    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      const isEvenRow = rowIndex % 2 === 0;
      const rowStartX = isEvenRow ? evenRowStartX : oddRowStartX;

      // Y 위치 계산 - 반복마다 재계산 방지
      const imageY = rowIndex * halfRowSpacing - halfImageHeight;

      // 캔버스 범위 검사: Y 위치에 따라 전체 행을 건너뛸 수 있음
      if (imageY + imageScaledHeight < 0 || imageY > canvasHeight) continue;

      // 각 열에 대해 이미지 그리기
      for (let colIndex = 0; colIndex <= (isEvenRow ? col - 1 : col); colIndex++) {
        const imageX = rowStartX + colIndex * diamondColumnSpacing;

        // X 위치가 캔버스 범위 내에 있는지 확인
        if (imageX + imageScaledWidth < 0 || imageX > canvasWidth) continue;

        ctx.drawImage(source, imageX, imageY, imageScaledWidth, imageScaledHeight);
      }
    }
    return createImageBitmap(offscreenCanvas);
  }
}
