import { CensorOptions, DetectionResult } from './types.js';
import { ruWordList } from './lang/ru.js';

export class Censor {
  private language: string;
  private wordList: string[];
  private sensitivity?: number;
  private symbol: string;
  private rigidMode: boolean;

  constructor(options: CensorOptions) {
    this.language = options.language || 'ru';
    this.wordList = options.wordList || ruWordList;
    this.symbol = options.symbol || '*';
    this.rigidMode = options.rigidMode ?? false;

    if (this.rigidMode && 'sensitivity' in options) {
      this.sensitivity = options.sensitivity;
    } else {
      this.sensitivity = 0;
    }
  }

  public setOptions(options: CensorOptions): void {
    if (options.language) this.language = options.language;
    if (options.wordList) this.wordList = options.wordList;

    if (options.rigidMode !== undefined) {
      this.rigidMode = options.rigidMode;
    }

    if (this.rigidMode && 'sensitivity' in options) {
      this.sensitivity = options.sensitivity;
    } else {
      this.sensitivity = 0;
    }
  }

  private normalizeText(text: string): string {
    return text
      .replace(/[Aa@4/\-\\]/g, 'а')
      .replace(/[Bb6]/g, 'б')
      .replace(/[VvWwB8]/g, 'в')
      .replace(/[Gg]/g, 'г')
      .replace(/[Dd]/g, 'д')
      .replace(/[Ee3]/g, 'е')
      .replace(/[\*\}\{><]/g, 'ж')
      .replace(/[Zz3]/g, 'з')
      .replace(/[Ii!1]/g, 'и')
      .replace(/[Y]/g, 'й')
      .replace(/[Kk|{]/g, 'к')
      .replace(/[/\|\\_]/g, 'л')
      .replace(/[Mm]/g, 'м')
      .replace(/[Hh]/g, 'н')
      .replace(/[Oo0]/g, 'о')
      .replace(/[Pp|>]/g, 'р')
      .replace(/[Cc$5]/g, 'с')
      .replace(/[Tt7]/g, 'т')
      .replace(/[UuYy]/g, 'у')
      .replace(/[Oo\|]/g, 'ф')
      .replace(/[Xx><}{]/g, 'х')
      .replace(/[Uu|_]/g, 'ц')
      .replace(/[4|]/g, 'ч')
      .replace(/[WwшШ]/g, 'ш')
      .replace(/[\|}\[\]]/g, 'ъ')
      .replace(/[\|]b/g, 'ы')
      .replace(/[\[b]/g, 'ь')
      .replace(/[3Э]/g, 'э')
      .replace(/[lLoO]/g, 'ю')
      .replace(/[Rr9]/g, 'я')
      .replace(/[@]/g, 'a')
      .replace(/[$]/g, 's')
      .replace(/[#]/g, 'h')
      .replace(/[%]/g, 'p')
      .replace(/[!]/g, 'i')
      .replace(/[0]/g, 'o');
  }

  // Метод проверки совпадений по словам
  private checkWordMatch(word: string, textWord: string): boolean {
    if (this.rigidMode) {
      // В rigidMode проверяем совпадение символов с учётом чувствительности
      const normalizedWord = word.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Нормализуем для корректного сравнения
      const maskedWord = textWord.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      return this.compareWordsWithSensitivity(normalizedWord, maskedWord);
    } else {
      // Если rigidMode выключен, проверяем полное совпадение слова
      return word === textWord;
    }
  }

  // Функция сравнения слов с учётом чувствительности
  private compareWordsWithSensitivity(word: string, maskedWord: string): boolean {
    const sensitivity = this.sensitivity ?? 0; // Устанавливаем значение по умолчанию для чувствительности
  
    let mismatchCount = 0;
  
    for (let i = 0; i < word.length; i++) {
      if (word[i] !== maskedWord[i]) {
        mismatchCount++;
        if (mismatchCount > sensitivity) {
          return false;
        }
      }
    }
  
    return true;
  }
  

  public find(text: string): DetectionResult {
    const normalizedText = this.normalizeText(text);
    let censoredText = normalizedText;

    const words = normalizedText.split(/\s+/); // Разделяем текст на слова по пробелам

    const censoredWords = words.map((textWord) => {
      const wordFound = this.wordList.some((badWord) => this.checkWordMatch(badWord, textWord));
      return wordFound ? this.symbol.repeat(textWord.length) : textWord;
    });

    censoredText = censoredWords.join(' ');

    return {
      hasProfanity: censoredText !== normalizedText,
      censoredText: censoredText,
    };
  }

  public detect(text: string): boolean {
    const result = this.find(text);
    return result.hasProfanity;
  }
}
