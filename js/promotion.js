document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('promotion-container');
    fetch('./data/promotion.json')
        .then(res => res.json())
        .then(data => {
            const vouchers = data.sushi_vouchers;
            if (vouchers && container) {
                container.innerHTML = vouchers.map(item => `
                    <div class="promo-card">
                        <div class="promo-image">
                            <img src="${item.image.replace('../', './')}" alt="${item.title}">
                            <span class="promo-tag">${item.tag}</span>
                        </div>
                        <div class="promo-content">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                            <a href="promotion_detail.html?id=${item.id}" class="btn-detail">
                                <b>XEM CHI TIẾT</b>
                            </a>
                        </div>
                    </div>`).join('');
            }
        });
});