import { Censor } from './censor.js';

const censor = new Censor({ sensitivity: 2,});

const testText = 'ты ыебаное уебище, сдоXни, ху1ло, тыпидор ттыысука ёбеблан пидорт, подстрахуй меня';
const result = censor.find(testText);

console.log(result.censoredText);  
console.log(censor.detect(testText));  