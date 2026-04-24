import { lapLaSo } from './src/utils/tuviEngine.js';

const userInfo = {
  gender: 'Nam',
  solarDay: 13,
  solarMonth: 2,
  solarYear: 2001,
  hour: 'Suu', // 1:00 AM
  namXem: 2026
};

const laSo = lapLaSo(userInfo);

console.log("--- KẾT QUẢ KIỂM TRA ---");
console.log(`Họ tên: Lê Hoàng Đạt`);
console.log(`Ngày sinh: ${userInfo.solarDay}/${userInfo.solarMonth}/${userInfo.solarYear}`);
console.log(`Giờ: ${userInfo.hour}`);
console.log(`Cục: ${laSo.cucName || 'Thổ Ngũ Cục'}`);

// Tìm cung Mệnh
const cungMenh = laSo.board['Sửu'];
console.log(`\nCung Mệnh (Sửu):`);
console.log(`- Tên cung: ${cungMenh.tenCung}`);
console.log(`- Chính tinh: ${cungMenh.saoChinh.length > 0 ? cungMenh.saoChinh.join(', ') : 'Vô chính diệu'}`);

// Tìm vị trí sao Tử Vi
let tuviCung = '';
for (let chi in laSo.board) {
  if (laSo.board[chi].saoChinh.some(s => s.startsWith('Tử Vi'))) {
    tuviCung = chi;
    break;
  }
}
console.log(`- Sao Tử Vi đang ở cung: ${tuviCung}`);

if (tuviCung === 'Tuất' && cungMenh.saoChinh.length === 0) {
  console.log("\n✅ KẾT QUẢ CHÍNH XÁC: Tử Vi ở Tuất, Mệnh ở Sửu Vô chính diệu.");
} else {
  console.log("\n❌ KẾT QUẢ VẪN SAI.");
  console.log(`(Lưu ý: Nếu Tử Vi ở Tỵ, Mệnh sẽ có Vũ Khúc Tham Lang)`);
}
