// Lấy tất cả sản phảm ở trang
function getAllProducts() {
    const products = [];
    const productElements = document.querySelectorAll('.col-6.col-md-3');
    
    productElements.forEach(product => {
        const title = product.querySelector('.fw-semibold').textContent;
        const image = product.querySelector('img').src;
        const price = product.querySelector('.text-danger').textContent;
        products.push({
            title,
            image,
            price,
            element: product
        });
    });
    
    return products;
}

// Tạo dropdown
function createSearchDropdown() {
    const searchBox = document.querySelector('.search-box');
    const dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        border-radius: 4px;
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
    `;
    searchBox.appendChild(dropdown);
    return dropdown;
}

// Tạo kết quả
function createResultItem(product) {
    return `
        <div class="search-result-item" style="
            display: flex;
            align-items: center;
            padding: 10px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
        ">
            <img src="${product.image}" style="
                width: 50px;
                height: 50px;
                object-fit: cover;
                margin-right: 10px;
            ">
            <div style="flex-grow: 1;">
                <div style="font-weight: 500; color: #000;">${product.title}</div>
                <div style="color: #000;">${product.price}</div>
            </div>
        </div>
    `;
}

// Tạo chức năng search
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchIcon = document.getElementById('searchIcon');
    const products = getAllProducts();
    const dropdown = createSearchDropdown();

    
    function performSearch(query) {
        query = query.toLowerCase();
        const results = products.filter(product => 
            product.title.toLowerCase().includes(query)
        );

        if (query && results.length > 0) {
            dropdown.innerHTML = results
                .map(product => createResultItem(product))
                .join('');
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    }

    
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });

    searchInput.addEventListener('focus', () => {
        if (searchInput.value) {
            performSearch(searchInput.value);
        }
    });

    searchIcon.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    // Tắt dropdown khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) {
            dropdown.style.display = 'none';
        }
    });

    // Mấy chức năng linh tinh trong dropdown kết quả
    dropdown.addEventListener('click', (e) => {
        const resultItem = e.target.closest('.search-result-item');
        if (resultItem) {
            const title = resultItem.querySelector('div > div').textContent;
            const product = products.find(p => p.title === title);
            if (product) {
                
                product.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                product.element.style.transition = 'background-color 0.3s';
                product.element.style.backgroundColor = '#fff9c4';
                setTimeout(() => {
                    product.element.style.backgroundColor = '';
                }, 1500);
            }
            dropdown.style.display = 'none';
            searchInput.value = ''; // Xóa input ở search
        }
    });
}

// load chức năng khi DOM khởi động
document.addEventListener('DOMContentLoaded', initializeSearch);