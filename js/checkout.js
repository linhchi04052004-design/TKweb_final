document.addEventListener("DOMContentLoaded", () => {

    /* =============================
       1. KIỂM TRA ĐĂNG NHẬP
    ============================= */
    const userLogin = JSON.parse(localStorage.getItem("userLogin"));

    if (!userLogin || !userLogin.isLoggedIn) {
        localStorage.setItem("redirectAfterLogin", "checkout.html");
        window.location.href = "login.html";
        return;
    }

    /* =============================
       2. LOAD THÔNG TIN USER
    ============================= */
    document.getElementById("fullname").value = userLogin.username || "";
    document.getElementById("phone").value = userLogin.phone || "";

    /* =============================
       3. DỮ LIỆU TỈNH / PHƯỜNG (MẪU VN)
    ============================= */
    const addressData = {
        "Hà Nội": ["Phường Cầu Giấy", "Phường Dịch Vọng", "Phường Trung Hòa"],
        "TP Hồ Chí Minh": ["Phường Bến Nghé", "Phường Thảo Điền", "Phường Linh Trung"],
        "Đà Nẵng": ["Phường Hải Châu", "Phường Thanh Khê", "Phường Hòa Cường"]
    };

    const provinceSelect = document.getElementById("province");
    const wardSelect = document.getElementById("ward");

    // Load tỉnh
    Object.keys(addressData).forEach(province => {
        const option = document.createElement("option");
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    });

    // Chọn tỉnh → load phường
    provinceSelect.addEventListener("change", () => {
        wardSelect.innerHTML = `<option value="">Chọn xã / phường</option>`;

        const wards = addressData[provinceSelect.value];
        if (!wards) return;

        wards.forEach(ward => {
            const option = document.createElement("option");
            option.value = ward;
            option.textContent = ward;
            wardSelect.appendChild(option);
        });
    });

    /* =============================
       4. LOAD GIỎ HÀNG
    ============================= */
    const cart = JSON.parse(localStorage.getItem("cartProducts")) || [];
    const productContainer = document.getElementById("checkout-products");

    let totalQty = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
        productContainer.innerHTML = "<p>Giỏ hàng trống</p>";
        return;
    }

    productContainer.innerHTML = "";

    cart.forEach(item => {
        const unitPrice =
            parseInt(String(item.price).replace(/[^\d]/g, "")) || 0;

        const quantity = item.quantity || 0;
        const itemTotal = unitPrice * quantity;

        totalQty += quantity;
        totalPrice += itemTotal;

        const div = document.createElement("div");
        div.className = "product-item";

        div.innerHTML = `
            <img src="${item.img}" alt="${item.title}">
            <div class="product-info">
                <h4>${item.title}</h4>
                <p>Số lượng: ${quantity}</p>
                <p>Đơn giá: ${unitPrice.toLocaleString("vi-VN")} VND</p>
                <p class="product-price">
                    Thành tiền: ${itemTotal.toLocaleString("vi-VN")} VND
                </p>
            </div>
        `;

        productContainer.appendChild(div);
    });

    document.getElementById("total-qty").innerText = totalQty;
    document.getElementById("total-price").innerText =
        totalPrice.toLocaleString("vi-VN") + " VND";

    /* =============================
       5. ĐẶT HÀNG
    ============================= */
    document.getElementById("btn-order").addEventListener("click", () => {

        const fullname = document.getElementById("fullname").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const province = provinceSelect.value;
        const ward = wardSelect.value;
        const addressDetail =
            document.getElementById("addressDetail").value.trim();

        if (!fullname || !phone || !province || !ward || !addressDetail) {
            alert("Vui lòng nhập đầy đủ thông tin giao hàng!");
            return;
        }

        // Validate số điện thoại VN
        if (!/^(03|05|07|08|09)\d{8}$/.test(phone)) {
            alert("Số điện thoại không hợp lệ!");
            return;
        }

        const order = {
            customer: {
                fullname,
                phone,
                address: `${addressDetail}, ${ward}, ${province}`
            },
            items: cart,
            totalQty,
            totalPrice,
            createdAt: new Date().toISOString()
        };

        // 🔥 LƯU ĐƠN HÀNG ĐỂ XEM LẠI
        localStorage.setItem("orderLast", JSON.stringify(order));

        // Xóa giỏ hàng
        localStorage.removeItem("cartProducts");

        alert("🎉 Đặt hàng thành công!");

        // 👉 Trang thành công
        window.location.href = "order_sucess.html";
    });

});
