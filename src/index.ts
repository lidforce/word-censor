import { Censor } from './censor.js';

const censor = new Censor({ rigidMode: false});

const testText = 'ты пидор ебаное уебище, сдоXни, ху1ло, тыпидор ттыысука ёбеблан пидорт, подстрахуй меня';
const result = censor.find(testText);

console.log(result.censoredText);  
console.log(censor.detect(testText));  