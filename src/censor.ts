import { CensorOptions, DetectionResult } from './types.js';
import { ruWordList } from './lang/ru.js';

export class Censor {
  private language: string;
  private wordList: string[];
  private sensitivity: number;
  private symbol: string;

  constructor(options: Partial<CensorOptions> = {}) {
    this.language = options.language || 'ru';
    this.wordList = options.wordList || ruWordList;
    this.sensitivity = options.sensitivity || 0; // Чувствительность по умолчанию 0
    this.symbol = options.symbol || '*';
  }

  // Установка языка, списка слов и чувствительности
  public setOptions(options: Partial<CensorOptions>): void {
    if (options.language) this.language = options.language;
    if (options.wordList) this.wordList = options.wordList;
    if (options.sensitivity !== undefined) this.sensitivity = options.sensitivity;
  }

  private normalizeText(text: string): string {
    return text
      .replace(/[Aa@4/\-\\]/g, 'а')
      .replace(/[Bb6]/g, 'б')
      .replace(/[VvB8]/g, 'в')
      .replace(/[Gg]/g, 'г')
      .replace(/[Dd]/g, 'д')
      .replace(/[Ee3]/g, 'е')
      .replace(/[Ee3]/g, 'ё')
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

  private createRegexForWord(word: string): RegExp {
    // Определим символы маскировки, которые могут быть использованы между буквами
    const maskSymbols = `[\\*@$#!%&0-9]`; 
  
    // Чувствительность: сколько символов маскировки может быть между буквами
    const pattern = word
      .split('')
      .map((char) => `${char}${maskSymbols}{0,${this.sensitivity}}`)
      .join('');
  
    // Создаем регулярное выражение с учетом чувствительности
    const regex = new RegExp(pattern, 'gi');
    return regex;
  }

  public find(text: string): DetectionResult {
    const normalizedText = this.normalizeText(text);
    let censoredText = normalizedText;

    this.wordList.forEach((word) => {
      const regex = this.createRegexForWord(word);

      // Важно: Заменяем только найденные матные слова, без захвата лишних частей текста
      censoredText = censoredText.replace(regex, (match) => this.symbol.repeat(match.length));
    });

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
