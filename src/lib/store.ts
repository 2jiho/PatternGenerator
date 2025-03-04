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
export const filename = writable<string>("");

const cache: Record<string, ImageBitmap> = {};

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
  const selectedId = get(selectedPattern);
  const selectedGenerator = PatternGenerators[selectedId];
  const params = get(paramValues);
  if (bitmap) {
    patternBitmap.set(await selectedGenerator.generate(bitmap, params));
  }
});

borderBitmap.subscribe((bitmap) => {});

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
  const bitmap = get(imageBitmap);
  if (bitmap) {
    patternBitmap.set(await selectedGenerator.generate(bitmap, params));
  }
  const oldFilename = get(filename);
  const newFilename = `${selectedId}-pattern(${Object.entries(params)
    .map(([key, value]) => `${key}-${value}`)
    .join(",")}).png`;
  filename.set(newFilename);
  console.log(get(filename));
});
