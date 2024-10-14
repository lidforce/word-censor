// Определяем опции для rigidMode = false (без чувствительности)
interface CensorOptionsWithoutSensitivity {
  language?: string;
  wordList?: string[];
  symbol?: string;
  rigidMode?: false;
}

// Определяем опции для rigidMode = true (с поддержкой чувствительности)
interface CensorOptionsWithSensitivity {
  language?: string;
  wordList?: string[];
  symbol?: string;
  rigidMode: true;
  sensitivity?: number;
}

// Унифицированный тип CensorOptions, который будет либо с rigidMode = false, либо с rigidMode = true
export type CensorOptions = CensorOptionsWithoutSensitivity | CensorOptionsWithSensitivity;


export interface DetectionResult {
  hasProfanity: boolean;
  censoredText: string;
}