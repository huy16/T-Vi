/**
 * analysisContent.js
 * Dữ liệu luận giải Tử Vi dựa trên Chính Tinh tọa Mệnh
 * Và các section phân tích chi tiết cho 12 cung
 */

// ===== CUNG ICONS =====
export const CUNG_ICONS = {
  'Mệnh': '命', 'Phụ Mẫu': '父', 'Phúc Đức': '福',
  'Điền Trạch': '田', 'Quan Lộc': '官', 'Nô Bộc': '奴',
  'Thiên Di': '遷', 'Tật Ách': '疾', 'Tài Bạch': '財',
  'Tử Tức': '子', 'Phu Thê': '夫', 'Huynh Đệ': '兄',
};

// ===== MÔ TẢ NGẮN CHO 12 CUNG =====
export const CUNG_DESCRIPTIONS = {
  'Mệnh': 'Tấm gương soi cốt cách – khí chất, nếp nghĩ và cách bạn bước vào đời',
  'Phụ Mẫu': 'Cội nguồn nuôi dưỡng – nền gia đình, sự nâng đỡ và dấu ấn từ người sinh thành',
  'Phúc Đức': 'Lớp nền vô hình – độ dày phúc khí, đời sống tinh thần và cảm giác an tâm',
  'Điền Trạch': 'An cư mới lạc nghiệp – nhà cửa, tài sản bền và cảm giác ổn định lâu dài',
  'Quan Lộc': 'Bản đồ công danh – cách bạn làm nghề, lên vị trí và tạo uy tín trong xã hội',
  'Nô Bộc': 'Mạng lưới đồng hành – ai nâng bạn lên, ai dễ làm chậm bước',
  'Thiên Di': 'Cánh cửa bước ra ngoài – hình ảnh xã hội, cơ hội xa nhà và nhịp thích nghi',
  'Tật Ách': 'Sức khỏe là vốn quý – xu hướng thể chất, nhịp sống và điểm cần giữ từ sớm',
  'Tài Bạch': 'Dòng tiền nuôi mệnh – cách kiếm tiền, giữ tiền và tích lũy cho đường dài',
  'Tử Tức': 'Đường con cái và truyền thừa – nhịp duyên con, cách nuôi dạy và kết nối gia đình',
  'Phu Thê': 'Bức tranh hôn nhân – kiểu gắn bó, điểm dễ va chạm và cách đồng hành với nhau',
  'Huynh Đệ': 'Sợi dây huyết thống – mức độ gắn bó, hỗ trợ và ranh giới giữa tình và tiền',
};

// ===== TỔNG QUAN VẬN MỆNH THEO CHÍNH TINH TẠI MỆNH =====
export const MENH_TONG_QUAN = {
  'Tử Vi': {
    archetype: 'Người dẫn dắt (Hoàng Đế)',
    archetypeIcon: '👑',
    quote: '"Sinh ra đã mang khí chất của một người thủ lĩnh. Điều bạn cần tìm không phải là công việc, mà là một vương quốc để cai trị."',
    overview: 'Lá số này đi chắc khi bạn giữ đúng phần việc của mình, không ôm cả nhịp của người khác. Nhìn chung, tiền bạc không phải phần dễ từ đầu, nhưng lại là nơi có thể đổi nhịp rất nhanh nếu bạn chạm đúng nút.',
    strengths: ['Khả năng dẫn dắt xuất sắc', 'Tư duy bao quát', 'Lòng tự trọng rất cao'],
    secrets: ['Đôi khi có đơn vị không ai hiểu', 'Sợ bị làm mất mặt', 'Hay gồng gánh nhiều việc'],
    socialStyle: 'Rất có tiếng nói trong tổ chức, luôn là người phản xử hoặc ra quyết định cuối cùng.',
    stressResponse: 'Giữ vẻ mặt bình tĩnh, tự nhớt minh lại suy nghĩ tìm ra cách giải quyết thay vì than vãn.',
    careers: ['CEO/Giám đốc điều hành', 'Quản lý dự án', 'Chính trị gia', 'Kinh doanh tự do'],
    growth: ['Lắng nghe cấp dưới nhiều hơn', 'Bạn không cần mạnh mẽ ở mọi lúc', 'Hạ bớt tính bảo thủ'],
    diemManh: 'Lực mạnh nhất của bạn là giữ được đường dài và giữ được nhịp khi người khác đang dao động hoặc hoang.',
    diemCanCanh: 'Bạn chậm nhịp nhất khi ôm cả phần việc không còn là vai của mình. Điểm tới của bạn không phải yếu lực, mà là dễ ôm quá nhiều để giữ quyền chủ động.',
    nenChot: 'Nên thu gọn về một vai chính, bỏ phần việc đã thành gánh hộ và chỉ giữ thứ thật sự cần bạn đứng.',
  },
  'Thiên Cơ': {
    archetype: 'Quân sư mưu lược',
    archetypeIcon: '🧠',
    quote: '"Không phải người đi nhanh nhất sẽ thắng, mà là người đọc được bàn cờ từ đầu."',
    overview: 'Bạn sinh ra với tư duy phân tích sắc bén, luôn đi trước người khác 2-3 bước. Nhưng chính vì biết quá nhiều nên dễ rơi vào do dự – biết đường nào cũng có cái giá.',
    strengths: ['Trí tuệ phân tích xuất sắc', 'Tư duy chiến lược', 'Khả năng thích ứng cao'],
    secrets: ['Suy nghĩ quá nhiều dẫn đến do dự', 'Khó tin người hoàn toàn', 'Tâm trạng hay thay đổi'],
    socialStyle: 'Là người đứng sau cố vấn, ít khi ra mặt nhưng mọi quyết định quan trọng đều có bóng dáng bạn.',
    stressResponse: 'Rút vào im lặng, phân tích tình huống từ mọi góc, đôi khi overthink đến mất ngủ.',
    careers: ['Tư vấn chiến lược', 'Phân tích dữ liệu', 'Lập trình viên', 'Nghiên cứu khoa học'],
    growth: ['Hành động nhanh hơn thay vì phân tích thêm', 'Chấp nhận sai sót là một phần của hành trình', 'Học cách tin người'],
    diemManh: 'Đọc tình huống nhanh và chính xác, luôn có phương án B.',
    diemCanCanh: 'Hay bị kéo vào phân tích quá sâu mà quên hành động.',
    nenChot: 'Chọn MỘT hướng và đi cho đến cùng, thay vì ngồi phân tích thêm 5 lựa chọn.',
  },
  'Thái Dương': {
    archetype: 'Người chiếu sáng',
    archetypeIcon: '☀️',
    quote: '"Bạn sinh ra để tỏa sáng – nhưng nhớ rằng mặt trời cũng cần nghỉ ngơi khi về chiều."',
    overview: 'Bạn là người rộng rãi, hào sảng, luôn hướng ra bên ngoài. Tốt cho xã hội, tốt cho bạn bè – nhưng đôi khi quên chăm mình.',
    strengths: ['Hào sảng, nhiệt tình', 'Có uy tín xã hội', 'Thích giúp đỡ người khác'],
    secrets: ['Cho đi nhiều mà ít nhận lại', 'Dễ bị lợi dụng lòng tốt', 'Đôi khi kiệt sức vì ôm việc'],
    socialStyle: 'Luôn là tâm điểm nơi nào có mặt, dễ quen biết rộng.',
    stressResponse: 'Cố tỏ ra mạnh mẽ dù bên trong mệt mỏi.',
    careers: ['Giáo viên', 'Nhà ngoại giao', 'MC/Truyền thông', 'Quản lý cộng đồng'],
    growth: ['Học nói "không"', 'Dành thời gian cho bản thân', 'Đừng cố gánh cả thế giới'],
    diemManh: 'Khả năng tạo ảnh hưởng rộng, gây thiện cảm nhanh.',
    diemCanCanh: 'Hay quên bản thân vì lo cho người khác.',
    nenChot: 'Ưu tiên chính bạn trước khi cứu ai.',
  },
  'Vũ Khúc': {
    archetype: 'Chiến tướng quyết đoán',
    archetypeIcon: '⚔️',
    quote: '"Không cần đẹp đẽ – chỉ cần hiệu quả. Đó là triết lý sống của bạn."',
    overview: 'Bạn thẳng tính, quyết đoán, làm gì cũng hướng đến kết quả. Giỏi về tài chính nhưng đôi khi thiếu sự mềm mại trong quan hệ.',
    strengths: ['Quyết đoán, thẳng thắn', 'Giỏi quản lý tài chính', 'Không sợ thử thách'],
    secrets: ['Cô đơn trong quyết định', 'Thiếu kiên nhẫn với sự chậm trễ', 'Khó bày tỏ cảm xúc'],
    socialStyle: 'Ít nói nhưng khi nói thì đi thẳng vào vấn đề. Được tin cậy nhưng ít ai dám thân quá gần.',
    stressResponse: 'Bỏ qua cảm xúc, tập trung giải quyết vấn đề bằng hành động.',
    careers: ['Tài chính/Ngân hàng', 'Doanh nhân', 'Quản lý vận hành', 'Bất động sản'],
    growth: ['Học cách lắng nghe cảm xúc người khác', 'Chấp nhận không phải lúc nào cũng nhanh là tốt', 'Mềm mại hơn trong tình cảm'],
    diemManh: 'Hành động nhanh, dứt khoát, hiệu quả cao.',
    diemCanCanh: 'Đôi khi bạn quyết quá nhanh mà bỏ qua cảm xúc của người liên quan.',
    nenChot: 'Thêm 10 giây suy nghĩ trước mỗi quyết định quan trọng.',
  },
  'Thiên Đồng': {
    archetype: 'Đứa trẻ vĩnh cửu',
    archetypeIcon: '🌈',
    quote: '"Cuộc sống đẹp nhất khi bạn giữ được sự hồn nhiên giữa bao nhiêu phức tạp."',
    overview: 'Bạn yêu thích sự an nhàn, hòa thuận, không thích xung đột. Tâm hồn lạc quan nhưng đôi khi thiếu quyết đoán.',
    strengths: ['Hòa đồng, dễ mến', 'Tư duy lạc quan', 'Giỏi hưởng thụ cuộc sống'],
    secrets: ['Tránh né xung đột', 'Dễ bị ỷ lại', 'Lười thay đổi khi đã quen nhịp'],
    socialStyle: 'Ai cũng quý vì không bao giờ gây phiền, nhưng đôi khi bị coi là thiếu chính kiến.',
    stressResponse: 'Tìm cách trốn tránh hoặc chờ vấn đề tự qua đi.',
    careers: ['Nghệ sĩ/Sáng tạo', 'Giáo dục mầm non', 'Nhân viên xã hội', 'F&B/Du lịch'],
    growth: ['Đối mặt thay vì trốn tránh', 'Đặt mục tiêu rõ ràng', 'Tự đẩy mình ra khỏi vùng an toàn'],
    diemManh: 'Sự lạc quan bẩm sinh giúp bạn vượt qua khó khăn bằng năng lượng tích cực.',
    diemCanCanh: 'Dễ bỏ qua cơ hội vì sợ rời khỏi sự thoải mái.',
    nenChot: 'Chọn 1 thứ khó để làm mỗi tuần.',
  },
  'Liêm Trinh': {
    archetype: 'Kẻ lưỡng diện',
    archetypeIcon: '🎭',
    quote: '"Bạn có thể chơi nhiều vai trên sân khấu cuộc đời – quan trọng là đừng quên mình là ai."',
    overview: 'Vừa có tính quyền lực vừa đa tình, bạn dễ thành công nhưng cũng dễ sa vào cạm bẫy tình cảm. Khéo léo, tinh tế, biết cách xoay chuyển tình huống.',
    strengths: ['Linh hoạt, khéo léo', 'Quản lý giỏi', 'Đa năng, đa tài'],
    secrets: ['Dễ bị kéo vào tình cảm phức tạp', 'Luôn giữ bí mật', 'Đôi khi không trung thực với chính mình'],
    socialStyle: 'Biết cách giao tiếp để đạt mục đích, luôn giữ một khoảng cách an toàn.',
    stressResponse: 'Tìm cách kiểm soát tình huống ngầm, hiếm khi cho ai thấy mình đang khó khăn.',
    careers: ['Luật sư', 'Quản lý nhân sự', 'Chính trị', 'Nghệ thuật biểu diễn'],
    growth: ['Sống thật hơn với bản thân', 'Giảm bo cảm xúc phức tạp', 'Chọn đường thẳng thay vì đường vòng'],
    diemManh: 'Xoay chuyển tình huống bất kỳ nhờ sự tinh tế và nhạy bén.',
    diemCanCanh: 'Đôi khi chính sự khéo léo lại khiến người khác không tin.',
    nenChot: 'Đặt minh bạch lên đầu, dù khó hơn nhưng bền vững.',
  },
  'Thiên Phủ': {
    archetype: 'Vua ổn định',
    archetypeIcon: '🏛️',
    quote: '"Bạn không cần chạy nhanh – chỉ cần đi đúng đường và giữ vững nhịp."',
    overview: 'Bạn là mẫu người ổn định, đáng tin cậy, biết cách tích lũy. Cuộc sống thường suôn sẻ nếu biết kiên nhẫn.',
    strengths: ['Ổn định, đáng tin', 'Biết quản lý tài chính', 'Nhẹ nhàng, điềm tĩnh'],
    secrets: ['Sợ mất đi sự ổn định', 'Ngại mạo hiểm', 'Đôi khi quá thận trọng'],
    socialStyle: 'Là chỗ dựa cho mọi người, luôn toát lên vẻ tin cậy.',
    stressResponse: 'Giữ nền tảng, không hoảng, tìm cách giải quyết từ từ.',
    careers: ['Quản trị kinh doanh', 'Bất động sản', 'Tài chính cá nhân', 'Nông nghiệp'],
    growth: ['Chấp nhận rủi ro có tính toán', 'Đừng ngại thay đổi nhịp sống', 'Khám phá điều mới'],
    diemManh: 'Khả năng giữ vững nền tảng khi ai cũng dao động.',
    diemCanCanh: 'Quá an phận có thể bỏ lỡ cơ hội lớn.',
    nenChot: 'Mỗi năm thử 1 điều mới hoàn toàn ngoài vùng an toàn.',
  },
  'Thái Âm': {
    archetype: 'Ánh trăng dịu dàng',
    archetypeIcon: '🌙',
    quote: '"Sức mạnh thật sự nằm ở sự dịu dàng – bạn ảnh hưởng người khác mà không cần thị uy."',
    overview: 'Bạn nhạy cảm, có chiều sâu nội tâm, giỏi cảm nhận. Tốt cho nghệ thuật và tình cảm, nhưng dễ bị tổn thương.',
    strengths: ['Nhạy cảm, tinh tế', 'Trực giác tốt', 'Có chiều sâu nội tâm'],
    secrets: ['Dễ bị ảnh hưởng bởi cảm xúc', 'Hay suy nghĩ nhiều', 'Cần thời gian riêng'],
    socialStyle: 'Thu hút bằng sự dịu dàng, người khác tự tìm đến bạn.',
    stressResponse: 'Rút vào thế giới nội tâm, cần thời gian một mình.',
    careers: ['Nghệ thuật/Sáng tạo', 'Tâm lý học', 'Y tế/Chăm sóc', 'Thiết kế'],
    growth: ['Phát triển lớp vỏ bảo vệ', 'Đừng nhận cảm xúc người khác về mình', 'Cân bằng lý trí và cảm xúc'],
    diemManh: 'Đọc vị người khác cực kỳ chính xác nhờ trực giác.',
    diemCanCanh: 'Dễ bị dao động bởi năng lượng xung quanh.',
    nenChot: 'Xây dựng ranh giới cảm xúc rõ ràng.',
  },
  'Tham Lang': {
    archetype: 'Người đa diện',
    archetypeIcon: '🎪',
    quote: '"Bạn không phải chọn một con đường – bạn là người có thể đi cả trăm con đường."',
    overview: 'Đa tài, đa sắc, đa dục. Bạn hấp dẫn tự nhiên, biết cách tận hưởng cuộc sống, nhưng cần kiểm soát bản thân.',
    strengths: ['Đa tài, sáng tạo', 'Hấp dẫn xã hội', 'Thích ứng mọi hoàn cảnh'],
    secrets: ['Dễ bị phân tán', 'Ham muốn nhiều thứ cùng lúc', 'Khó kiên nhẫn lâu dài'],
    socialStyle: 'Là linh hồn của bữa tiệc, ai cũng muốn quen.',
    stressResponse: 'Tìm sự khuây khỏa ở thú vui, đôi khi quá đà.',
    careers: ['Giải trí/Media', 'Start-up', 'Ẩm thực/Nhà hàng', 'Du lịch/Khám phá'],
    growth: ['Tập trung vào 1-2 thứ chính', 'Kiên trì lâu hơn', 'Kiểm soát sự hưởng thụ'],
    diemManh: 'Khả năng tạo được cơ hội ở mọi nơi.',
    diemCanCanh: 'Thành công nhỏ nhiều nhưng thiếu đột phá lớn.',
    nenChot: 'Chọn 1 dự án lớn và đầu tư hết mình.',
  },
  'Cự Môn': {
    archetype: 'Người phản biện',
    archetypeIcon: '🔍',
    quote: '"Sự thật đôi khi đau – nhưng bạn là người không ngại nói ra."',
    overview: 'Bạn có tư duy phản biện sắc bén, hay đặt câu hỏi, khó bị lừa. Nhưng cũng dễ gây xung đột vì lối nói thẳng.',
    strengths: ['Tư duy phản biện tốt', 'Khó bị lừa', 'Kiên định quan điểm'],
    secrets: ['Dễ nghi ngờ người khác', 'Khó tin ai hoàn toàn', 'Bên trong cô đơn hơn vẻ ngoài'],
    socialStyle: 'Hay đặt câu hỏi, thách thức quan điểm, không dễ hòa nhập.',
    stressResponse: 'Phân tích và chất vấn, đôi khi gây căng thẳng thêm.',
    careers: ['Luật sư', 'Nhà báo điều tra', 'Kiểm toán viên', 'Nghiên cứu'],
    growth: ['Học cách tin tưởng có chọn lọc', 'Mềm mại hơn trong giao tiếp', 'Đừng nghi ngờ cả những người thân'],
    diemManh: 'Mắt nhìn thấu – phát hiện vấn đề mà người khác bỏ qua.',
    diemCanCanh: 'Lối nói thẳng đôi khi gây tổn thương không cần thiết.',
    nenChot: 'Thêm một lớp ngoại giao vào sự thẳng thắn.',
  },
  'Thiên Tướng': {
    archetype: 'Người hòa giải',
    archetypeIcon: '🏅',
    quote: '"Bạn là cầu nối – nơi nào có bạn, nơi đó có sự cân bằng."',
    overview: 'Bạn có phong cách chính trực, ngay thẳng, biết đứng ra giải quyết xung đột. Được nhiều người tin cậy.',
    strengths: ['Chính trực, đáng tin', 'Biết cân bằng các bên', 'Có trách nhiệm cao'],
    secrets: ['Hay gánh vác quá nhiều', 'Khó từ chối người khác', 'Lo lắng khi không kiểm soát được'],
    socialStyle: 'Là trọng tài trong mọi cuộc xung đột, ai cũng tìm đến.',
    stressResponse: 'Cố gắng giữ mọi thứ hài hòa dù bên trong rất căng.',
    careers: ['HR/Nhân sự', 'Luật sư hòa giải', 'Quản lý cộng đồng', 'Tư vấn'],
    growth: ['Học nói "không" đúng lúc', 'Chấp nhận không phải xung đột nào cũng cần bạn giải quyết', 'Dành thời gian cho bản thân'],
    diemManh: 'Uy tín tự nhiên – không cần cố mà người ta vẫn nghe.',
    diemCanCanh: 'Ôm quá nhiều vai giải quyết cho người khác.',
    nenChot: 'Chỉ can thiệp khi thật sự cần thiết.',
  },
  'Thiên Lương': {
    archetype: 'Hiền triết',
    archetypeIcon: '📖',
    quote: '"Bạn không tìm câu trả lời – bạn tìm câu hỏi đúng."',
    overview: 'Bạn có chiều sâu tâm linh, đạo đức, hay suy tư về ý nghĩa cuộc sống. Giàu lòng từ bi nhưng đôi khi quá lý tưởng.',
    strengths: ['Hiểu biết sâu rộng', 'Đạo đức cao', 'Trực giác tâm linh tốt'],
    secrets: ['Quá lý tưởng', 'Khó chấp nhận thực tế phũ phàng', 'Hay buồn khi thấy đời bất công'],
    socialStyle: 'Là người được tôn trọng vì sự chững chạc và hiểu biết.',
    stressResponse: 'Tìm về tâm linh, thiền định, hoặc đọc sách.',
    careers: ['Giáo dục', 'Y tế', 'Tâm linh/Thiền', 'Nghiên cứu triết học'],
    growth: ['Chấp nhận thế giới không hoàn hảo', 'Thực tế hơn trong kỳ vọng', 'Cho phép mình vui vẻ'],
    diemManh: 'Chiều sâu tâm hồn và khả năng truyền cảm hứng.',
    diemCanCanh: 'Đôi khi xa rời thực tế vì quá theo đuổi lý tưởng.',
    nenChot: 'Kết hợp lý tưởng với hành động thực tế.',
  },
  'Thất Sát': {
    archetype: 'Chiến binh cô độc',
    archetypeIcon: '🗡️',
    quote: '"Thất Sát cô cương, tướng quân xuất chinh. Bạn sinh ra để chinh phục – không phải để an nhàn."',
    overview: 'Bạn có ý chí sắt đá, không sợ khó khăn, dám đối đầu. Nhưng đường đi thường nhiều sóng gió, cần sự kiên trì.',
    strengths: ['Ý chí sắt đá', 'Dũng cảm, quyết liệt', 'Không sợ thất bại'],
    secrets: ['Cô đơn trên đường đi', 'Khó mở lòng', 'Bên trong mềm hơn vẻ ngoài'],
    socialStyle: 'Áp đảo tự nhiên, ít nói nhưng khi xuất hiện ai cũng chú ý.',
    stressResponse: 'Đối mặt trực diện, không chạy trốn nhưng đôi khi quá cứng.',
    careers: ['Quân đội/Công an', 'Doanh nhân startup', 'Thể thao chuyên nghiệp', 'Phẫu thuật'],
    growth: ['Mở lòng với người thân', 'Chấp nhận sự giúp đỡ', 'Không phải lúc nào cũng phải chiến đấu'],
    diemManh: 'Khả năng vượt qua nghịch cảnh phi thường.',
    diemCanCanh: 'Quá cứng đầu có thể phá vỡ các mối quan hệ.',
    nenChot: 'Vẫn giữ sự mạnh mẽ nhưng thêm sự mềm dẻo.',
  },
  'Phá Quân': {
    archetype: 'Kẻ phá bĩnh (Tiên phong)',
    archetypeIcon: '💥',
    quote: '"Bạn không phá hủy – bạn tái tạo. Mỗi lần đập bỏ là một lần xây mới."',
    overview: 'Bạn không chấp nhận nguyên trạng, luôn muốn thay đổi, đổi mới. Sáng tạo nhưng thiếu kiên nhẫn duy trì.',
    strengths: ['Sáng tạo, đổi mới', 'Dám phá vỡ khuôn khổ', 'Năng lượng mạnh mẽ'],
    secrets: ['Khó duy trì dài hạn', 'Dễ chán', 'Phá xong không biết xây gì'],
    socialStyle: 'Gây ấn tượng mạnh nhưng cũng dễ gây sốc.',
    stressResponse: 'Thay đổi mọi thứ xung quanh, đôi khi phá luôn cả những thứ tốt.',
    careers: ['Khởi nghiệp', 'Thiết kế/Kiến trúc', 'Cải cách xã hội', 'Marketing sáng tạo'],
    growth: ['Phá có kế hoạch thay vì phá ngẫu hứng', 'Xây lại cẩn thận sau khi phá', 'Kiên nhẫn hơn với quá trình'],
    diemManh: 'Khi cần thay đổi, bạn là người duy nhất dám hành động.',
    diemCanCanh: 'Đôi khi thay đổi chỉ vì chán, không phải vì cần.',
    nenChot: 'Phá có mục đích, xây có kế hoạch.',
  },
};

// Default fallback
export const DEFAULT_TONG_QUAN = {
  archetype: 'Người hành trình',
  archetypeIcon: '🌟',
  quote: '"Mỗi người một lá số, mỗi lá số một câu chuyện riêng."',
  overview: 'Lá số của bạn mang sự kết hợp đa dạng giữa các yếu tố. Cần nhìn tổng thể 12 cung để thấy bức tranh hoàn chỉnh.',
  strengths: ['Linh hoạt', 'Khả năng thích ứng', 'Tư duy đa chiều'],
  secrets: ['Đôi khi phân vân giữa nhiều hướng', 'Cần thời gian để hiểu rõ bản thân'],
  socialStyle: 'Tùy theo hoàn cảnh mà linh hoạt thay đổi phong cách.',
  stressResponse: 'Tìm cách cân bằng, ít khi phản ứng thái quá.',
  careers: ['Nhiều lựa chọn phù hợp', 'Nên tham khảo cung Quan Lộc'],
  growth: ['Tìm một hướng đi chính và tập trung vào đó'],
  diemManh: 'Tính linh hoạt là vũ khí lớn nhất.',
  diemCanCanh: 'Dễ phân tán nếu không có mục tiêu rõ.',
  nenChot: 'Xác định ưu tiên số 1 trong giai đoạn hiện tại.',
};

// ===== SỰ NGHIỆP & NGHỀ PHÙ HỢP =====
export const getCareerAnalysis = (quanLocData, menhData, chartData) => {
  const saoChinh = quanLocData?.saoChinh || [];
  const saoTot = quanLocData?.saoTot || [];
  const saoXau = quanLocData?.saoXau || [];
  const cleanStars = saoChinh.map(s => s.replace(/\s\([MVĐHB]\)$/, ''));
  
  const careerModels = {
    'Liêm Trinh': { model: 'Tự chủ cao', desc: 'Hợp tự quyết và tự xây nhịp riêng.' },
    'Tử Vi': { model: 'Lãnh đạo', desc: 'Hợp làm chủ hoặc giữ vai quản lý cao.' },
    'Thiên Cơ': { model: 'Tư vấn chiến lược', desc: 'Hợp phân tích, lên kế hoạch, tư vấn.' },
    'Vũ Khúc': { model: 'Kinh doanh', desc: 'Hợp tài chính, kinh doanh, quản lý dòng tiền.' },
    'Thái Dương': { model: 'Ngoại giao/Truyền thông', desc: 'Hợp đối ngoại, giảng dạy, truyền thông.' },
    'Thiên Đồng': { model: 'Sáng tạo/Dịch vụ', desc: 'Hợp nghệ thuật, dịch vụ, chăm sóc.' },
    'Tham Lang': { model: 'Đa ngành', desc: 'Hợp kinh doanh đa ngành, giải trí, marketing.' },
    'Cự Môn': { model: 'Pháp luật/Kiểm toán', desc: 'Hợp luật, kiểm toán, nghiên cứu.' },
    'Thiên Tướng': { model: 'Nhân sự/Quản lý', desc: 'Hợp quan hệ công chúng, nhân sự, điều phối.' },
    'Thiên Lương': { model: 'Giáo dục/Y tế', desc: 'Hợp giáo dục, y tế, tư vấn tâm lý.' },
    'Thất Sát': { model: 'Thực thi', desc: 'Hợp vị trí cần quyết đoán, hành động nhanh.' },
    'Phá Quân': { model: 'Đổi mới/Khởi nghiệp', desc: 'Hợp startup, cải cách, sáng tạo.' },
    'Thiên Phủ': { model: 'Quản trị ổn định', desc: 'Hợp quản trị, bất động sản, tích lũy.' },
    'Thái Âm': { model: 'Nghệ thuật/Thiết kế', desc: 'Hợp sáng tạo, mỹ thuật, chăm sóc.' },
  };

  const topStar = cleanStars[0] || '';
  const career = careerModels[topStar] || { model: 'Linh hoạt', desc: 'Cung Quan Lộc vô chính diệu, nên sự nghiệp thường mượn hướng từ cung Phu Thê hoặc dựa vào dòng đời xô đẩy.' };

  // Generate logical dynamic text based on Combinatorics
  let diemManh = "Sự nghiệp phát triển đều đặn nhờ năng lực cốt lõi bề vững. Làm việc có độ tin cậy cao.";
  let diemCanGiu = "Chưa có rủi ro lớn hiện diện trên cung này, nhưng cần tự nhắc nhở tránh sự tự mãn khi công việc thái bình.";
  let nuocDi = "Duy trì nhịp làm việc hiện tại, mở rộng mối quan hệ và luôn có kế hoạch dự phòng.";
  let subline = "Sự nghiệp là nơi phản chiếu cách bạn làm việc và tạo giá trị thực tế ra xã hội.";
  
  if (['Tử Vi', 'Thiên Phủ', 'Thái Dương', 'Vũ Khúc'].includes(topStar)) {
     subline = "Lá số được sinh ra để đứng ở vị trí dẫn dắt hoặc tỏa sáng, không hợp với việc lùi lại phía sau chịu sự kìm kẹp.";
  } else if (['Thất Sát', 'Phá Quân', 'Tham Lang'].includes(topStar)) {
     subline = "Đường nghề nghiệp mang tính hành động rất mạnh, thường trải qua nhiều biến động và chỉ bật lên nhờ sự đột phá táo bạo.";
  } else if (!topStar) {
     subline = "Cung Quan không có chính tinh. Sự nghiệp tuy có bề chông chênh lúc đầu nhưng lại rất linh hoạt, uyển chuyển đổi nghề liên tục.";
  }

  const textTot = saoTot.map(s => s.replace(/^L\./, ''));
  const textXau = saoXau.map(s => s.replace(/^L\./, ''));

  if (textTot.includes('Hóa Quyền')) {
    diemManh = "Càng được nắm quyền tự quyết và quản lý, sự nghiệp càng thăng tiến mạnh. Lực bật lớn khi được giao trọng trách.";
  } else if (textTot.includes('Thiên Khôi') || textTot.includes('Thiên Việt')) {
    diemManh = "Đường nghề có quý nhân lớn nâng đỡ. Dù gặp khó khăn luôn có cấp trên giang tay kéo lên lúc then chốt.";
  } else if (textTot.includes('Văn Xương') || textTot.includes('Văn Khúc')) {
    diemManh = "Lợi thế tuyệt đối trong học thuật, làm giấy tờ, hợp đồng, truyền thông hoặc nghệ thuật. Bằng cấp rất có giá trị thực dụng.";
  }

  if (textXau.includes('Địa Không') || textXau.includes('Địa Kiếp')) {
    diemCanGiu = "Nguy cơ 'cháy túi' hoặc mất trắng sự nghiệp nếu mạo hiểm làm liều, đầu tư bạo tay không có cơ sở bảo kê.";
    nuocDi = "Phải thắt chặt quản lý rủi ro. Tuyệt đối không 'tất tay' ngẫu hứng vào những dự án mình không phải là người nắm cán.";
  } else if (textXau.includes('Kình Dương') || textXau.includes('Đà La')) {
    diemCanGiu = "Hay gặp thị phi, cản trở ngầm từ đồng nghiệp hoặc tự làm gãy đổ sự nghiệp do tính nóng nảy, cố chấp.";
    nuocDi = "Cần mềm mỏng ngoại giao hơn chốn công sở, tránh phô trương tài năng lộ liễu để tiểu nhân không có cớ chọc phá.";
  } else if (textXau.includes('Tuần') || textXau.includes('Triệt')) {
    diemCanGiu = "Tuổi trẻ (trước 30) chật vật lập nghiệp, hay phải đổi việc hoặc bị lỡ dở giữa chừng con đường. Mọi thứ thường bị nghẽn ở nút thắt cuối.";
    nuocDi = "Giữ tâm lý kiên nhẫn. Sự nghiệp thực sự nở hoa rực rỡ và vững chắc mọc rễ khi qua tuổi băm (30+).";
  }

  // Brightness analysis
  const brightnessTags = saoChinh.map(s => {
    const match = s.match(/\(([MVĐHB])\)$/);
    return match ? match[1] : null;
  }).filter(Boolean);
  const isVuong = brightnessTags.some(b => ['M', 'V', 'Đ'].includes(b));

  return {
    stars: saoChinh,
    cleanStars,
    model: career.model,
    modelDesc: career.desc,
    isStrong: isVuong,
    headline: topStar ? `Chính tinh ${topStar} định hình bản sắc nghề nghiệp.` : 'Sự nghiệp chuyển đổi linh hoạt đa hình.',
    subline,
    diemManhNghe: diemManh,
    diemCanGiu: diemCanGiu,
    nuocDi: nuocDi,
  };
};

// ===== TÌNH DUYÊN =====
export const getLoveAnalysis = (phuTheData, menhData, chartData) => {
  const saoChinh = phuTheData?.saoChinh || [];
  const saoTot = phuTheData?.saoTot || [];
  const saoXau = phuTheData?.saoXau || [];
  const cleanStars = saoChinh.map(s => s.replace(/\s\([MVĐHB]\)$/, ''));
  const topStar = cleanStars[0] || '';

  const loveProfiles = {
    'Tham Lang': { status: 'Duyên đa tình', headline: 'Duyên đến chậm không phải để lỡ, mà để lọc người sai trước khi gặp người đúng.' },
    'Thiên Cơ': { status: 'Duyên tinh tế', headline: 'Chọn người hiểu cái nết của mình quan trọng hơn vạn lời thề non hẹn biển.' },
    'Tử Vi': { status: 'Duyên cao', headline: 'Yêu thì chọn kén, kết giao với người ngang tầm hoặc xuất chúng hơn bộ quy chuẩn của mình.' },
    'Thiên Đồng': { status: 'Duyên trẻ con', headline: 'Tình yêu tìm kiếm sự hồn nhiên, vui vẻ, không dính líu đến tranh giành mệt mỏi.' },
    'Vũ Khúc': { status: 'Duyên muộn', headline: 'Vũ Khúc cô quả, tiền bạc ổn định tình duyên mới thực sự viên mãn thăng hoa.' },
    'Thái Dương': { status: 'Duyên rộng rực rỡ', headline: 'Bề ngoài hào nhoáng, thích sự cho đi, nhưng có khi lóa mắt chọn lầm đối tượng.' },
    'Thái Âm': { status: 'Duyên sâu kín', headline: 'Yêu chuộng sự nhẹ nhàng lãng mạn, nhạy cảm cần sự chở che thấu hiểu vô ngôn.' },
    'Cự Môn': { status: 'Duyên khắc khẩu', headline: 'Vợ chồng hay bất đồng quan điểm, cần hạ cái tôi xuống mới giữ được nhà.' },
    'Thất Sát': { status: 'Duyên chớp nhoáng', headline: 'Yêu nhanh, cưới vội, tình cảm đứt rễ hay mặn nồng đều phụ thuộc vào cách nhường nhịn.' },
    'Thiên Lương': { status: 'Duyên tiền định', headline: 'Lấy người đôi khi lớn tuổi hơn, có thể lo toan cho mình như một người thầy.' },
  };

  const profile = loveProfiles[topStar] || { status: 'Duyên tùy thời', headline: 'Tình duyên chịu ảnh hưởng từ tam hợp, nên học cách chủ động tạo cơ hội.' };

  // Logic kết hợp Phụ tinh
  let diemHop = "Tình yêu đến từ sự đồng điệu tự nhiên, biết nhường nhịn và đồng hành lớn lên cùng nhau.";
  let deLechNhip = "Dễ nhạt nhòa nếu thiếu sự hâm nóng thường xuyên từ hai phía, yêu theo kiểu trả bài rập khuôn.";
  let nguyenTac = "Duy trì giao tiếp chân thành và chia sẻ kỳ vọng ngay từ đầu để không sinh thất vọng ẩn.";

  const textTot = saoTot.map(s => s.replace(/^L\./, ''));
  const textXau = saoXau.map(s => s.replace(/^L\./, ''));

  if (textTot.includes('Đào Hoa') || textTot.includes('Hồng Loan')) {
    diemHop = "Sức hút người khác giới bẩm sinh cực kỳ cao, tình duyên đến rất gắt và rực rỡ, đi đâu cũng có ánh nhìn theo.";
  } else if (textTot.includes('Ân Quang') || textTot.includes('Thiên Quý')) {
    diemHop = "Vợ chồng đến với nhau vì 'cái ân cái nghĩa' sâu nặng. Lấy nhau rồi gia đạo rất hạnh phúc, thủy chung bảo bọc.";
  } else if (textTot.includes('Hóa Lộc')) {
    diemHop = "Vợ/chồng mang lại dòng tiền rất tốt, kết hôn xong thì vượng lộc, làm ăn khấm khá lên trông thấy.";
  }

  if (textXau.includes('Cô Thần') || textXau.includes('Quả Tú')) {
    deLechNhip = "Cung phu thê có Cô – Quả, bên trong luôn có một cảm giác cô độc vô hình. Dù ở cạnh nhau đôi khi vẫn thấy người kia không hiểu thấu lòng mình.";
    nguyenTac = "Tuyệt đối không nên cưới quá sớm (trước 28-30). Đừng ép đối phương phải tự đọc được mọi suy nghĩ của mình.";
  } else if (textXau.includes('Đà La') || textXau.includes('Hóa Kỵ')) {
    deLechNhip = "Hay xảy ra chiến tranh lạnh, khắc khẩu cộc cằn, nghi ngờ vô cớ. Tình cảm dễ bị bên thứ ba hoặc lời đồn đại bên ngoài làm chao đảo.";
    nguyenTac = "Phải tập thói quen nói thẳng vấn đề ra. Miệng có Hóa Kỵ thì nên kiềm lời chê bai bạn đời.";
  }
  
  // Tuần Triệt logic
  if (textXau.includes('Tuần') || textXau.includes('Triệt')) {
    profile.status = "Duyên trắc trở ban đầu";
    profile.headline = "Tuần/Triệt đóng cung Phu Thê: tình duyên đoạn đầu dễ muộn màng lỡ dở, phải trải qua vấp ngã vỡ mộng mới gắn kết bền lâu.";
    nguyenTac = "Cưới muộn hẳn, hoặc kết duyên với người đã qua một lần đò, sống xa quê, yêu xa sẽ hóa giải được phần lớn nghịch cảnh đổ vỡ.";
  }

  return {
    stars: saoChinh,
    cleanStars,
    status: profile.status,
    headline: profile.headline,
    diemHop: diemHop,
    deLechNhip: deLechNhip,
    nguyenTac: nguyenTac,
  };
};

// ===== TÀI LỘC =====
export const getWealthAnalysis = (taiBachData, menhData, chartData) => {
  const saoChinh = taiBachData?.saoChinh || [];
  const saoTot = taiBachData?.saoTot || [];
  const saoXau = taiBachData?.saoXau || [];
  const cleanStars = saoChinh.map(s => s.replace(/\s\([MVĐHB]\)$/, ''));
  const topStar = cleanStars[0] || '';

  const brightnessTags = saoChinh.map(s => {
    const match = s.match(/\(([MVĐHB])\)$/);
    return match ? match[1] : null;
  }).filter(Boolean);
  const isStrong = brightnessTags.some(b => ['M', 'V', 'Đ'].includes(b));

  let nguonThu = topStar ? `${topStar} Khởi Tài` : 'Linh hoạt sinh lời';
  let nguonThuDesc = "Thu nhập phụ thuộc vào cách bạn sử dụng thế mạnh cốt lõi làm bàn đạp.";
  let diemRo = "Chưa có nguy cơ lớn nếu giữ thói quen quản lý chi tiêu rạch ròi, không cho vay vô cớ.";
  let nhipGiu = "Tích lũy đều đặn";
  let nhipGiuDesc = "Cam kết chia tỷ lệ thu và giữ một cách an toàn, tránh vung tay sắm sửa cảm xúc.";

  if (['Vũ Khúc', 'Thiên Phủ', 'Thái Âm'].includes(topStar)) {
    nguonThuDesc = "Đây là các sao cực vượng cho Tài Bạch, chủ về tích lũy điền sản lớn, đầu tư làm ăn chắc chắn ăn chắc mặc bền.";
  } else if (['Tham Lang', 'Thất Sát', 'Phá Quân'].includes(topStar)) {
    nguonThuDesc = "Kiếm tiền mang tính chớp nhoáng, dám nghĩ dám bạo chi đầu tư. Thường giàu nhanh lên nhờ các phi vụ có biên độ mạo hiểm cao.";
  } else if (!topStar) {
    nguonThuDesc = "Tài Bạch Vô Chính Diệu: Lộc tài bất định, nên kiếm tiền theo hướng linh hoạt, lúc lùi lúc tiến, không nên đóng đinh vào một nguồn.";
  }

  const textTot = saoTot.map(s => s.replace(/^L\./, ''));
  const textXau = saoXau.map(s => s.replace(/^L\./, ''));

  if (textTot.includes('Lộc Tồn')) {
    nhipGiu = "Kho Lộc Trời Cho";
    nhipGiuDesc = "Có Lộc Tồn tại Tài Bạch kiếm tiền vô cùng cẩn trọng, giữ tiền bo bo. Tích tiểu thành đại, lộc tới tự nhiên khi khó khăn sẽ được quý nhân đưa tay độ tiền.";
  } else if (textTot.includes('Hóa Lộc')) {
    nhipGiu = "Lộc luân chuyển";
    nhipGiuDesc = "Sinh tài cực nhạy. Tiền vào nhanh ra nhanh qua luân chuyển kinh thương. Đừng để tiền đứng im, hãy quy đổi thành tài sản có giá.";
  }

  if (textXau.includes('Đại Hao') || textXau.includes('Tiểu Hao')) {
    diemRo = "Song Hao tại Tài Bạch có tính 'tán tài'. Tức là tiền làm mười đồng thì hao đi sáu bảy đồng cho việc vặt viển hoặc bị bạn bè vây mượn không trả.";
  } else if (textXau.includes('Địa Không') || textXau.includes('Địa Kiếp')) {
    diemRo = "Máu mạo hiểm đỏ đen lấn át, cực kỳ nguy hiểm nếu tự mình vung tiền đầu tư sốc. 'Tiền vào cửa trước, lọt vọt ra cửa sau' nếu mất bình tĩnh.";
    nhipGiuDesc = "Tiền tươi thóc thật là trên hết. Không tham lãi suất ảo.";
  } else if (textXau.includes('Thiên Không')) {
    diemRo = "Nguy cơ 'tay trắng lại về tay trắng' nếu tự phụ và tính toán mưu sâu kế hiểm lừa người trục lợi.";
  }

  return {
    stars: saoChinh,
    cleanStars,
    isStrong,
    headline: isStrong ? 'Tài tinh sáng sủa, độ nảy số và xoay vòng lộc tốt' : 'Tài vận biến hóa, cần nắm thế chủ động giữ tài',
    subline: isStrong ? 'Dòng vốn mạnh thì cơ hội đẻ thêm cơ hội. Không để tiền chết.' : 'Đường tài chính cần sự nhẫn nại, kỷ luật thép trong quản trị rủi ro đa tầng.',
    nguonThu: nguonThu,
    nguonThuDesc: nguonThuDesc,
    diemRo: diemRo,
    nhipGiu: nhipGiu,
    nhipGiuDesc: nhipGiuDesc,
  };
};

// ===== SỨC KHỎE =====
export const getHealthAnalysis = (tatAchData, menhData, chartData) => {
  const saoChinh = tatAchData?.saoChinh || [];
  const saoTot = tatAchData?.saoTot || [];
  const saoXau = tatAchData?.saoXau || [];
  const cleanStars = saoChinh.map(s => s.replace(/\s\([MVĐHB]\)$/, ''));
  const topStar = cleanStars[0] || '';

  const healthProfiles = {
    'Thiên Đồng': { theKhi: 'Đề kháng kém', coQuan: 'Hệ tiêu hóa, Thận', stress: 'Tự biên tự diễn âu lo' },
    'Tử Vi': { theKhi: 'Thể tạng tốt', coQuan: 'Tỳ vị, Ruột', stress: 'Áp lực gánh vác, đau đầu' },
    'Thiên Cơ': { theKhi: 'Khí huyết yếu', coQuan: 'Gan & Hệ Thần kinh', stress: 'Overthinking liên miên' },
    'Vũ Khúc': { theKhi: 'Cơ địa cứng cáp', coQuan: 'Khí quản, Phổi, Xương khớp', stress: 'Làm việc bạt mạng' },
    'Thái Dương': { theKhi: 'Hỏa vượng', coQuan: 'Mắt, Máu huyết tim mạch', stress: 'Căng thẳng nội tâm vì sĩ diện' },
    'Liêm Trinh': { theKhi: 'Nóng trong sinh tật', coQuan: 'Tim, Đường huyết', stress: 'Cảm xúc dồn nén cao độ' },
    'Thái Âm': { theKhi: 'Hàn khí nhiều', coQuan: 'Nội tiết tố, Thận âm', stress: 'Nhạy cảm quá mức' },
  };

  const profile = healthProfiles[topStar] || { theKhi: 'Nhịp tim sinh học', coQuan: 'Các bệnh vặt giao mùa', stress: 'Thói quen sinh hoạt bất định' };

  let noiCanCanhDesc = "Cần duy trì lối sống lành mạnh, ăn ngủ khoa học.";
  let lichGiuDesc = "Chăm tập thể thao và nghe ngóng tín hiệu cơ thể.";
  let cuaHoiLai = "Đề kháng tự nhiên";
  let cuaHoiLaiDesc = "Ăn uống đủ chất, giữ tâm thái lạc quan và ngủ đủ giấc.";

  const textTot = saoTot.map(s => s.replace(/^L\./, ''));
  const textXau = saoXau.map(s => s.replace(/^L\./, ''));

  if (textXau.includes('Tuần') || textXau.includes('Triệt')) {
    cuaHoiLai = "Được cứu giải thần kỳ";
    cuaHoiLaiDesc = "Người có Tuần Triệt ở Tật Ách bệnh hay phát lắt nhắt, nhưng ngộ nhỡ gặp tai ách lớn thường tai qua nạn khỏi một cách siêu việt.";
  } else if (textTot.includes('Thiên Y') || textTot.includes('Thiên Giải')) {
    cuaHoiLai = "Thầy giỏi thuốc tiên";
    cuaHoiLaiDesc = "Cứ lúc lâm bệnh thì gặp được đúng thầy đúng thuốc, họa lớn hóa nhỏ, họa nhỏ hóa không.";
  }

  if (textXau.includes('Thiên Hình') || textXau.includes('Kình Dương')) {
    noiCanCanhDesc = "Thân thể dễ bị tì vết, sẹo mổ, hoặc phải nhờ cậy can thiệp dao kéo phẫu thuật khi đi khám.";
  } else if (textXau.includes('Đà La') || textXau.includes('Hóa Kỵ')) {
    noiCanCanhDesc = "Bệnh hay mang tính âm ỉ khó trị dứt, chữa bác sĩ này lại chạy qua bác sĩ kia kéo dài.";
    lichGiuDesc = "Tuyệt đối không để uất khí tích tụ, phải tìm cách xả hết bực bội trong lòng ra hướng khác.";
  } else if (textXau.includes('Linh Tinh') || textXau.includes('Hỏa Tinh')) {
    noiCanCanhDesc = "Đề phòng các bệnh hệ thần kinh phát hỏa, căng thẳng dây thép, bệnh phát tiết ra ban đỏ.";
  }

  return {
    stars: saoChinh,
    cleanStars,
    headline: topStar ? `Sao ${topStar} thủ cung Ách: Chú trọng điều tiết thể khí.` : 'Tật Ách dung hòa, lấy nếp sống tự nhiên làm gốc.',
    subline: 'Sức khỏe là cột trụ số một. Không có vốn này, mọi kế hoạch sự nghiệp cũng gãy đổ.',
    theKhi: profile.theKhi,
    coQuan: profile.coQuan,
    stress: profile.stress,
    noiCanCanh: 'Khu vực nhạy bén',
    noiCanCanhDesc: noiCanCanhDesc,
    lichGiu: 'Kỷ luật Thân Hỏa',
    lichGiuDesc: lichGiuDesc,
    cuaHoiLai: cuaHoiLai,
    cuaHoiLaiDesc: cuaHoiLaiDesc,
  };
};

// ===== HELPER: Get main star from a cung =====
export const getMainStar = (cung) => {
  if (!cung || !cung.saoChinh || cung.saoChinh.length === 0) return null;
  const first = cung.saoChinh[0];
  return first.replace(/\s\([MVĐHB]\)$/, '');
};

// ===== HELPER: Get brightness tags for display =====
export const getStarBrightnessTags = (saoChinh) => {
  if (!saoChinh) return [];
  return saoChinh.map(s => {
    const match = s.match(/^(.+?)\s\(([MVĐHB])\)$/);
    if (match) {
      const brightnessMap = { 'M': 'Miếu', 'V': 'Vượng', 'Đ': 'Đắc', 'H': 'Hãm', 'B': 'Bình' };
      return { name: match[1], brightness: match[2], label: brightnessMap[match[2]] || match[2] };
    }
    return { name: s, brightness: null, label: null };
  });
};
// ===== QUÝ NHÂN PHÙ HỘ =====
export const getQuyNhanAnalysis = (foundQuyNhan = []) => {
  const contexts = {
    'Thiên Khôi': {
      place: 'Môi trường học thuật, cơ quan công quyền, hoặc các buổi lễ trang trọng.',
      event: 'Khi bạn tham gia thi cử, ứng tuyển vị trí cao, hoặc đứng trước các quyết định pháp lý quan trọng.',
      person: 'Người có quyền thế, bậc trưởng thượng, hoặc chuyên gia đầu ngành.'
    },
    'Thiên Việt': {
      place: 'Văn phòng cấp cao, các cuộc thi tài năng, hoặc những nơi đòi hỏi sự tinh tế.',
      event: 'Khi bạn cần sự đề bạt, tìm kiếm người dẫn dắt (mentor), hoặc tham gia các dự án mang tính đột phá.',
      person: 'Người có tầm nhìn, quý bà/quý ông thanh lịch, hoặc người có khả năng nhìn thấu tiềm năng của bạn.'
    },
    'Văn Xương': {
      place: 'Thư viện, nhà sách, các sự kiện văn hóa nghệ thuật, hoặc môi trường truyền thông.',
      event: 'Khi bạn công bố tác phẩm, làm việc liên quan đến giấy tờ/hợp đồng, hoặc tham gia các khóa học chuyên sâu.',
      person: 'Nhà báo, nghệ sĩ, những người làm công tác nghiên cứu hoặc sáng tạo.'
    },
    'Văn Khúc': {
      place: 'Phòng tranh, sân khấu, các hội nhóm sáng tạo online, hoặc những không gian nghệ thuật đương đại.',
      event: 'Khi bạn cần ý tưởng mới, tham gia các hoạt động giải trí, hoặc thể hiện bản sắc cá nhân.',
      person: 'Người có tâm hồn nghệ sĩ, người giỏi giao tiếp, hoặc những người truyền cảm hứng bằng cảm xúc.'
    },
    'Tả Phù': {
      place: 'Môi trường làm việc nhóm, các tổ chức thiện nguyện, hoặc các câu lạc bộ sở thích.',
      event: 'Khi bạn khởi động dự án chung, cần người san sẻ gánh nặng, hoặc tham gia các hoạt động cộng đồng.',
      person: 'Đồng nghiệp tận tâm, bạn bè chí cốt, hoặc những người sẵn sàng hành động cùng bạn.'
    },
    'Hữu Bật': {
      place: 'Các buổi networking, sự kiện xã hội, hoặc môi trường có tính tương tác cao.',
      event: 'Khi bạn gặp rắc rối cần sự dàn xếp, tìm kiếm nguồn lực bổ sung, hoặc cần người ủng hộ ý kiến.',
      person: 'Những người khéo léo trong quan hệ, trợ lý đắc lực, hoặc người có mạng lưới kết nối rộng.'
    },
    'Lộc Tồn': {
      place: 'Ngân hàng, sàn giao dịch, các hội thảo đầu tư, hoặc môi trường kinh doanh truyền thống.',
      event: 'Khi bạn thương thảo hợp đồng tài chính, tìm kiếm vốn, hoặc đầu tư vào tài sản bền vững.',
      person: 'Nhà đầu tư kín tiếng, người quản lý tài chính, hoặc bậc tiền bối giàu kinh nghiệm về tiền bạc.'
    },
    'Thiên Mã': {
      place: 'Sân bay, nhà ga, môi trường công nghệ số, hoặc các dự án hợp tác quốc tế.',
      event: 'Khi bạn đi công tác xa, thay đổi nơi ở/nơi làm việc, hoặc mở rộng thị trường sang vùng đất mới.',
      person: 'Người đi nhiều biết rộng, đối tác ở xa, hoặc những người giỏi về vận tải và công nghệ.'
    }
  };

  const detailedAnalysis = foundQuyNhan.map(star => ({
    star,
    ...contexts[star]
  })).filter(item => item.place);

  return {
    totalCount: foundQuyNhan.length,
    details: detailedAnalysis,
    headline: foundQuyNhan.length >= 4 ? "Lá số được 'Quần thần khánh hội', đi đâu cũng có người giúp." : "Quý nhân xuất hiện đúng lúc, đúng chỗ khi bạn nỗ lực.",
    activation: "Để kích hoạt Quý nhân, bạn cần sự chủ động kết nối và lòng biết ơn chân thành. Quý nhân chỉ giúp người tự giúp mình."
  };
};
