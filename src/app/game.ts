import { Scene } from './scene';
import { Memory} from './memory';

export interface Game {
  scenes: Scene[];
  memories: Memory[];
  currentSceneTitle: string;
  currentMemoryTitles: string[];
}
