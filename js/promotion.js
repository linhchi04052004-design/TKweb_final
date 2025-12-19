document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('promotion-container');

    // Đường dẫn từ file HTML đi vào thư mục data
    fetch('./data/promotion.json')
        .then(response => {
            if (!response.ok) throw new Error('Không tìm thấy file JSON');
            return response.json();
        })
        .then(data => {
            const vouchers = data.sushi_vouchers;

            if (vouchers && container) {
                container.innerHTML = ''; // Xóa trắng trước khi nạp dữ liệu

                vouchers.forEach(item => {
                    // Sửa lại đường dẫn ảnh để phù hợp với file HTML ở thư mục gốc
                    const imagePath = item.image.replace('../', './');

                    const cardHTML = `
                        <div class="promo-card">
                            <div class="promo-image">
                                <img src="${imagePath}" alt="${item.title}">
                                <span class="promo-tag">${item.tag}</span>
                            </div>
                            <div class="promo-content">
                                <h3>${item.title}</h3>
                                <p>${item.description}</p>
                                <button class="btn-detail"><b>XEM CHI TIẾT </b></button>
                            </div>
                        </div>
                    `;
                    container.innerHTML += cardHTML;
                });
            }
        })
        .catch(error => console.error("Lỗi:", error));
});