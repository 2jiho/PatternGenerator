import { render, fireEvent, cleanup } from "@testing-library/svelte";
import { expect, test, afterEach, describe, vi, beforeEach } from "vitest";
import ImageSelector from "./ImageSelector.svelte";

// $bindable 모킹을 파일 상단에 배치
let capturedImageBitmap: ImageBitmap | undefined;

vi.mock("svelte", async () => {
  const actual = await vi.importActual("svelte");
  return {
    ...actual,
    $bindable: () => ({
      get: () => undefined,
      set: (value: any) => {
        capturedImageBitmap = value;
      },
    }),
  };
});

describe("ImageSelector 컴포넌트 테스트", () => {
  // 파일 객체 모킹을 위한 설정
  let file: File;
  let createImageBitmapMock: any;
  let imageBitmapMock: ImageBitmap;

  // 각 테스트 전 준비
  beforeEach(() => {
    // 모든 모킹을 리셋
    vi.resetAllMocks();
    capturedImageBitmap = undefined;

    // 파일 객체 생성 (1x1 투명 PNG)
    const base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const binary = atob(base64);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], { type: "image/png" });
    file = new File([blob], "test.png", { type: "image/png" });

    // ImageBitmap 모킹
    imageBitmapMock = {
      width: 100,
      height: 100,
      close: vi.fn(),
    } as unknown as ImageBitmap;

    // createImageBitmap 함수 모킹
    createImageBitmapMock = vi.fn().mockResolvedValue(imageBitmapMock);
    global.createImageBitmap = createImageBitmapMock;

    // Canvas 관련 모킹 - 여기서 중요한 부분
    // 드로잉 컨텍스트를 모킹
    const mockDrawImage = vi.fn();
    const mockContext = {
      drawImage: mockDrawImage,
      // 기타 필요한 속성
    } as unknown as CanvasRenderingContext2D;

    // getContext 메서드 모킹 - 항상 유효한 컨텍스트를 반환하도록
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockContext);
  });

  // 각 테스트 후 정리
  afterEach(() => {
    cleanup();
  });

  test("ImageSelector가 올바르게 렌더링되는지 확인", () => {
    const { container } = render(ImageSelector);

    // 레이블과 입력 요소가 존재하는지 확인
    const label = container.querySelector("label");
    const input = container.querySelector('input[type="file"]');
    expect(label).not.toBeNull();
    expect(input).not.toBeNull();

    // 파일이 없을 때는 안내 텍스트와 아이콘이 표시되는지 확인
    const svgIcon = container.querySelector("svg");
    const guidanceText = container.querySelector("p");
    expect(svgIcon).not.toBeNull();
    expect(guidanceText).not.toBeNull();
    expect(guidanceText?.textContent).toBe("Click to select image files");

    // 캔버스 요소가 아직 없는지 확인
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeNull();
  });

  test("파일 선택 시 ImageBitmap이 생성되는지 확인", async () => {
    // 컴포넌트를 렌더링하기 전에 이미 모든 모킹이 설정되어 있어야 함
    const { container } = render(ImageSelector);

    // 파일 입력 요소 선택
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).not.toBeNull();

    // FileList 모킹
    const mockFileList = {
      0: file,
      length: 1,
      item: (idx: number) => (idx === 0 ? file : null),
    } as unknown as FileList;

    // input.files 설정
    Object.defineProperty(input, "files", {
      value: mockFileList,
      writable: true,
    });

    // 변경 이벤트를 발생시키기 전에 Canvas 요소가 DOM에 추가되었는지 확인
    // 컴포넌트에 imageCanvas가 바인딩되기 전에 이벤트가 발생하면 문제 발생
    document.body.appendChild(document.createElement("canvas"));

    // 변경 이벤트 발생
    await fireEvent.change(input);

    // 짧은 지연 추가 - 비동기 작업이 완료될 시간 제공
    await new Promise((resolve) => setTimeout(resolve, 10));

    // createImageBitmap이 호출되었는지 확인
    expect(createImageBitmapMock).toHaveBeenCalledWith(file);
  });

  test("접근성 기능 테스트", () => {
    const { container } = render(ImageSelector);

    // 레이블과 input이 연결되어 있는지 확인
    const label = container.querySelector("label");
    const input = container.querySelector('input[type="file"]');

    // ID가 연결되어 있는지 확인
    const inputId = input?.id;
    expect(label?.getAttribute("for")).toBe(inputId);

    // 스크린 리더를 위한 안내 텍스트
    const guidanceText = container.querySelector("p");
    expect(guidanceText).not.toBeNull();
    expect(guidanceText?.textContent?.length).toBeGreaterThan(0);

    // 입력이 숨겨져 있는지 확인
    expect(input?.classList.contains("hidden")).toBeTruthy();
  });
});
