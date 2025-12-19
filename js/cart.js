
window.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  //1. KHAI BÁO CÁC PHẦN TỬ HTML
// Modal giỏ hàng
const modal = document.getElementById("myModal");

// Nút mở giỏ hàng
const cartBtn = document.getElementById("cart");

// Nút đóng modal
const closeBtn = modal.querySelector(".close");
const closeFooterBtn = modal.querySelector(".close-footer");

// Nút đặt hàng
const orderBtn = modal.querySelector(".order");

// Khu vực hiển thị sản phẩm
const cartItemsContainer = modal.querySelector(".cart-items");

// Hiển thị tổng tiền
const cartTotalPriceEl = modal.querySelector(".cart-total-price");


   //2. LẤY / LƯU GIỎ HÀNG

// Lấy giỏ hàng từ localStorage
function getCart() {
  const cart = localStorage.getItem("cartProducts");
  return cart ? JSON.parse(cart) : [];
}

// Lưu giỏ hàng vào localStorage
function saveCart(cart) {
  localStorage.setItem("cartProducts", JSON.stringify(cart));
}

  // 3. CẬP NHẬT SỐ LƯỢNG TRÊN BIỂU TƯỢNG GIỎ HÀNG


function updateCartBadge() {
  const cartItems = getCart();

  // Tính tổng số lượng sản phẩm
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  const cartButton = document.getElementById("cart");
  if (!cartButton) return;

  let badge = cartButton.querySelector(".badge");

  // Nếu chưa có badge thì tạo mới
  if (!badge) {
    badge = document.createElement("span");
    badge.classList.add("badge");
    cartButton.appendChild(badge);
  }

  // Có sản phẩm thì hiển thị
  if (totalQuantity > 0) {
    badge.textContent = totalQuantity;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}


   //4. HIỂN THỊ DANH SÁCH GIỎ HÀNG

function displayCartItems() {
  cartItemsContainer.innerHTML = "";
  const cartItems = getCart();

  // Nếu giỏ hàng trống
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML =
      '<p style="text-align:center; padding:20px;">Giỏ hàng của bạn đang trống</p>';
    cartTotalPriceEl.textContent = "0đ";
    return;
  }

  let total = 0;

  cartItems.forEach(product => {
    // Chuyển giá về dạng số
    const priceNumber =
      parseInt(product.price.replace(/[^\d]/g, "")) || 0;

    const itemTotal = priceNumber * product.quantity;
    total += itemTotal;

    // Tạo HTML cho từng sản phẩm
    const cartRow = document.createElement("div");
    cartRow.className = "cart-row";

    cartRow.innerHTML = `
      <div class="cart-item">
        <img src="${product.img}" width="80">
        <span>${product.title}</span>
      </div>
      <span>${product.price}</span>
      <div>
        <input type="number" min="1" value="${product.quantity}" class="cart-quantity-input">
        <button class="btn-remove">Xóa</button>
      </div>
    `;

    cartItemsContainer.appendChild(cartRow);

    /* --- Sự kiện thay đổi số lượng --- */
    const quantityInput = cartRow.querySelector(".cart-quantity-input");
    quantityInput.addEventListener("change", e => {
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      e.target.value = val;

      const cart = getCart();
      const item = cart.find(p => p.title === product.title);
      if (item) item.quantity = val;

      saveCart(cart);
      displayCartItems();
      updateCartBadge();
    });

    /* --- Sự kiện xóa sản phẩm --- */
    const removeBtn = cartRow.querySelector(".btn-remove");
    removeBtn.addEventListener("click", () => {
      removeItem(product.title);
    });
  });

  // Hiển thị tổng tiền
  cartTotalPriceEl.textContent =
    total.toLocaleString("vi-VN") + "đ";
}

   //5. THÊM SẢN PHẨM VÀO GIỎ

function addProductToCart(product) {
  const cart = getCart();

  const existing = cart.find(item => item.title === product.title);

  if (existing) {
    existing.quantity += product.quantity;
  } else {
    cart.push(product);
  }

  saveCart(cart);
  updateCartBadge();
}


  // 6. XÓA SẢN PHẨM

function removeItem(title) {
  let cart = getCart();
  cart = cart.filter(item => item.title !== title);
  saveCart(cart);
  displayCartItems();
  updateCartBadge();
}

   //7. MỞ / ĐÓNG MODAL GIỎ HÀNG

cartBtn.addEventListener("click", () => {
  const currentUser = localStorage.getItem("currentUser");

  // Chưa đăng nhập thì không cho xem giỏ hàng
  if (!currentUser) {
    alert("Bạn cần đăng nhập để xem giỏ hàng.");
    window.location.href = "../login.html";
    return;
  }

  displayCartItems();
  modal.style.display = "block";
});

closeBtn.addEventListener("click", () => (modal.style.display = "none"));
closeFooterBtn.addEventListener("click", () => (modal.style.display = "none"));

window.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});



  // 8. NÚT THANH TOÁN

orderBtn.addEventListener("click", () => {
  const cartItems = getCart();

  if (cartItems.length === 0) {
    alert("Giỏ hàng trống, vui lòng thêm sản phẩm.");
    return;
  }

  window.location.href = "checkout.html";
});


});
