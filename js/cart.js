
// Lấy phần tử modal và các nút
const modal = document.getElementById('myModal');
const cartBtn = document.getElementById('cart');
const closeBtn = modal.querySelector('.close');
const closeFooterBtn = modal.querySelector('.close-footer');
const orderBtn = modal.querySelector('.order');
const cartItemsContainer = modal.querySelector('.cart-items');
const cartTotalPriceEl = modal.querySelector('.cart-total-price');

// Lấy và lưu giỏ hàng từ localStorage
function getCart() {
  const cart = localStorage.getItem('cartProducts');
  return cart ? JSON.parse(cart) : [];
}
function saveCart(cart) {
  localStorage.setItem('cartProducts', JSON.stringify(cart));
}

// Cập nhật biểu tượng giỏ hàng
function updateCartBadge() {
  const cartItems = getCart();
  const totalQuantity = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);
  const cartButton = document.getElementById('cart');
  if (!cartButton) return;
  let badge = cartButton.querySelector('.badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.classList.add('badge');
    cartButton.appendChild(badge);
  }
  if (totalQuantity > 0) {
    badge.textContent = totalQuantity;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

// Hiển thị giỏ hàng
function displayCartItems() {
  cartItemsContainer.innerHTML = '';
  const cartItems = getCart();
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-center p-4 text-gray-500">Giỏ hàng của bạn đang trống</p>';
    cartTotalPriceEl.textContent = '0đ';
    return;
  }
  let total = 0;
  cartItems.forEach(product => {
    const priceNumber = parseInt(product.price.replace(/[^\d]/g, '')) || 0;
    const itemTotal = priceNumber * product.quantity;
    total += itemTotal;

    const cartRow = document.createElement('div');
    cartRow.className = 'cart-row';
    cartRow.innerHTML = `
      <div class="cart-item cart-column flex items-center gap-4 p-3 rounded border bg-white shadow-sm">
        <img class="cart-item-image rounded" src="${product.img}" alt="${product.title}" width="100" height="100"/>
        <span class="cart-item-title font-semibold text-gray-900">${product.title}</span>
      </div>
      <span class="cart-price cart-column font-semibold text-gray-900">${product.price}</span>
      <div class="cart-quantity cart-column flex items-center gap-2">
        <input class="cart-quantity-input border rounded text-center text-gray-800" type="number" min="1" value="${product.quantity}" style="width:60px"/>
        <button class="btn btn-danger bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Xóa</button>
      </div>
    `;

    cartItemsContainer.appendChild(cartRow);

    // Sự kiện thay đổi số lượng
    const quantityInput = cartRow.querySelector('.cart-quantity-input');
    quantityInput.addEventListener('change', e => {
  let val = parseInt(e.target.value);
  if (isNaN(val) || val < 1) val = 1;
  e.target.value = val;

  // Cập nhật localStorage
  const cartItems = getCart();
  const item = cartItems.find(p => p.title === product.title);
  if (item) {
    item.quantity = val;
    saveCart(cartItems);
  }

  // Cập nhật tổng tiền ngay
  const newTotal = cartItems.reduce((sum, p) => {
    const price = parseInt(p.price.replace(/[^\d]/g, '')) || 0;
    return sum + price * p.quantity;
  }, 0);
  cartTotalPriceEl.textContent = newTotal.toLocaleString('vi-VN') + 'đ';

  updateCartBadge();
});


    // Sự kiện xóa sản phẩm
    const removeBtn = cartRow.querySelector('.btn-danger');
    removeBtn.addEventListener('click', () => {
      removeItem(product.title);
    });
  });
  cartTotalPriceEl.textContent = total.toLocaleString('vi-VN') + 'đ';
}

// Thêm sản phẩm vào giỏ hàng
function addProductToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.title === product.title);
  if (existing) {
    existing.quantity = Number(existing.quantity) + Number(product.quantity);
  } else {
    cart.push(product);
  }
  saveCart(cart);
  displayCartItems();
  updateCartBadge();
}

// Cập nhật số lượng sản phẩm
function updateQuantity(title, quantity) {
  const cartItems = getCart();
  const product = cartItems.find(item => item.title === title);
  if (product) {
    product.quantity = quantity;
    saveCart(cartItems);
    displayCartItems();
    updateCartBadge();
  }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(title) {
  let cartItems = getCart();
  cartItems = cartItems.filter(item => item.title !== title);
  saveCart(cartItems);
  displayCartItems();
  updateCartBadge();
}

// Sự kiện mở/đóng modal giỏ hàng
cartBtn.addEventListener('click', () => {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("Bạn cần đăng nhập để xem giỏ hàng.");
    window.location.href = "login.html";
    return;
  }

  displayCartItems();
  modal.style.display = 'block';
});
closeBtn.addEventListener('click', () => modal.style.display = 'none');
closeFooterBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});

// Nút thanh toán
orderBtn.addEventListener('click', () => {
  const cartItems = getCart();
  if (cartItems.length === 0) {
    alert("Giỏ hàng trống, vui lòng chọn 1 sản phẩm để thêm vào giỏ.");
    return;
  }

  window.location.href = 'checkout.html';
});
// Sự kiện thêm sản phẩm từ danh sách
document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', e => {
    // Kiểm tra đăng nhập
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      window.location.href = "login.html"; // hoặc đường dẫn đúng của bạn
      return;
    }

    const card = e.target.closest('.col-6, .col-md-3');
    const title = card.querySelector('.fw-semibold').innerText.trim();
    const price = card.querySelector('.fw-bold.text-danger').innerText.trim();
    const img = card.querySelector('img').src;
    addProductToCart({ title, price, img, quantity: 1 });
    modal.style.display = 'block';
  });
});

// Sự kiện thêm từ popup
document.querySelectorAll('.add-to-cart-popup').forEach(btn => {
  btn.addEventListener('click', () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      window.location.href = "login.html";
      return;
    }

    const title = document.getElementById('popupTitle').textContent.trim();
    const price = priceValue.toLocaleString('vi-VN') + '₫'; 
    const img = document.getElementById('popupImg').src;
    let quantity = parseInt(document.getElementById('quantityInput').value, 10);
    if (isNaN(quantity) || quantity < 1) quantity = 1;
    addProductToCart({ title, price, img, quantity });
    modal.style.display = 'none';
  });
});
// Mua ngay từ popup
document.querySelectorAll('.buy-now-popup').forEach(btn => {
  btn.addEventListener('click', () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      alert("Bạn cần đăng nhập để mua hàng.");
      window.location.href = "login.html"; // hoặc đường dẫn đúng của bạn
      return;
    }

    const title = document.getElementById('popupTitle').textContent.trim();
    const price = document.getElementById('totalPrice').textContent.trim();
    const img = document.getElementById('popupImg').src;
    let quantity = parseInt(document.getElementById('quantityInput').value, 10);
    if (isNaN(quantity) || quantity < 1) quantity = 1;
    addProductToCart({ title, price, img, quantity });
    window.location.href = 'checkout.html';
  });
});

// Tải lại giao diện khi trang load
window.addEventListener('DOMContentLoaded', () => {
  displayCartItems();
  updateCartBadge();
});