<script module lang="ts">
  // 캐시 상태 관리
  let lastCache: {
    image: HTMLImageElement | HTMLCanvasElement | null;
    distance: number | null;
    col: number | null;
    row: number | null;
    canvasWidth: number | null;
    canvas: HTMLCanvasElement | null;
  } = {
    image: null,
    distance: null,
    col: null,
    row: null,
    canvasWidth: null,
    canvas: null,
  };

  function isCacheValid(image: HTMLImageElement | HTMLCanvasElement, distance: number, col: number, row: number, canvasWidth: number): boolean {
    return lastCache.image === image && lastCache.distance === distance && lastCache.col === col && lastCache.row === row && lastCache.canvasWidth === canvasWidth;
  }

  function updateCache(image: HTMLImageElement | HTMLCanvasElement, distance: number, col: number, row: number, canvasWidth: number, canvas: HTMLCanvasElement): void {
    lastCache = {
      image,
      distance,
      col,
      row,
      canvasWidth,
      canvas,
    };
  }

  export async function generatePattern(image: HTMLImageElement | HTMLCanvasElement, distance: number, col: number, row: number, canvasWidth: number): Promise<HTMLCanvasElement> {
    if (isCacheValid(image, distance, col, row, canvasWidth) && lastCache.canvas) {
      console.log("캐시된 패턴 이미지를 사용합니다.");
      return lastCache.canvas;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("캔버스 2D 컨텍스트를 생성할 수 없습니다.");
    }

    // 이미지 크기 및 캔버스 설정
    const { width: imgWidth, height: imgHeight } = image;

    // 캔버스 높이 계산
    const canvasHeight = ((imgHeight / imgWidth) * canvasWidth * row) / col;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 이미지 크기 조정
    const scaleRatio = canvasWidth / (col * imgWidth);
    const scaledSize = {
      width: (imgWidth / (distance + 1)) * scaleRatio,
      height: (imgHeight / (distance + 1)) * scaleRatio,
    };

    // 오프셋 계산
    const offset = {
      x: scaledSize.width * (distance + 1),
      y: scaledSize.height * (distance + 1),
    };

    // 그리기 설정
    const startPoints = {
      even: { x: -scaledSize.width / 2 + offset.x / 2 },
      odd: { x: -scaledSize.width / 2 },
    };

    // 패턴 그리기
    for (let rowIndex = 0; rowIndex < row * 2 + 1; rowIndex++) {
      const isEvenRow = rowIndex % 2 === 0;
      const startX = isEvenRow ? startPoints.even.x : startPoints.odd.x;
      const yPosition = (rowIndex * offset.y) / 2 - scaledSize.height / 2;

      for (let colIndex = 0; colIndex <= col; colIndex++) {
        const xPosition = startX + colIndex * offset.x;
        ctx.drawImage(image, xPosition, yPosition, scaledSize.width, scaledSize.height);
      }
    }

    updateCache(image, distance, col, row, canvasWidth, canvas);
    return canvas;
  }
</script>
