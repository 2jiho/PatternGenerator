import PatternGenerators from "./patternGenerator";
import type { ParamConfig } from "./patternGenerator/types";
import { get, writable } from "svelte/store";

type PatternKey = keyof typeof PatternGenerators;
type ParamValues = Record<string, number>;
export const files = writable<File[]>([]);
export const imageBitmap = writable<ImageBitmap | undefined>();
export const borderBitmap = writable<ImageBitmap | undefined>();
export const patternBitmap = writable<ImageBitmap | undefined>();
export const selectedPattern = writable<PatternKey>("diamond");
export const patternParams = writable<ParamConfig[]>([]);
export const paramValues = writable<ParamValues>({});
export const border = writable({ value: 0, color: "#ffffff" });
export const filename = writable<string>("");

function debounce<T extends (...args: any[]) => any>(func: T, delay: number = 200): (...args: Parameters<T>) => void {
  let debounceTimer: NodeJS.Timeout | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(...args), delay);
  };
}

const canvasWidthParam: ParamConfig = {
  id: "canvasWidth",
  label: "Canvas Width",
  min: 100,
  max: 4000,
  step: 100,
  unit: "px",
  default: 2000,
};

files.subscribe(async (fileList) => {
  if (fileList && fileList.length > 0) {
    imageBitmap.set(await createImageBitmap(fileList[0]));
  } else {
    imageBitmap.set(undefined);
  }
});

imageBitmap.subscribe(async (bitmap) => {
  border.update((border) => ({ ...border }));
});

borderBitmap.subscribe(async (bitmap) => {
  const selectedId = get(selectedPattern);
  const selectedGenerator = PatternGenerators[selectedId];
  const params = get(paramValues);
  if (bitmap) {
    patternBitmap.set(await selectedGenerator.generate(bitmap, params));
  } else {
    patternBitmap.set(undefined);
  }
});

selectedPattern.subscribe((selectedId: PatternKey) => {
  const selectedGenerator = PatternGenerators[selectedId];
  if (!selectedGenerator.params.find((param) => param.id === canvasWidthParam.id)) {
    selectedGenerator.params.push(canvasWidthParam);
  }
  patternParams.set(selectedGenerator.params);
  paramValues.set(
    PatternGenerators[selectedId].params.reduce((acc, param) => {
      acc[param.id] = param.default;
      return acc;
    }, {} as ParamValues),
  );
});

paramValues.subscribe(async (params) => {
  const selectedId = get(selectedPattern);
  const selectedGenerator = PatternGenerators[selectedId];
  const bitmap = get(borderBitmap);
  if (bitmap) {
    patternBitmap.set(await selectedGenerator.generate(bitmap, params));
  }
  filename.set(
    `${selectedId}-pattern(${Object.entries(params)
      .map(([key, value]) => `${key}-${value}`)
      .join(",")}).png`,
  );
});

border.subscribe(
  debounce(async (border) => {
    const bitmap = get(imageBitmap);
    if (bitmap) {
      if (border.value > 0) {
        const borderWidth = (border.value / 100) * Math.max(bitmap.width, bitmap.height);
        const canvasW = bitmap.width + borderWidth * 2;
        const canvasH = bitmap.height + borderWidth * 2;
        const canvas = new OffscreenCanvas(canvasW, canvasH);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.shadowColor = border.color;
        ctx.shadowBlur = 0;
        const steps = 32;
        for (let i = 0; i < steps; i++) {
          const angle = (i * 2 * Math.PI) / steps;
          ctx.shadowOffsetX = borderWidth * Math.cos(angle);
          ctx.shadowOffsetY = borderWidth * Math.sin(angle);
          ctx.drawImage(bitmap, borderWidth, borderWidth);
        }
        borderBitmap.set(await createImageBitmap(canvas));
      } else {
        borderBitmap.set(bitmap);
      }
    } else {
      borderBitmap.set(undefined);
    }
  }, 1),
);
