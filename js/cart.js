document.addEventListener("headerLoaded", () => {
    const modal = document.getElementById("myModal");
    const cartBtn = document.getElementById("cart");

    if (!cartBtn || !modal) {
        console.error("Cart elements not found");
        return;
    }

  /* ===============================
     1. KHAI BÁO PHẦN TỬ HTML
  =============================== */
  const closeBtn = modal.querySelector(".close");
  const closeFooterBtn = modal.querySelector(".close-footer");
  const orderBtn = modal.querySelector(".order");
  const cartItemsContainer = modal.querySelector(".cart-items");
  const cartTotalPriceEl = modal.querySelector(".cart-total-price");

  /* ===============================
     2. LOCAL STORAGE
  =============================== */
  function getCart() {
    const cart = localStorage.getItem("cartProducts");
    return cart ? JSON.parse(cart) : [];
  }

  function saveCart(cart) {
    localStorage.setItem("cartProducts", JSON.stringify(cart));
  }

  /* ===============================
     3. BADGE SỐ LƯỢNG
  =============================== */
  function updateCartBadge() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

    let badge = cartBtn.querySelector(".badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "badge";
      cartBtn.appendChild(badge);
    }

    badge.textContent = total;
    badge.style.display = total > 0 ? "inline-block" : "none";
  }

  /* ===============================
     4. HIỂN THỊ GIỎ HÀNG
  =============================== */
  function displayCartItems() {
    cartItemsContainer.innerHTML = "";
    const cart = getCart();

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        "<p style='text-align:center'>Giỏ hàng trống, vui lòng thêm sản phẩm</p>";
      cartTotalPriceEl.textContent = "0đ";
      return;
    }

    let total = 0;

    cart.forEach(product => {
      const price = parseInt(product.price.replace(/[^\d]/g, "")) || 0;
      total += price * product.quantity;

      const row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = `
        <div class="cart-item">
          <img src="${product.img}" width="80">
          <span>${product.title}</span>
        </div>
        <span>${product.price}</span>
        <div>
          <input type="number" min="1" value="${product.quantity}" class="qty">
          <button class="remove">Xóa</button>
        </div>
      `;

      cartItemsContainer.appendChild(row);

      /* đổi số lượng */
      row.querySelector(".qty").addEventListener("change", e => {
        let value = parseInt(e.target.value);
        if (value < 1 || isNaN(value)) value = 1;

        product.quantity = value;
        saveCart(cart);
        displayCartItems();
        updateCartBadge();
      });

      /* xóa */
      row.querySelector(".remove").addEventListener("click", () => {
        removeItem(product.title);
      });
    });

    cartTotalPriceEl.textContent =
      total.toLocaleString("vi-VN") + "đ";
  }

  /* ===============================
     5. THÊM SẢN PHẨM
  =============================== */
  function addProductToCart(product) {
    const cart = getCart();
    const exist = cart.find(p => p.title === product.title);

    if (exist) {
      exist.quantity += product.quantity;
    } else {
      cart.push(product);
    }

    saveCart(cart);
    displayCartItems();
    updateCartBadge();
    modal.style.display = "block";
  }

  /* ===============================
     6. XÓA SẢN PHẨM
  =============================== */
  function removeItem(title) {
    let cart = getCart().filter(p => p.title !== title);
    saveCart(cart);
    displayCartItems();
    updateCartBadge();
  }

  /* ===============================
     7. MỞ / ĐÓNG MODAL
  =============================== */
  cartBtn.addEventListener("click", () => {
    displayCartItems();
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => modal.style.display = "none");
  closeFooterBtn.addEventListener("click", () => modal.style.display = "none");

  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });

  /* ===============================
     8. THANH TOÁN
  =============================== */
  orderBtn.addEventListener("click", () => {
    if (getCart().length === 0) {
      alert("Giỏ hàng trống, vui lòng thêm sản phẩm");
      return;
    }
    window.location.href = "checkout.html";
  });


  //9. LOAD BAN ĐẦU
  updateCartBadge();

});