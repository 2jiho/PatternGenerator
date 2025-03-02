import { PatternGenerator } from "$lib/patternGenerator";

export class DiamondPatternGenerator extends PatternGenerator {
  constructor() {
    super([
      { id: "gap", label: "Gap", min: -0.5, max: 3, step: 0.1, unit: "x", default: 1 },
      { id: "cols", label: "Columns", min: 1, max: 20, step: 1, unit: "ea", default: 3 },
      { id: "rows", label: "Rows", min: 1, max: 20, step: 1, unit: "ea", default: 2 },
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

    // 캔버스 설정 계산 - 최적화 1: 정수 캔버스 사이즈 사용
    const aspect = imgH / imgW;
    const canvasH = Math.ceil((aspect * canvasW * rows) / cols);

    // 캔버스 생성
    const canvas = new OffscreenCanvas(canvasW, canvasH);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");

    // 비율 및 크기 계산 - 한번에 계산하여 중복 연산 제거
    const baseScale = canvasW / (cols * imgW);
    const sizeScale = 1 / (gap + 1);
    const combinedScale = baseScale * sizeScale; // 최적화 4: 여러 계산을 한번으로 통합

    // 타일 크기 계산
    const tileW = imgW * combinedScale;
    const tileH = imgH * combinedScale;
    const tileH2 = tileH / 2;
    const tileW2 = tileW / 2;

    // 다이아몬드 패턴 간격 계산
    const gridW = imgW * baseScale;
    const gridH = imgH * baseScale;
    const gridW2 = gridW / 2;
    const gridH2 = gridH / 2;

    // 행 시작 위치 계산 - 최적화 5: 상수값 사전 계산
    const evenX = gridW2 - tileW2;
    const oddX = -tileW2;

    // 최적화 6: 뷰포트 계산으로 필요한 행과 열만 계산
    const startRow = Math.max(0, Math.floor(-tileH2 / gridH2));
    const endRow = Math.min(rows * 2 + 1, Math.ceil((canvasH + tileH) / gridH2));

    // 최적화 7: 드로잉 한번에 묶기
    ctx.save();

    // 각 행에 타일 배치 - 최적화된 범위
    for (let ri = startRow; ri < endRow; ri++) {
      const isEven = ri % 2 === 0;
      const startX = isEven ? evenX : oddX;
      const y = ri * gridH2 - tileH2;

      // 최적화 8: 행 단위로 미리 열 계산
      const tilesInRow = isEven ? cols - 1 : cols;

      // 최적화 9: 화면에 표시되는 열 범위 계산
      const startCol = Math.max(0, Math.floor((-startX - tileW) / gridW));
      const endCol = Math.min(tilesInRow, Math.ceil((canvasW - startX) / gridW));

      for (let ci = startCol; ci <= endCol; ci++) {
        const x = startX + ci * gridW;

        // 최적화 10: 브라우저 렌더링 단위에 맞춰 정수로 반올림
        const drawX = Math.round(x);
        const drawY = Math.round(y);

        ctx.drawImage(source, drawX, drawY, tileW, tileH);
      }
    }

    ctx.restore();

    // 최적화 11: 가능하면 객체 재사용
    return createImageBitmap(canvas);
  }
}
