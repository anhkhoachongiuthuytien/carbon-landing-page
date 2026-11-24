# KRONOS · C6 — Xưởng Chế Tác Siêu Vật Liệu Nguyên Tử & Đồng Hồ Tourbillon

Landing page tương tác tốc độ cao lấy cảm hứng từ **Nguyên tố số 06 (Carbon)** — trình diễn đồ họa 3D thời gian thực, vật lý đàn hồi mạng tinh thể, hiệu ứng thị giác đa tầng và tổng hợp âm thanh cơ khí bằng Web Audio API thuần (Zero-dependency Vanilla HTML/CSS/JS).

🔗 **Trải nghiệm trực tiếp (GitHub Pages):** [https://anhkhoachongiuthuytien.github.io/carbon-landing-page/](https://anhkhoachongiuthuytien.github.io/carbon-landing-page/)

---

## Điểm nhấn Hiệu ứng & Tương tác

1. **Sân khấu Biến hình Thù hình 3D & Tourbillon (`#hero-3d-canvas`)**
   - Chuyển pha mượt theo vật lý lò xo 3D giữa 4 cấu trúc tinh thể thực của Carbon: **Quả cầu $C_{60}$ Buckminsterfullerene** (60 đỉnh icosahedron cụt, 90 liên kết), **Tinh thể Kim cương $sp^3$**, **Màng sóng Dirac Graphene 2D** và **Ống Nano Carbon xoắn (CNT)**, bao quanh lồng hồi chuyển Tourbillon 3 trục.
   - Hỗ trợ kéo xoay quỹ đạo 3D theo quán tính và kích nổ **Xung nhiệt 3.550K**.

2. **Scrollytelling Nén Áp Suất 12 GPa (`#pressure-journey`)**
   - Khung nhìn sticky `330vh` nội suy liên tục theo tiến trình cuộn trang qua 4 pha vật chất: *Tinh vân Sao Đỏ → Sợi Carbon Rèn 72 lớp NTPT → Màng đơn nguyên tử Graphene → Tinh thể Kim cương Lonsdaleite*, đồng bộ thông số áp suất, nhiệt độ và độ cứng Mohs.

3. **Phòng Thí Nghiệm Màng Đàn Hồi Graphene 2D (`#graphene-lab`)**
   - Mô phỏng định luật Hooke trên lưới tổ ong lục giác thời gian thực với 3 chế độ: *Gợn sóng từ trường*, *Kéo giãn liên kết nguyên tử* và *Xung chấn nhiệt*, cho phép tinh chỉnh độ cứng $\sigma$, hệ số duy trì dao động và bán kính trường lực.

4. **Giải Phẫu Cơ Khí 5 Tầng Không Gian 3D (`#exploded-calibre`)**
   - Ngăn xếp isometric `preserve-3d` tương tác theo góc nghiêng chuột, thanh trượt độ tách lớp `0% – 100%` và chọn lọc thông số micron từng cụm linh kiện.

5. **Thấu Kính Quang Học X-Ray 10x (`#xray-loupe-section`)**
   - Kính lúp cắt lớp mượt theo tọa độ con trỏ/cảm ứng soi xuyên qua vỏ Carbon rèn để lộ bản vẽ kỹ thuật CAD phát quang bên trong bộ máy, kèm thẻ Bento phản quang dị hướng (Anisotropic Glare).

6. **Bàn Đo Dao Động Cơ Học & Âm Thanh Bộ Thoát (`#chrono-bench`)**
   - Mô phỏng bánh lắc, dây tóc Silicon-Graphene co giãn và máy đo sóng âm Timing Machine ở 4 dải tần (`18,000` → `72,000 vph`), đồng bộ tiếng tích tắc tổng hợp trực tiếp qua **Web Audio API**.

7. **Xưởng Khắc Laser & Thẻ Chứng Thư Hologram 3D (`#bespoke-forge`)**
   - Tùy biến phiên bản vật liệu, khắc tên chủ nhân thời gian thực lên phôi thẻ Carbon Hologram 3D nghiêng theo chuột và hiệu ứng mưa tia lửa laser khi khởi tạo chứng thư.

## Chạy cục bộ

Mở trực tiếp `index.html` hoặc khởi chạy bất kỳ static server nào:

```bash
cd carbon-landing-page
python -m http.server 8765
```
