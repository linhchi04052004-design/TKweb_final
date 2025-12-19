document.addEventListener('DOMContentLoaded', function() {

    const DANH_SACH_ANH = [
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
        "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80",
        "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80",
        "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=600&q=80",
        "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80",
        "https://images.unsplash.com/photo-1558985250-27a406d64cb3?w=600&q=80"
    ];

    // --- TÍNH TOÁN KÍCH THƯỚC (GIỮ NGUYÊN) ---
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const pageWidth = Math.floor(screenWidth * 0.43);
    const pageHeight = Math.floor(screenHeight * 0.60);

    const bookContainer = document.getElementById('book');
    const REPEAT_TIMES = 10;
    let htmlContent = "";

    // --- TẠO HTML ---
    // Mẹo nhỏ: Để ảnh không bị méo khi lật, ta thêm CSS inline cho ảnh
    for (let i = 0; i < REPEAT_TIMES; i++) {
        DANH_SACH_ANH.forEach(imgUrl => {
            htmlContent += `
                <div class="page" style="background-color: #fdfdfd;">
                    <div class="page-content" style="width: 100%; height: 100%; overflow: hidden;">
                        <img src="${imgUrl}" alt="Menu" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>
            `;
        });
    }
    bookContainer.innerHTML = htmlContent;

    // --- CẤU HÌNH HIỆU ỨNG (QUAN TRỌNG) ---
    const pageFlip = new St.PageFlip(bookContainer, {
        width: pageWidth,
        height: pageHeight,
        
        // Cấu hình vật lý cho giống giấy 
        size: "fixed",
        usePortrait: false,
        showCover: false,      // Bật bìa lên để trang đầu có độ dày đẹp hơn
        
        // Tinh chỉnh hiệu ứng Visual
        minWidth: 300,        // Độ rộng tối thiểu để không bị vỡ layout
        maxWidth: 1000,
        minHeight: 400,
        
        maxShadowOpacity: 0.2, // 
        showPageCorners: true, // Hiển thị góc cong để gợi ý người dùng lật
        flippingTime: 1200,     // Tốc độ 800ms: Nhanh và dứt khoát như lật tay
        
        // Cho phép dùng chuột kéo thả (quan trọng để tạo cảm giác thực)
        useMouseEvents: true, 
        swipeDistance: 30,    // Khoảng cách vuốt để lật
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    // --- XỬ LÝ AUTO PLAY THÔNG MINH ---
    // Tự động lật, NHƯNG nếu người dùng đang xem (di chuột vào) thì dừng lại
    
    let autoPlayInterval;
    let isUserInteracting = false;

    // Hàm bắt đầu chạy
    const startAutoPlay = () => {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        
        autoPlayInterval = setInterval(() => {
            if (isUserInteracting) return; // Nếu đang tương tác thì bỏ qua lượt này

            // Logic lặp vô tận
            if (pageFlip.getCurrentPageIndex() < pageFlip.getPageCount() - 2) {
                pageFlip.flipNext();
            } else {
                // Khi hết sách, thay vì nhảy bụp về 0, ta lật về trang 0 (có hiệu ứng lật ngược)
                // hoặc dùng turnToPage(0) nếu muốn reset nhanh.
                pageFlip.turnToPage(0); 
            }
        }, 4000); // Tăng lên 4s để người xem kịp nhìn ảnh
    };

    // Bắt sự kiện người dùng tương tác để tạm dừng
    bookContainer.addEventListener('mouseenter', () => { isUserInteracting = true; });
    bookContainer.addEventListener('mouseleave', () => { isUserInteracting = false; });
    bookContainer.addEventListener('touchstart', () => { isUserInteracting = true; });
    bookContainer.addEventListener('touchend',   () => { isUserInteracting = false; });

    // Khởi chạy
    startAutoPlay();
});
