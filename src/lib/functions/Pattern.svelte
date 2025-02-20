<script module lang="ts">
  export async function generatePattern(image: HTMLImageElement, distance: number, col: number, row: number, canvasWidth: number): Promise<HTMLCanvasElement> {
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
    const imageBitmap = await createImageBitmap(image);
    for (let rowIndex = 0; rowIndex < row * 2 + 1; rowIndex++) {
      const isEvenRow = rowIndex % 2 === 0;
      const startX = isEvenRow ? startPoints.even.x : startPoints.odd.x;
      const yPosition = (rowIndex * offset.y) / 2 - scaledSize.height / 2;

      for (let colIndex = 0; colIndex <= col; colIndex++) {
        const xPosition = startX + colIndex * offset.x;
        ctx.drawImage(imageBitmap, xPosition, yPosition, scaledSize.width, scaledSize.height);
      }
    }

    return canvas;
  }
</script>
