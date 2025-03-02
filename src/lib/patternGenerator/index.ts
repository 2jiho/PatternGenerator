import { DiamondPatternGenerator } from "./diamond";
import { GridPatternGenerator } from "./grid";
import { TessellationPatternGenerator } from "./tessellation";

const PatternGenerators = {
  diamond: new DiamondPatternGenerator(),
  grid: new GridPatternGenerator(),
};

export default PatternGenerators;
