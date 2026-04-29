import React, { useState } from 'react';
import './AdvancedSections.css';
import { getStarBrightnessTags, CUNG_ICONS, getQuyNhanAnalysis } from '../utils/analysisContent';
import { CHI_NGU_HANH } from '../utils/tuviEngine';
import { getStarMeaning } from '../utils/starDictionary';

// ===== HELPER =====
const findCungByName = (board, name) => {
  for (const chi of Object.keys(board)) {
    const cung = board[chi];
    const tenCung = cung.tenCung?.split(' /')[0]?.split(' <')[0]?.trim();
    if (tenCung === name) return { cung, chi };
  }
  return { cung: null, chi: null };
};

// ===== CON CÁI (TỬ TỨC) =====
export const ConCaiSection = ({ chartData }) => {
  if (!chartData) return null;
  const { board } = chartData;
  const { cung: tuTuc } = findCungByName(board, 'Tử Tức');
  const starTags = getStarBrightnessTags(tuTuc?.saoChinh || []);
  const isVoChinhDieu = starTags.length === 0;

  const nenCung = isVoChinhDieu ? 'Vô chính diệu' : 'Có chính tinh thủ';
  const hasGoodStars = tuTuc?.saoTot?.length > 0;
  const hasBadStars = tuTuc?.saoXau?.length > 0;

  let khoDescription = "Cung Tử Tức cần xem xét kết hợp tam hợp chiếu. Con cái tự lập sớm.";
  let trucNuoiDay = "Linh hoạt & Tôn trọng";

  if (!isVoChinhDieu) {
    khoDescription = `Ảnh hưởng của ${starTags[0]?.name} khiến con cái có cá tính riêng.`;
    trucNuoiDay = "Định hướng & Kỷ luật";
  }

  if (hasGoodStars && !hasBadStars) {
    khoDescription += " Nền cung cát lợi, con cái ngoan ngoãn, dễ nuôi, lớn lên thành đạt báo hiếu.";
    trucNuoiDay = "Phát triển tự nhiên & Khuyến khích";
  } else if (hasBadStars) {
    khoDescription += " Cung có sát tinh, việc nuôi dạy con cái đòi hỏi nhiều kiên nhẫn, đôi khi khắc khẩu hoặc con dễ ốm vặt lúc nhỏ.";
    trucNuoiDay = "Mềm mỏng & Kiên nhẫn tuyệt đối";
  }

  return (
    <section className="result-section result-section--wide detail-section children-section">
      <div className="section-header">
        <div className="section-icon">子</div>
        <div className="section-header-text">
          <h2 className="section-title">Con Cái</h2>
          <p className="section-subtitle">Cung Tử Tức • Duyên con, khí chất của con và cách nuôi dạy</p>
        </div>
      </div>

      <div className="pill-tags">
        <span className="pill-tag pill-tag--accent">Cung Tử Tức</span>
        {isVoChinhDieu && <span className="pill-tag">Vô chính diệu</span>}
        {starTags.map((tag, i) => (
          <span key={i} className="pill-tag">{tag.name} ({tag.label || 'Tọa'})</span>
        ))}
      </div>

      <div className="detail-headline">
        <h3>Nuôi con đúng khí chất thay vì ép con vào khuôn mẫu định sẵn</h3>
        <p>Gia đình giữ nề nếp và thống nhất quan điểm giáo dục sẽ giúp hóa giải xung khắc thế hệ.</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card" style={{ background: 'var(--color-info-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-info)' }}>NỀN CUNG</div>
          <div className="summary-card-value">{nenCung}</div>
          <p className="summary-card-desc">{hasGoodStars ? 'Nhiều phúc lộc từ con cái' : 'Con cái tự lập tự cường'}</p>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-warning-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-warning)' }}>KHÍ CHẤT NỔI</div>
          <div className="summary-card-value">{starTags[0]?.name || 'Tự do'}</div>
          <p className="summary-card-desc">{isVoChinhDieu ? 'Cần xem đối cung' : 'Tọa thủ gốc cung'}</p>
        </div>
        <div className="summary-card" style={{ background: 'var(--bg-accent-soft)' }}>
          <div className="summary-card-label" style={{ color: 'var(--accent)' }}>TRỤC NUÔI DẠY</div>
          <div className="summary-card-value">{trucNuoiDay}</div>
          <p className="summary-card-desc">Phương pháp tối ưu</p>
        </div>
      </div>

      <div className="content-card">
        <p><strong>Căn cứ:</strong> {khoDescription}</p>
        <p style={{ marginTop: '0.75rem' }}><strong>Duyên con:</strong> {isVoChinhDieu ? 'Cung vô chính diệu, kết duyên sớm hay muộn đều tùy thuộc vào phúc đức gia đình.' : 'Tử Tức có năng lượng rõ rệt.'} Số lượng và thời điểm cụ thể còn phụ thuộc vào thời vận của hai vợ chồng.</p>
      </div>

      <div className="summary-cards" style={{ marginTop: '1rem' }}>
        <div className="summary-card" style={{ background: 'var(--color-good-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-good)' }}>YẾU TỐ SAO TỐT</div>
          <div className="summary-card-value">{tuTuc?.saoTot?.length || 0} Trợ Tinh</div>
          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tuTuc?.saoTot?.slice(0, 3).map((s, i) => {
              const cleanName = s.replace(/^(L\.)+/, '').split(' (')[0].trim();
              const meaning = getStarMeaning(cleanName);
              return (
                <div key={i}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-good)' }}>{s}:</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>{meaning ? meaning.overview : 'Phụ tinh mang lại thuận lợi.'}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-danger-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-danger)' }}>YẾU TỐ SAO XẤU</div>
          <div className="summary-card-value">{tuTuc?.saoXau?.length || 0} Sát Tinh</div>
          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tuTuc?.saoXau?.slice(0, 3).map((s, i) => {
              const cleanName = s.replace(/^(L\.)+/, '').split(' (')[0].trim();
              const meaning = getStarMeaning(cleanName);
              return (
                <div key={i}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-danger)' }}>{s}:</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>{meaning ? meaning.overview : 'Sát tinh báo hiệu thử thách.'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// ===== CÁC GIAI ĐOẠN CUỘC ĐỜI =====
export const GiaiDoanSection = ({ chartData }) => {
  const [selectedIdx, setSelectedIdx] = useState(() => {
    if (!chartData) return 0;
    const { board, userInfo } = chartData;
    const solarYear = userInfo.solarYear || userInfo.year;
    const namXem = userInfo.namXem || new Date().getFullYear();
    const tuoi = namXem - solarYear + 1;
    const periods = Object.values(board)
      .filter(cung => cung.daiHan && typeof cung.daiHan === 'number')
      .sort((a, b) => a.daiHan - b.daiHan);
    const currentIdx = periods.findIndex(cung => tuoi >= cung.daiHan && tuoi < cung.daiHan + 10);
    return currentIdx >= 0 ? currentIdx : 0;
  });

  if (!chartData) return null;
  const { board, userInfo } = chartData;
  const solarYear = userInfo.solarYear || userInfo.year;
  const namXem = userInfo.namXem || new Date().getFullYear();
  const tuoi = namXem - solarYear + 1;

  // Collect all đại hạn periods
  const daiHanPeriods = [];
  for (const chi of Object.keys(board)) {
    const cung = board[chi];
    if (cung.daiHan && typeof cung.daiHan === 'number') {
      const tenCung = cung.tenCung?.split(' /')[0]?.split(' <')[0]?.trim();
      const starTags = getStarBrightnessTags(cung.saoChinh || []);
      daiHanPeriods.push({
        startAge: cung.daiHan,
        endAge: cung.daiHan + 9,
        chi,
        tenCung,
        starTags,
        isCurrent: tuoi >= cung.daiHan && tuoi < cung.daiHan + 10,
        saoTot: cung.saoTot || [],
        saoXau: cung.saoXau || [],
      });
    }
  }
  daiHanPeriods.sort((a, b) => a.startAge - b.startAge);

  const selected = daiHanPeriods[selectedIdx];
  if (!selected) return null;

  const PALACE_FOCUS = {
    'Mệnh': 'định hình cái tôi, phát triển bản thân và tìm kiếm ý nghĩa cuộc đời',
    'Phụ Mẫu': 'mối quan hệ gia đình, sự hỗ trợ từ trưởng bối và xây dựng nền tảng cốt lõi',
    'Phúc Đức': 'đời sống tinh thần, nội lực và phúc nền phía sau mọi quyết định',
    'Điền Trạch': 'xây dựng tổ ấm, mua bán nhà cửa và tích lũy tài sản cố định',
    'Quan Lộc': 'phát triển sự nghiệp, thăng tiến công danh và khẳng định vị trí xã hội',
    'Nô Bộc': 'mở rộng quan hệ, xây dựng mạng lưới đối tác và năng lực lãnh đạo',
    'Thiên Di': 'nắm bắt cơ hội từ bên ngoài, dịch chuyển và thích nghi với môi trường mới',
    'Tật Ách': 'chăm sóc sức khỏe, phòng ngừa rủi ro và tu tâm dưỡng tính',
    'Tài Bạch': 'gia tăng thu nhập, đầu tư tài chính và quản lý dòng tiền',
    'Tử Tức': 'chăm lo con cái, nuôi dưỡng thế hệ sau và những thành quả tinh thần',
    'Phu Thê': 'đời sống tình cảm, xây dựng gia đình và sự đồng hành của người bạn đời',
    'Huynh Đệ': 'quan hệ anh em, bạn bè thân thiết, hợp tác làm ăn và chia sẻ nguồn lực'
  };

  const ratingStatus = selected.isCurrent ? 'HIỆN TẠI' : (tuoi < selected.startAge ? 'TƯƠNG LAI' : 'ĐÃ QUA');
  const palaceFocus = PALACE_FOCUS[selected.tenCung] || 'sự phát triển toàn diện và cân bằng các khía cạnh trong cuộc sống';
  
  const mainStarName = selected.starTags.length > 0 ? selected.starTags[0].name : '';
  const starImpact = mainStarName 
    ? `Bộ sao ${mainStarName} tạo lực tác động khá rõ, mang đến những bài học đặc trưng mang tính bước ngoặt.` 
    : 'Giai đoạn này không có chính tinh tỏa sáng mạnh (Vô Chính Diệu), cần dựa nhiều vào nỗ lực tự thân và sự kiên trì.';

  const isChallenging = mainStarName.includes('Thất Sát') || mainStarName.includes('Phá Quân') || mainStarName.includes('Tham Lang') || mainStarName.includes('Kỵ');
  const conclusion = isChallenging
    ? 'Nhịp độ phát triển sẽ có nhiều biến động hoặc thử thách lớn, đòi hỏi bản lĩnh vững vàng để bứt phá qua sóng gió.'
    : 'Nhịp phát triển nhìn chung tương đối thuận lợi, nhưng kết quả rực rỡ nhất chỉ đến khi bạn duy trì được sự tập trung và kỷ luật.';

  return (
    <section className="result-section result-section--wide detail-section stages-section">
      <div className="section-header">
        <div className="section-icon">運</div>
        <div className="section-header-text">
          <h2 className="section-title">Các Giai Đoạn Cuộc Đời</h2>
          <p className="section-subtitle">Luận theo từng đại vận 10 năm • Nêu rõ trọng tâm, cơ hội và điều cần lưu ý ở mỗi chặng</p>
        </div>
      </div>

      {/* Timeline tabs */}
      <div className="gd-timeline">
        {daiHanPeriods.map((p, idx) => (
          <button
            key={idx}
            className={`gd-tab ${idx === selectedIdx ? 'gd-tab--active' : ''} ${p.isCurrent ? 'gd-tab--current' : ''}`}
            onClick={() => setSelectedIdx(idx)}
          >
            <span className="gd-tab-range">{p.startAge}-{p.endAge}</span>
            {p.isCurrent && <span className="gd-tab-now">HIỆN TẠI</span>}
          </button>
        ))}
      </div>

      {/* Selected period detail */}
      <div className="content-card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🌀</span>
          <div>
            <strong style={{ fontSize: '1.1rem' }}>Tuổi {selected.startAge}-{selected.endAge}</strong>
            <span style={{ marginLeft: '0.5rem' }} className="pill-tag pill-tag--accent">{selected.tenCung} ({selected.chi})</span>
            <span style={{ marginLeft: '0.5rem' }} className="pill-tag">{ratingStatus}</span>
          </div>
        </div>

        <div className="pill-tags" style={{ marginBottom: '0.5rem' }}>
          <span className="pill-tag">🔥 Trọng tâm: {selected.tenCung}</span>
        </div>

        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Đọc như xu hướng dài hạn của đại vận này, rồi đối chiếu với hoàn cảnh thực tế ở hiện tại.
        </p>

        <div className="pill-tags" style={{ marginBottom: '1rem' }}>
          {selected.starTags.map((s, i) => (
            <span key={i} className="pill-tag">{s.name} ({s.label || 'Tọa'})</span>
          ))}
          {selected.starTags.length === 0 && <span className="pill-tag pill-tag--accent">Vô chính diệu</span>}
        </div>

        <div className="quote-box">
          "Đại vận {selected.startAge}-{selected.endAge} tuổi nhấn mạnh {palaceFocus}.
          {mainStarName ? ` Sự hiện diện của ${mainStarName} là dấu ấn nổi bật của chặng này.` : ''}
          {conclusion.replace('Nhịp', ' Nhịp')}"
        </div>

        {/* Category buttons */}
        <div className="pill-tags" style={{ marginTop: '1rem' }}>
          <span className="pill-tag">💼 Sự nghiệp</span>
          <span className="pill-tag">💰 Tài lộc</span>
          <span className="pill-tag">💚 Sức khỏe</span>
          <span className="pill-tag">❤️ Tình cảm</span>
        </div>

        <p style={{ marginTop: '1rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
          Đại vận {selected.startAge}-{selected.endAge} tuổi đi qua cung {selected.tenCung}, nên trọng tâm tự nhiên nghiêng về {palaceFocus}.
          {' '}{starImpact}
          {' '}{conclusion}
        </p>
      </div>

      {/* Chiến lược giai đoạn */}
      <div className="content-card" style={{ marginTop: '1rem' }}>
        <div className="content-card-title">CHIẾN LƯỢC GIAI ĐOẠN</div>
        <div className="step-list">
          <div className="step-item">
            <span className="step-text">
              {(() => {
                const PALACE_STRATEGY = {
                  'Mệnh': 'Tập trung đầu tư vào bản thân, nâng cao năng lực lõi và xây dựng thương hiệu cá nhân.',
                  'Phụ Mẫu': 'Lắng nghe lời khuyên từ người đi trước, duy trì sự gắn kết gia đình làm điểm tựa.',
                  'Phúc Đức': 'Tu tâm dưỡng tính, làm việc thiện và tin vào trực giác cá nhân khi ra quyết định lớn.',
                  'Điền Trạch': 'Ưu tiên dòng tiền cho tài sản cố định, an cư để lập nghiệp lâu dài.',
                  'Quan Lộc': 'Nắm bắt cơ hội thăng tiến, mở rộng quy mô công việc và củng cố vị trí chuyên môn.',
                  'Nô Bộc': 'Chọn lọc kỹ các mối quan hệ đối tác, cẩn trọng trong việc ủy quyền hoặc vay mượn.',
                  'Thiên Di': 'Mạnh dạn bước ra khỏi vùng an toàn, đi lại hoặc thay đổi môi trường sẽ mang lại cát khí.',
                  'Tật Ách': 'Đừng chủ quan với sức khỏe; làm việc điều độ và tránh những căng thẳng không cần thiết.',
                  'Tài Bạch': 'Đa dạng hóa nguồn thu, quản lý tài chính chặt chẽ và tránh đầu tư lướt sóng mạo hiểm.',
                  'Tử Tức': 'Kiên nhẫn trong việc đào tạo thế hệ sau hoặc cấp dưới; đây là lúc gieo hạt chờ ngày hái quả.',
                  'Phu Thê': 'Cân bằng giữa công việc và gia đình, dùng sự thấu hiểu để hóa giải mọi bất đồng.',
                  'Huynh Đệ': 'Tận dụng sức mạnh tập thể, nhưng cần minh bạch tài chính khi hợp tác chung.'
                };
                return PALACE_STRATEGY[selected.tenCung] || `Tập trung củng cố khía cạnh ${selected.tenCung.toLowerCase()} như một bàn đạp vững chắc.`;
              })()}
            </span>
          </div>
          <div className="step-item">
            <span className="step-text">
              {isChallenging 
                ? "Đây là giai đoạn mang tính thử thách cao, chiến lược tốt nhất là duy trì sự linh hoạt, lấy 'tĩnh' chế 'động' khi đối mặt với rủi ro."
                : "Với các tinh tú ôn hòa chiếu mệnh, đây là thời kỳ tuyệt vời để tích lũy bền vững, hãy đi những bước vững chắc thay vì nôn nóng."}
            </span>
          </div>
          <div className="step-item">
            <span className="step-text">
              {(() => {
                if (!mainStarName) return "Vì là giai đoạn Vô Chính Diệu (không có sao chính), chiến lược tối ưu là 'tùy cơ ứng biến', mượn sức người khác và hạn chế đứng mũi chịu sào.";
                if (mainStarName.includes('Tử Vi') || mainStarName.includes('Thiên Phủ')) return `Dưới sự dẫn dắt của ${mainStarName}, bạn cần có tầm nhìn bao quát và mạnh dạn đảm nhận vai trò lãnh đạo.`;
                if (mainStarName.includes('Thái Dương') || mainStarName.includes('Thái Âm')) return `Sao ${mainStarName} đòi hỏi bạn làm việc minh bạch, tuần tự và nhạy bén để thuận theo thời thế.`;
                if (mainStarName.includes('Vũ Khúc') || mainStarName.includes('Thiên Đồng')) return `Ảnh hưởng của ${mainStarName} nhắc nhở bạn hành động thực tế, nắm bắt cơ hội tài chính và giữ tinh thần lạc quan.`;
                if (mainStarName.includes('Cự Môn') || mainStarName.includes('Thiên Cơ')) return `Với ${mainStarName}, hãy cẩn trọng trong lời nói, sử dụng trí tuệ và tư duy phân tích thay vì hành động bộc phát.`;
                if (mainStarName.includes('Thất Sát') || mainStarName.includes('Phá Quân') || mainStarName.includes('Tham Lang')) return `Bộ sao ${mainStarName} mạnh mẽ đòi hỏi bạn dám nghĩ dám làm, sẵn sàng phá bỏ lối mòn nhưng phải tính toán kỹ rủi ro.`;
                if (mainStarName.includes('Thiên Lương') || mainStarName.includes('Thiên Tướng')) return `Sao ${mainStarName} mang tính che chở, hãy chú trọng chữ tín, bảo vệ nguyên tắc và sẵn sàng giúp đỡ người khác để tạo phước lành.`;
                return `Sự hiện diện của ${mainStarName} đòi hỏi bạn phải hiểu rõ sở trường và kiên định với mục tiêu đã chọn.`;
              })()}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ===== VẬN TRÌNH 12 THÁNG =====
export const VanTrinh12ThangSection = ({ chartData }) => {
  if (!chartData) return null;
  const { board } = chartData;

  // Thuật toán: Ánh xạ 12 tháng Âm Lịch bắt đầu từ Tháng 1 = cung Dần (Theo chuẩn Tử Vi)
  // Thực tế có phép Lưu Nguyệt di động, nhưng để trực quan ta dùng Địa Chi cố định của 12 tháng
  const LUNAR_MONTHS = ['Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu'];
  const MONTH_RATINGS = [];
  const MONTH_COLORS = {
    'Đại cát': 'var(--color-good)',
    'Bình an': 'var(--text-secondary)',
    'Tiểu hung': 'var(--color-warning)',
    'Cần thận': 'var(--color-danger)',
  };

  let maxScore = -999;
  let minScore = 999;
  let bestMonthIdx = 0;
  let worstMonthIdx = 0;

  let totalGoodCount = 0;
  let totalBadCount = 0;

  LUNAR_MONTHS.forEach((chi, idx) => {
    const cung = board[chi];
    let score = 0;

    // 1. Chấm điểm Chính tinh
    const mainStars = cung.saoChinh || [];
    mainStars.forEach(sao => {
      if (sao.includes('(M)') || sao.includes('(V)') || sao.includes('(Đ)')) score += 2;
      else if (sao.includes('(H)') || sao.includes('(B)')) score -= 1;
    });

    // 2. Chấm điểm Phụ tinh
    const goodStars = cung.saoTot || [];
    const badStars = cung.saoXau || [];
    totalGoodCount += goodStars.length;
    totalBadCount += badStars.length;

    score += goodStars.length * 1.5;
    score -= badStars.length * 1.5;

    // Xếp hạng
    if (score >= 2) MONTH_RATINGS.push('Đại cát');
    else if (score >= 0) MONTH_RATINGS.push('Bình an');
    else if (score >= -2) MONTH_RATINGS.push('Tiểu hung');
    else MONTH_RATINGS.push('Cần thận');

    if (score > maxScore) { maxScore = score; bestMonthIdx = idx; }
    if (score < minScore) { minScore = score; worstMonthIdx = idx; }
  });

  const overallRating = totalGoodCount >= totalBadCount ? 'Vượng khí' : 'Cần bảo toàn';

  // Find best/worst months
  const bestMonth = bestMonthIdx + 1;
  const worstMonth = worstMonthIdx + 1;

  return (
    <section className="result-section result-section--wide detail-section monthly-section">
      <div className="section-header">
        <div className="section-icon">月</div>
        <div className="section-header-text">
          <h2 className="section-title">Vận Trình 12 Tháng (Âm Lịch)</h2>
          <p className="section-subtitle">Dự báo theo từng tháng Âm Lịch dựa trên Địa Chi cung và các sao chiếu</p>
        </div>
      </div>

      <div className="summary-cards" style={{ gap: '1rem' }}>
        <div className="summary-card" style={{ textAlign: 'center', background: 'var(--color-good-bg)', border: '1px solid rgba(40, 167, 69, 0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.25rem 1rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-good)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Tháng Tốt Nhất</p>
          <div style={{ width: '54px', height: '54px', background: 'var(--bg-section)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-good)', boxShadow: '0 4px 12px rgba(40, 167, 69, 0.1)', marginBottom: '0.75rem' }}>
            {bestMonth}
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-good)', marginBottom: '0.2rem' }}>{MONTH_RATINGS[bestMonth - 1]}</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cung {LUNAR_MONTHS[bestMonth - 1]}</p>
        </div>
        
        <div className="summary-card" style={{ textAlign: 'center', background: 'var(--color-danger-bg)', border: '1px solid rgba(220, 53, 69, 0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.25rem 1rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-danger)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Cần Chú Ý Nhất</p>
          <div style={{ width: '54px', height: '54px', background: 'var(--bg-section)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-danger)', boxShadow: '0 4px 12px rgba(220, 53, 69, 0.1)', marginBottom: '0.75rem' }}>
            {worstMonth}
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-danger)', marginBottom: '0.2rem' }}>{MONTH_RATINGS[worstMonth - 1]}</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cung {LUNAR_MONTHS[worstMonth - 1]}</p>
        </div>

        <div className="summary-card" style={{ textAlign: 'center', background: 'var(--bg-accent-soft)', border: '1px solid var(--accent-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.25rem 1rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Trung Bình Năm</p>
          <div style={{ width: '54px', height: '54px', background: 'var(--bg-section)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)', boxShadow: '0 4px 12px rgba(160, 120, 48, 0.15)', marginBottom: '0.75rem' }}>
            ✦
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-dark)', marginBottom: '0.2rem' }}>{overallRating}</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tính trên 12 tháng</p>
        </div>
      </div>

      <div className="vt-timeline-bar">
        {MONTH_RATINGS.map((rating, idx) => (
          <div key={idx} className="vt-bar-item" style={{ '--bar-color': MONTH_COLORS[rating] || 'var(--text-muted)' }}>
            <div className="vt-bar-dot"></div>
            <span className="vt-bar-label">Th{idx + 1}</span>
          </div>
        ))}
      </div>

      <div className="vt-month-grid">
        {MONTH_RATINGS.map((rating, idx) => {
          const chi = LUNAR_MONTHS[idx];
          const cung = board[chi];
          const stars = [...(cung.saoChinh || []), ...(cung.saoTot || [])].slice(0, 2).join(', ');
          
          return (
            <div key={idx} className="vt-month-card">
              <div className="vt-month-header">
                <span className="vt-month-num">Tháng {idx + 1}</span>
                <span className="vt-month-rating" style={{ 
                  color: MONTH_COLORS[rating], 
                  backgroundColor: `${MONTH_COLORS[rating]}15` 
                }}>
                  {rating}
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.5rem' }}>
                Cung {chi}
              </div>
              <p className="vt-month-desc" style={{ fontSize: '0.82rem', lineHeight: '1.6' }}>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Hạn tại cung {cung.tenCung.split(' /')[0].split(' <')[0]} ({chi})
                </strong>
                {rating === 'Đại cát' ? (
                  <>Tháng này hội tụ nhiều cát tinh như {stars || 'các bộ sao tốt'}, mang lại cơ hội hanh thông, mọi việc như ý và có Quý Nhân phù trợ nhiệt tình.</>
                ) : rating === 'Bình an' ? (
                  <>Vận trình tại cung {cung.tenCung.split(' /')[0].split(' <')[0]} tương đối ổn định, vạn sự bình hòa. Đây là lúc thích hợp để duy trì nhịp độ và bồi đắp nội lực.</>
                ) : rating === 'Tiểu hung' ? (
                  <>Cung hạn xuất hiện một số sát tinh, dễ gặp chuyện thị phi hoặc hao tán tài lộc nhỏ. Cần cẩn trọng trong lời nói và sức khỏe.</>
                ) : (
                  <>Vận trình nhiều trắc trở do các bộ sao xấu xung chiếu. Cần kiên trì phòng thủ, tránh các quyết định đầu tư mạo hiểm trong tháng này.</>
                )}
              </p>
              <div className="vt-month-footer">
                <span className="pill-tag" style={{ fontSize: '0.6rem', border: 'none', background: 'rgba(160, 120, 48, 0.05)' }}>
                  {stars || 'Vô chính diệu'}
                </span>
                <span className="pill-tag" style={{ 
                  fontSize: '0.6rem', 
                  border: 'none',
                  background: ['Cần thận', 'Tiểu hung'].includes(rating) ? 'rgba(180, 50, 50, 0.1)' : 'rgba(50, 180, 50, 0.1)',
                  color: ['Cần thận', 'Tiểu hung'].includes(rating) ? '#b03020' : '#5a8a3a'
                }}>
                  {['Cần thận', 'Tiểu hung'].includes(rating) ? '● Tĩnh' : '● Động'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ===== PHONG THỦY & VẬT PHẨM =====
export const PhongThuySection = ({ chartData }) => {
  if (!chartData) return null;
  const { userInfo } = chartData;

  // Derive feng shui from Bản Mệnh
  const banMenh = userInfo.banMenhFull?.split(' - ')[0] || 'Kim';
  const HUONG_TOT = {
    'Kim': ['Tây', 'Tây Bắc', 'Tây Nam', 'Đông Bắc'],
    'Mộc': ['Đông', 'Đông Nam', 'Bắc'],
    'Thủy': ['Bắc', 'Tây', 'Tây Bắc'],
    'Hỏa': ['Nam', 'Đông', 'Đông Nam'],
    'Thổ': ['Tây Nam', 'Đông Bắc', 'Nam'],
  };
  const HUONG_KY = {
    'Kim': ['Nam', 'Đông', 'Đông Nam'],
    'Mộc': ['Tây', 'Tây Bắc', 'Tây Nam', 'Đông Bắc'],
    'Thủy': ['Tây Nam', 'Đông Bắc', 'Nam'],
    'Hỏa': ['Bắc', 'Tây', 'Tây Bắc'],
    'Thổ': ['Đông', 'Đông Nam', 'Bắc'],
  };
  const MAU_MAY_MAN = {
    'Kim': ['Trắng', 'Vàng', 'Bạc'],
    'Mộc': ['Xanh lá', 'Xanh dương', 'Đen'],
    'Thủy': ['Đen', 'Xanh dương', 'Trắng'],
    'Hỏa': ['Đỏ', 'Tím', 'Hồng'],
    'Thổ': ['Vàng', 'Nâu', 'Cam'],
  };
  const SO_MAY_MAN = {
    'Kim': [4, 9, 14],
    'Mộc': [3, 8, 13],
    'Thủy': [1, 6, 11],
    'Hỏa': [2, 7, 12],
    'Thổ': [5, 10, 15],
  };
  const MAU_KY_DESC = {
    'Kim': 'đỏ, hồng, tím (Hỏa khắc Kim)',
    'Mộc': 'trắng, bạc, ánh kim (Kim khắc Mộc)',
    'Thủy': 'vàng, nâu (Thổ khắc Thủy)',
    'Hỏa': 'đen, xanh dương (Thủy khắc Hỏa)',
    'Thổ': 'xanh lá (Mộc khắc Thổ)',
  };

  const MAU_KY = {
    'Kim': ['Đỏ', 'Hồng', 'Tím'],
    'Mộc': ['Trắng', 'Bạc', 'Kem'],
    'Thủy': ['Vàng', 'Nâu'],
    'Hỏa': ['Đen', 'Xanh dương'],
    'Thổ': ['Xanh lá'],
  };

  const huongTot = HUONG_TOT[banMenh] || ['Đông', 'Nam'];
  const huongKy = HUONG_KY[banMenh] || ['Tây', 'Bắc'];
  const mauMay = MAU_MAY_MAN[banMenh] || ['Trắng', 'Vàng'];
  const soMay = SO_MAY_MAN[banMenh] || [4, 9];

  return (
    <section className="result-section result-section--wide detail-section fengshui-section">
      <div className="section-header">
        <div className="section-icon" style={{ color: '#27ae60' }}>☯</div>
        <div className="section-header-text">
          <h2 className="section-title">Phong Thủy & Vật Phẩm</h2>
          <p className="section-subtitle">Hướng tốt • Màu may • Số hợp • Lời khuyên chi tiết</p>
        </div>
      </div>

      <div className="content-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.5rem' }}>
          <strong style={{ fontSize: '1.1rem', color: 'var(--accent)' }}>Mệnh {banMenh}</strong>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Mệnh {banMenh} — bạn là "{banMenh === 'Kim' ? 'thanh kiếm sắc bén' : banMenh === 'Mộc' ? 'cây đại thụ' : banMenh === 'Thủy' ? 'dòng nước' : banMenh === 'Hỏa' ? 'ngọn lửa' : 'mặt đất'}"!
            Phong thủy của bạn cần sự thanh thoát, tinh tế, tăng cường năng lượng {banMenh}.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="pill-tags" style={{ marginBottom: '1rem' }}>
        <span className="pill-tag pill-tag--accent">🏠 TỔNG QUAN</span>
        <span className="pill-tag">🏢 NHÀ Ở</span>
        <span className="pill-tag">💼 VĂN PHÒNG</span>
        <span className="pill-tag">💎 TRANG SỨC</span>
      </div>

      <div className="summary-cards">
        <div className="summary-card" style={{ background: 'var(--color-good-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-good)' }}>✔ HƯỚNG TỐT</div>
          <div className="pill-tags" style={{ marginBottom: '0.5rem' }}>
            {huongTot.map((h, i) => <span key={i} className="pill-tag" style={{ fontSize: '0.72rem' }}>{h}</span>)}
          </div>
          <p className="summary-card-desc">Các hướng này mang lại sinh khí và sự hòa hợp cho người mệnh {banMenh}, giúp tăng vận may và tài lộc.</p>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-danger-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-danger)' }}>✗ HƯỚNG KỴ</div>
          <div className="pill-tags" style={{ marginBottom: '0.5rem' }}>
            {huongKy.slice(0, 3).map((h, i) => <span key={i} className="pill-tag" style={{ fontSize: '0.72rem' }}>{h}</span>)}
          </div>
          <p className="summary-card-desc">Những hướng này xung khắc mệnh {banMenh}, có thể gây trở ngại về tài chính và sức khỏe.</p>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-info-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-info)' }}>🎨 MÀU MAY MẮN</div>
          <div className="pill-tags" style={{ marginBottom: '0.5rem' }}>
            {mauMay.map((m, i) => <span key={i} className="pill-tag" style={{ fontSize: '0.72rem' }}>{m}</span>)}
          </div>
          <p className="summary-card-desc">{mauMay.join(', ')} là màu tương sinh, tương hợp. Nên tránh {MAU_KY_DESC[banMenh] || 'màu xung khắc'}.</p>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '1rem' }}>
        <div className="summary-card" style={{ background: 'var(--bg-accent-soft)', border: '1px solid var(--border-card)' }}>
          <div className="summary-card-label" style={{ color: 'var(--accent)' }}>✦ SỐ MAY MẮN</div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {soMay.map((s, i) => (
              <span key={i} style={{ 
                width: '44px', height: '44px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                background: 'var(--bg-section)',
                border: '1px solid var(--accent-light)', 
                borderRadius: '50%', 
                fontWeight: 800, 
                fontSize: '1.25rem',
                color: 'var(--accent-dark)',
                boxShadow: '0 4px 10px rgba(160, 120, 48, 0.1)'
              }}>{s}</span>
            ))}
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Bạn có thể ứng dụng vào số điện thoại, biển số xe, hay số tầng nhà.</p>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-danger-bg)', border: '1px solid rgba(220, 53, 69, 0.1)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-danger)' }}>✗ MÀU CẦN TRÁNH</div>
          <div className="pill-tags" style={{ marginTop: '0.75rem' }}>
            {MAU_KY[banMenh]?.map((m, i) => (
              <span key={i} className="pill-tag" style={{ fontSize: '0.8rem', background: '#fff', color: 'var(--color-danger)', border: '1px solid rgba(220, 53, 69, 0.3)', fontWeight: 600 }}>{m}</span>
            ))}
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Hạn chế dùng làm màu chủ đạo cho những vật dụng lớn hoặc quan trọng.</p>
        </div>
      </div>
    </section>
  );
};

// ===== THẦN SÁT LUẬN GIẢI =====
export const ThanSatSection = ({ chartData }) => {
  if (!chartData) return null;
  const { board } = chartData;

  let totalTot = 0, totalXau = 0;
  const topTot = [], topXau = [];
  for (const chi of Object.keys(board)) {
    const cung = board[chi];
    totalTot += (cung.saoTot?.length || 0);
    totalXau += (cung.saoXau?.length || 0);
    cung.saoTot?.forEach(s => { if (!s.startsWith('L.') && topTot.length < 5) topTot.push(s); });
    cung.saoXau?.forEach(s => { if (!s.startsWith('L.') && topXau.length < 5) topXau.push(s); });
  }

  const catPercent = Math.round((totalTot / (totalTot + totalXau)) * 100);

  // Count Quý Nhân stars
  const quyNhanStars = ['Thiên Khôi', 'Thiên Việt', 'Lộc Tồn', 'Thiên Mã', 'Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc'];
  let quyNhanCount = 0;
  const foundQuyNhan = [];
  for (const chi of Object.keys(board)) {
    board[chi].saoTot?.forEach(s => {
      if (quyNhanStars.includes(s) && !foundQuyNhan.includes(s)) {
        foundQuyNhan.push(s);
        quyNhanCount++;
      }
    });
  }

  const isGood = totalTot >= totalXau;
  const balanceText = isGood 
    ? "Lá số của bạn nhận được nhiều sự trợ lực hơn là thử thách. Các sao tốt sẽ đóng vai trò như lớp khiên bảo vệ, giúp giảm thiểu rủi ro và mang lại may mắn khi gặp hạn." 
    : "Lá số của bạn mang nhiều thử thách và áp lực từ các sao xấu. Bạn cần rèn luyện nội lực vững vàng, lấy sự cẩn trọng làm nền tảng để tự vượt qua sóng gió.";
  
  const balanceTitle = isGood ? "☆ Cán Cân Thuận Lợi" : "⚠️ Cán Cân Thử Thách";
  const balanceColor = isGood ? "var(--color-good)" : "var(--color-warning)";
  const balanceBg = isGood ? "var(--color-good-bg)" : "var(--color-warning-bg)";

  return (
    <section className="result-section result-section--wide detail-section stars-analysis-section">
      <div className="section-header">
        <div className="section-icon">煞</div>
        <div className="section-header-text">
          <h2 className="section-title">Thần Sát Luận Giải</h2>
          <p className="section-subtitle">Lực lượng phụ tinh tác động • Đánh giá tỷ lệ Cát / Hung toàn lá số</p>
        </div>
      </div>

      <div className="content-card">
        <p><strong>Thần Sát (Các Phụ Tinh)</strong> giống như "thời tiết" của cuộc đời bạn. Dù Mệnh có vững vàng đến đâu, việc di chuyển trong thời tiết thuận lợi (Cát Tinh) hay giông bão (Hung Tinh) sẽ quyết định mức độ vất vả của bạn.</p>
      </div>

      <div className="content-card" style={{ marginTop: '1rem', background: balanceBg }}>
        <div className="content-card-title" style={{ color: balanceColor }}>{balanceTitle}</div>
        <p>{balanceText}</p>
      </div>

      <div className="content-card" style={{ marginTop: '1rem' }}>
        <div className="content-card-title">TỶ LỆ TRỢ LỰC VÀ THỬ THÁCH (TOÀN LÁ SỐ)</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--color-good)', fontWeight: 700 }}>{totalTot} Cát Tinh ({catPercent}%)</span>
          <span style={{ color: 'var(--color-danger)', fontWeight: 700 }}>{totalXau} Hung Tinh ({100 - catPercent}%)</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'var(--color-danger-bg)', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${catPercent}%`, height: '100%', background: 'var(--color-good)' }}></div>
          <div style={{ width: `${100 - catPercent}%`, height: '100%', background: 'var(--color-danger)' }}></div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '1rem' }}>
        <div className="summary-card" style={{ background: 'var(--color-good-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-good)' }}>SAO HỘ MỆNH TIÊU BIỂU</div>
          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {topTot.slice(0, 3).map((s, i) => (
              <div key={i} style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                <strong style={{ color: 'var(--color-good)' }}>{s}:</strong> <span style={{ color: 'var(--text-secondary)' }}>{getStarMeaning(s.replace(/^(L\.)+/, '').split(' (')[0].trim())?.overview || 'Sao mang lại phúc lộc, may mắn.'}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-danger-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-danger)' }}>SAO THỬ THÁCH TIÊU BIỂU</div>
          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {topXau.slice(0, 3).map((s, i) => (
              <div key={i} style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                <strong style={{ color: 'var(--color-danger)' }}>{s}:</strong> <span style={{ color: 'var(--text-secondary)' }}>{getStarMeaning(s.replace(/^(L\.)+/, '').split(' (')[0].trim())?.overview || 'Sao mang tính cản trở, thử thách.'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quý Nhân section */}
      <div style={{ marginTop: '2rem' }}>
        <div className="section-header">
          <div className="section-icon">貴</div>
          <div className="section-header-text">
            <h2 className="section-title">Quý Nhân Phù Hộ</h2>
            <p className="section-subtitle">Ai giúp bạn • Phương hướng • Cách kích hoạt</p>
          </div>
        </div>

        {(() => {
          const qnAnalysis = getQuyNhanAnalysis(foundQuyNhan);
          return (
            <>
              <div className="content-card" style={{ background: 'var(--color-good-bg)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-good)' }}>{quyNhanCount > 0 ? 'Tốt' : 'Bình thường'}</span>
                  <span className="pill-tag pill-tag--accent">{quyNhanCount} Quý Nhân tinh</span>
                </div>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
                  {qnAnalysis.headline}
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {qnAnalysis.activation}
                </p>
              </div>

              <div className="summary-cards" style={{ gap: '1rem' }}>
                <div className="summary-card" style={{ textAlign: 'center', background: 'var(--bg-accent-soft)', border: '1px solid var(--accent-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.25rem 1rem' }}>
                  <div style={{ width: '54px', height: '54px', background: 'var(--bg-section)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)', boxShadow: '0 4px 12px rgba(160, 120, 48, 0.15)', marginBottom: '0.75rem' }}>
                    {quyNhanCount}
                  </div>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quý Nhân</p>
                </div>
                <div className="summary-card" style={{ textAlign: 'center', background: 'var(--color-info-bg)', border: '1px solid rgba(23, 162, 184, 0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.25rem 1rem' }}>
                  <div style={{ width: '54px', height: '54px', background: 'var(--bg-section)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-info)', boxShadow: '0 4px 12px rgba(23, 162, 184, 0.1)', marginBottom: '0.75rem' }}>
                    2
                  </div>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-info)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sao Củng</p>
                </div>
                <div className="summary-card" style={{ textAlign: 'center', background: 'var(--color-good-bg)', border: '1px solid rgba(40, 167, 69, 0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.25rem 1rem' }}>
                  <div style={{ width: '54px', height: '54px', background: 'var(--bg-section)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-good)', boxShadow: '0 4px 12px rgba(40, 167, 69, 0.1)', marginBottom: '0.75rem' }}>
                    5
                  </div>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-good)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cung có QN</p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-heading)', marginBottom: '1rem', borderLeft: '3px solid var(--accent)', paddingLeft: '0.75rem' }}>
                  Chi tiết Quý Nhân & Bối cảnh gặp gỡ
                </h4>
                <div className="vt-month-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                  {qnAnalysis.details.map((detail, idx) => (
                    <div key={idx} className="vt-month-card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>★</span>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--accent)' }}>{detail.star}</strong>
                      </div>
                      
                      <div style={{ marginBottom: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--color-info-bg)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-info)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontWeight: 700 }}>
                          ❖ Bối cảnh gặp gỡ
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                          {detail.place}
                        </p>
                      </div>

                      <div style={{ marginBottom: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--color-warning-bg)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-warning)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontWeight: 700 }}>
                          ❖ Cơ duyên kích hoạt
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                          {detail.event}
                        </p>
                      </div>

                      <div style={{ padding: '0.5rem 0.75rem', background: 'var(--color-good-bg)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-good)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontWeight: 700 }}>
                          ❖ Hình tướng Quý Nhân
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                          {detail.person}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </section>
  );
};

// ===== ĐIỀN TRẠCH & NHÀ ĐẤT =====
export const DienTrachSection = ({ chartData }) => {
  if (!chartData) return null;
  const { board } = chartData;
  const { cung: dienTrach } = findCungByName(board, 'Điền Trạch');
  const starTags = getStarBrightnessTags(dienTrach?.saoChinh || []);
  const isVoChinhDieu = starTags.length === 0;

  const rating = isVoChinhDieu ? 'Cần xem thêm' : 'Tạm ổn';

  // Count stars
  const numChinh = dienTrach?.saoChinh?.length || 0;
  const numTot = dienTrach?.saoTot?.length || 0;
  const numXau = dienTrach?.saoXau?.length || 0;

  return (
    <section className="result-section result-section--wide detail-section realestate-section">
      <div className="section-header">
        <div className="section-icon">宅</div>
        <div className="section-header-text">
          <h2 className="section-title">Điền Trạch & Nhà Đất</h2>
          <p className="section-subtitle">Phân tích cung Điền Trạch • Bất động sản • Hướng tốt</p>
        </div>
      </div>

      <div className="content-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="pill-tag pill-tag--accent">{rating}</span>
          <span style={{ fontWeight: 600 }}>Cung Điền Trạch</span>
        </div>
        <div className="pill-tags" style={{ marginBottom: '0.75rem' }}>
          {dienTrach?.saoChinh?.map((s, i) => <span key={i} className="pill-tag">🏠 {s}</span>)}
          {isVoChinhDieu && <span className="pill-tag">Vô chính diệu</span>}
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
          {isVoChinhDieu
            ? '🌀 Cung Điền Trạch vô chính diệu, việc mua bán nhà đất hoặc duy trì cơ ngơi gia tộc sẽ phụ thuộc nhiều vào hoàn cảnh và sự nỗ lực tự thân hơn là được thừa hưởng trực tiếp.'
            : `🌀 Vận nhà đất khá tốt. Nền cung cho thấy phong cách chọn nhà và quản lý tài sản mang đậm khí chất của ${starTags[0]?.name || 'các sao thủ tọa'}. Nắm đúng thời cơ, chọn đúng hướng — "nhà chọn hướng tốt, nhịp thuận hơn."`
          }
        </p>

        <div className="summary-cards" style={{ marginTop: '1rem' }}>
          <div className="summary-card" style={{ background: 'var(--bg-accent-soft)' }}>
            <div className="summary-card-label" style={{ color: 'var(--accent)' }}>CƠ CẤU SAO CHÍNH</div>
            <div className="summary-card-value">{numChinh} Sao</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {isVoChinhDieu ? 'Cần xem đối cung (Tử Tức) để đánh giá động lực xây dựng nền tảng.' : starTags.map(s => getStarMeaning(s.name.replace(/^(L\.)+/, '').split(' (')[0].trim())?.overview || '').join(' ')}
            </div>
          </div>
          <div className="summary-card" style={{ background: 'var(--color-good-bg)' }}>
            <div className="summary-card-label" style={{ color: 'var(--color-good)' }}>YẾU TỐ THUẬN LỢI</div>
            <div className="summary-card-value">{numTot} Trợ tinh</div>
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {dienTrach?.saoTot?.slice(0, 3).map((s, i) => {
                const cleanName = s.replace(/^(L\.)+/, '').split(' (')[0].trim();
                const meaning = getStarMeaning(cleanName);
                return (
                  <div key={i} style={{ fontSize: '0.8rem' }}>
                    <strong style={{ color: 'var(--color-good)' }}>{s}:</strong> <span style={{ color: 'var(--text-secondary)' }}>{meaning?.overview || 'Hỗ trợ việc tích lũy tài sản.'}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="summary-card" style={{ background: 'var(--color-danger-bg)' }}>
            <div className="summary-card-label" style={{ color: 'var(--color-danger)' }}>YẾU TỐ LƯU Ý</div>
            <div className="summary-card-value">{numXau} Sát tinh</div>
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {dienTrach?.saoXau?.slice(0, 3).map((s, i) => {
                const cleanName = s.replace(/^(L\.)+/, '').split(' (')[0].trim();
                const meaning = getStarMeaning(cleanName);
                return (
                  <div key={i} style={{ fontSize: '0.8rem' }}>
                    <strong style={{ color: 'var(--color-danger)' }}>{s}:</strong> <span style={{ color: 'var(--text-secondary)' }}>{meaning?.overview || 'Cẩn trọng tranh chấp hoặc hao hụt.'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
