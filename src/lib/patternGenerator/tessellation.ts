import { PatternGenerator } from "$lib/patternGenerator/types";

export class TessellationPatternGenerator extends PatternGenerator {
  constructor() {
    super([
      { id: "seed", label: "Seed", min: 0, max: 1000, step: 1, unit: "", default: 42 },
      { id: "count", label: "Elements Count", min: 1, max: 50, step: 1, unit: "ea", default: 30 },
      { id: "size", label: "Size", min: 0.1, max: 2, step: 0.01, unit: "x", default: 1 },
      { id: "cols", label: "Columns", min: 1, max: 10, step: 1, unit: "ea", default: 3 },
      { id: "rows", label: "Rows", min: 1, max: 10, step: 1, unit: "ea", default: 3 },
    ]);
  }

  // 시드 기반 난수 생성기
  private seededRandom(seed: number) {
    let state = seed;
    return () => {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    };
  }

  async generate(source: ImageBitmap, paramValues: {}): Promise<ImageBitmap> {
    // 파라미터 추출 및 타입 지정
    const {
      seed,
      count,
      size,
      cols,
      rows,
      canvasWidth: canvasW,
    } = paramValues as {
      seed: number;
      count: number;
      size: number;
      cols: number;
      rows: number;
      canvasWidth: number;
    };

    // 시드 기반 난수 생성기 초기화
    const random = this.seededRandom(seed || 42);

    // 소스 이미지 크기 추출
    const { width: imgW, height: imgH } = source;

    // 타일 하나의 크기 계산 (정사각형 타일)
    const tileSize = Math.max(imgW, imgH);

    // 먼저 테셀레이션 타일 생성 (경계가 연결되는 하나의 타일)
    const tileCanvas = new OffscreenCanvas(tileSize, tileSize);
    const tileCtx = tileCanvas.getContext("2d");
    if (!tileCtx) throw new Error("Failed to get tile canvas context");

    // 타일 경계가 연결되도록 중앙과 모서리에 그리기
    for (let i = 0; i < count; i++) {
      // 시드 기반 무작위성으로 크기와 회전 변동 계산
      const randScale = size * (0.6 + random() * 0.8); // 60%-140% 변동
      const randRot = random() * 360; // 0-360도 범위

      // 이미지 크기 계산
      const itemW = imgW * randScale;
      const itemH = imgH * randScale;

      // 랜덤 위치 (타일 영역 전체에 분포)
      const x = random() * tileSize;
      const y = random() * tileSize;

      // 더 효율적인 9영역 그리기 루프
      for (let offsetY = -1; offsetY <= 1; offsetY++) {
        for (let offsetX = -1; offsetX <= 1; offsetX++) {
          this.drawRotatedImage(tileCtx, source, x + offsetX * tileSize, y + offsetY * tileSize, itemW, itemH, randRot);
        }
      }
    }

    // 테셀레이션 타일 생성
    const tileBitmap = await createImageBitmap(tileCanvas);

    // 이제 이 테셀레이션 타일을 사용하여 전체 패턴 생성
    // 캔버스 설정 계산
    const canvasH = Math.ceil((canvasW * rows) / cols);

    // 최종 캔버스 생성 - 투명도 지원 활성화
    const canvas = new OffscreenCanvas(canvasW, canvasH);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");

    // 타일 비율 계산
    const finalScale = canvasW / (cols * tileBitmap.width);

    // 타일 크기 계산 - 정확히 그리드에 맞도록
    const tileW = tileBitmap.width * finalScale;
    const tileH = tileW; // 정사각형 유지

    // 타일 배치
    for (let ri = 0; ri < rows; ri++) {
      const y = ri * tileH;

      for (let ci = 0; ci < cols; ci++) {
        const x = ci * tileW;

        // 타일 그리기 - 정확한 위치에
        ctx.drawImage(tileBitmap, x, y, tileW, tileH);
      }
    }

    // 사용이 끝난 중간 타일 비트맵 메모리 해제
    tileBitmap.close();

    // 최종 패턴 생성
    return createImageBitmap(canvas);
  }

  // 회전된 이미지를 그리는 헬퍼 함수
  private drawRotatedImage(ctx: OffscreenCanvasRenderingContext2D, image: ImageBitmap, x: number, y: number, width: number, height: number, rotation: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
    ctx.restore();
  }
}
