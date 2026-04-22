import { lapLaSo } from './src/utils/tuviEngine.js';
import fs from 'fs';

try {
  const data = {
    gender: 'Nữ',
    day: 18,
    month: 8,
    year: 2003,
    hour: 'Ti',
    solarDay: 14,
    solarMonth: 9,
    solarYear: 2003,
    namXem: 2026,
    thangXem: 1
  };
  const result = lapLaSo(data);
  console.log("Success");
} catch(err) {
  fs.writeFileSync('error.txt', err.stack || err.toString(), 'utf8');
}
