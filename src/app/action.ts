export type Action = Recall | Exercise;

interface Recall {
  description: string;
  memoryTopic: string;
}

interface Exercise {
  description: string;
  resultSceneId: string;
}
