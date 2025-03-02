export interface ParamConfig {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  default: number;
}

export abstract class PatternGenerator {
  readonly params: ParamConfig[];

  constructor(params: ParamConfig[]) {
    this.params = params;
  }

  abstract generate(image: ImageBitmap, paramValues: {}): Promise<ImageBitmap>;
}
