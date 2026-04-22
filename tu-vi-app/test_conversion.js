import { solarToLunar } from './src/utils/lunarCalendar.js';

const res = solarToLunar(12, 4, 2000);
console.log('Result for 12/4/2000 DL:', JSON.stringify(res));

const res2 = solarToLunar(11, 4, 2000);
console.log('Result for 11/4/2000 DL:', JSON.stringify(res2));
