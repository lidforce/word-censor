interface CensorOptionsWithoutSensitivity {
  language?: string;
  wordList?: string[];
  symbol?: string;
  rigidMode?: false;
}

interface CensorOptionsWithSensitivity {
  language?: string;
  wordList?: string[];
  symbol?: string;
  rigidMode: true;
  sensitivity?: number;
}

export type CensorOptions = CensorOptionsWithoutSensitivity | CensorOptionsWithSensitivity;


export interface DetectionResult {
  hasProfanity: boolean;
  censoredText: string;
}