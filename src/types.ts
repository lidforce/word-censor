export interface CensorOptions {
  language: string;
  wordList: string[];
  sensitivity: number; // Чувствительность, количество допустимых символов между буквами мата
  symbol: string;
}

export interface DetectionResult {
  hasProfanity: boolean;
  censoredText: string;
}