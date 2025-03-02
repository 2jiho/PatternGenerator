import { DiamondPatternGenerator } from "./diamond";
import { GridPatternGenerator } from "./grid";
import { TessellationPatternGenerator } from "./tessellation";

const PatternGenerators = {
  diamond: new DiamondPatternGenerator(),
  grid: new GridPatternGenerator(),
  tessellation: new TessellationPatternGenerator(),
};

export default PatternGenerators;
