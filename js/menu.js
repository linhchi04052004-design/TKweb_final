document.addEventListener('DOMContentLoaded', function() {

    // =========================================================
    // PHẦN 1: CẤU HÌNH SÁCH LẬT (GIỮ NGUYÊN CODE CŨ CỦA BẠN)
    // =========================================================

    const DANH_SACH_ANH = [
        "assets/images/menu5.png", // Bỏ url() và kiểm tra lại cấp bậc thư mục
    "assets/images/menu66.png",
    "assets/images/menudoi.png",
    "assets/images/menu4.png",
    "assets/images/menu2.png",
    "assets/images/menu1.png",
    ];

    const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// TỈ LỆ ẢNH MENU (913 x 701)
const IMAGE_RATIO = 913 / 701;

let pageWidth, pageHeight;

/* MÀN HÌNH LỚN (LAPTOP, PC) */
if (screenWidth > 1024) {
    pageHeight = Math.floor(screenHeight * 0.65);
    pageWidth = Math.floor(pageHeight * IMAGE_RATIO);
}
/* IPAD */
else if (screenWidth > 430) {
    pageHeight = Math.floor(screenHeight * 0.55);
    pageWidth = Math.floor(pageHeight * IMAGE_RATIO);
}
/* ĐIỆN THOẠI */
else {
    pageWidth = Math.floor(screenWidth * 0.95);
    pageHeight = Math.floor(pageWidth / IMAGE_RATIO);
}


    const bookContainer = document.getElementById('book');
    
    // Kiểm tra xem trang có phần tử #book không để tránh lỗi
    if (bookContainer) {
        const REPEAT_TIMES = 10;
        let htmlContent = "";

        for (let i = 0; i < REPEAT_TIMES; i++) {
            DANH_SACH_ANH.forEach(imgUrl => {
                htmlContent += `
                    <div class="page" style="background-color: #fdfdfd;">
                        <div class="page-content" style="width: 100%; height: 100%; overflow: hidden;">
                           <img 
    src="${imgUrl}" 
    alt="Menu"
    style="
        width: 100%;
        height: 100%;
        object-fit: contain;
        background-color: #fff;
    "
>

                        </div>
                    </div>
                `;
            });
        }
        bookContainer.innerHTML = htmlContent;

        if (typeof St !== 'undefined') {
            const pageFlip = new St.PageFlip(bookContainer, {
                width: pageWidth,
                height: pageHeight,
                size: "stretch",
                usePortrait: screenWidth <= 768,

                showCover: false,
                minWidth: 300,
                maxWidth: 1000,
                minHeight: 400,
                maxShadowOpacity: 0.2,
                showPageCorners: true,
                flippingTime: 1200,
                useMouseEvents: true,
                swipeDistance: 30,
            });

            pageFlip.loadFromHTML(document.querySelectorAll('.page'));

            let autoPlayInterval;
            let isUserInteracting = false;

            const startAutoPlay = () => {
                if (autoPlayInterval) clearInterval(autoPlayInterval);
                autoPlayInterval = setInterval(() => {
                    if (isUserInteracting) return;
                    if (pageFlip.getCurrentPageIndex() < pageFlip.getPageCount() - 2) {
                        pageFlip.flipNext();
                    } else {
                        pageFlip.turnToPage(0); 
                    }
                }, 3500);
            };

            bookContainer.addEventListener('mouseenter', () => { isUserInteracting = true; });
            bookContainer.addEventListener('mouseleave', () => { isUserInteracting = false; });
            bookContainer.addEventListener('touchstart', () => { isUserInteracting = true; });
            bookContainer.addEventListener('touchend',   () => { isUserInteracting = false; });

            startAutoPlay();
        }
    }

    
    // ===============================
// CLICK NÚT + → THÊM VÀO GIỎ & MỞ POPUP CART
// ===============================
const addButtons = document.querySelectorAll('.add-btn');

addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const productItem = e.target.closest('.product-item');

        const img = productItem.querySelector('img').src;
        const title = productItem.querySelector('.product-name').innerText;
        const priceStr = productItem.querySelector('.product-price').innerText;

        const product = {
            title: title,
            price: priceStr,
            img: img,
            quantity: 1
        };

        // LẤY GIỎ HÀNG
        let cart = localStorage.getItem("cartProducts");
        cart = cart ? JSON.parse(cart) : [];

        // KIỂM TRA TRÙNG
        const exist = cart.find(p => p.title === product.title);
        if (exist) {
            exist.quantity += 1;
        } else {
            cart.push(product);
        }

        localStorage.setItem("cartProducts", JSON.stringify(cart));

        // 🔥 MỞ POPUP GIỎ HÀNG (cart.js)
        const cartBtn = document.getElementById("cart");
        if (cartBtn) {
            cartBtn.click(); // kích hoạt popup cart
        }
    });
});

});