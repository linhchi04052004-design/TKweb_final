document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('promotion-container');

    fetch('./data/promotion.json')
        .then(response => {
            if (!response.ok) throw new Error('Không tìm thấy file JSON');
            return response.json();
        })
        .then(data => {
            const vouchers = data.sushi_vouchers;
            if (vouchers && container) {
                container.innerHTML = ''; 
                vouchers.forEach(item => {
                    // Chuyển đổi đường dẫn ảnh cho khớp với thư mục gốc
                    const imagePath = item.image.replace('../', './');
                    
                    const cardHTML = `
                        <div class="promo-card">
                            <div class="promo-image">
                                <img src="${imagePath}" alt="${item.title}">
                                <span class="promo-tag">${item.tag}</span>
                            </div>
                            <div class="promo-content">
                                <div class="promo-info">
                                    <h3>${item.title}</h3>
                                    <p>${item.description}</p>
                                </div>
                                <div class="btn-wrapper">
                                    <a href="${item.link}" class="btn-detail">
                                        <b>XEM CHI TIẾT</b>
                                    </a>
                                </div>
                            </div>
                        </div>
                    `;
                    container.innerHTML += cardHTML;
                });
            }
        })
        .catch(error => console.error("Lỗi nạp dữ liệu:", error));
});