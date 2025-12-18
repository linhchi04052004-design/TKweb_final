document.addEventListener('DOMContentLoaded', function() {

    const DANH_SACH_ANH = [

        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80", // Ảnh 1

        "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80", // Ảnh 2

        "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", // Ảnh 3

        "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=600&q=80", // Ảnh 4

        "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80", // Ảnh 5

        "https://images.unsplash.com/photo-1558985250-27a406d64cb3?w=600&q=80"  // Ảnh 6

    ];



    // --- 2. TÍNH TOÁN KÍCH THƯỚC TRANG ---

    // Yêu cầu: Mỗi trang ~ 1/2 chiều rộng và 1/2 chiều cao màn hình

    const screenWidth = window.innerWidth;

    const screenHeight = window.innerHeight;

    // Chiều rộng 1 trang = 40% màn hình (để khi mở đôi là 80%, chừa lề 2 bên)

    const pageWidth = Math.floor(screenWidth * 0.43);

    // Chiều cao = 60% màn hình

    const pageHeight = Math.floor(screenHeight * 0.60);



    // --- 3. TẠO HTML VÀ NHÂN BẢN (LOOP) ---

    const bookContainer = document.getElementById('book');

    const REPEAT_TIMES = 10; // Nhân bản 10 lần để tạo cảm giác vô tận



    let htmlContent = "";



    // Vòng lặp nhân bản nội dung

    for (let i = 0; i < REPEAT_TIMES; i++) {

        DANH_SACH_ANH.forEach(imgUrl => {

            // Tạo thẻ div chứa ảnh full

            htmlContent += `

                <div class="page">

                    <img src="${imgUrl}" alt="Menu Page">

                </div>

            `;

        });

    }



    // Chèn vào HTML

    bookContainer.innerHTML = htmlContent;



    // --- 4. KHỞI TẠO HIỆU ỨNG LẬT ---

    const pageFlip = new St.PageFlip(bookContainer, {

        width: pageWidth,   // Kích thước đã tính ở trên

        height: pageHeight, // Kích thước đã tính ở trên

       

        // Cấu hình hiển thị

        size: "fixed",      // Cố định theo kích thước tính toán

        usePortrait: false, // Bắt buộc chế độ Ngang (2 trang)

        showCover: false,   // Không dùng chế độ bìa cứng (để mở sẵn 2 trang)

       

        maxShadowOpacity: 0.5, // Độ đậm bóng đổ

        flippingTime: 1200,    // Tốc độ lật (ms)

        startPage: 0

    });



    // Load các trang vừa tạo vào thư viện

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));



    // --- 5. TỰ ĐỘNG LẬT (AUTO PLAY) ---

    setInterval(() => {

        // Nếu chưa đến những trang cuối cùng của bản copy

        if (pageFlip.getCurrentPageIndex() < pageFlip.getPageCount() - 2) {

            pageFlip.flipNext(); // Lật tiếp

        } else {

            // Khi chạy hết 10 vòng lặp -> Nhảy về trang đầu tiên

            pageFlip.turnToPage(0);

        }

    }, 3500);

});