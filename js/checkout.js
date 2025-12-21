document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    localStorage.setItem("redirectAfterLogin", "checkout.html");
    window.location.href = "login.html";
    return;
}

// AUTO ĐIỀN THÔNG TIN
const fullnameInput = document.getElementById("fullname");
const phoneInput = document.getElementById("phone");

if (fullnameInput) {
    fullnameInput.value = currentUser.username || "";
}

if (phoneInput) {
    phoneInput.value = currentUser.phone || "";
}
   

    /* =============================
       3. DỮ LIỆU TỈNH / PHƯỜNG (MẪU VN)
    ============================= */
    const addressData = {
       "Hà Nội": [
        "Phường Ba Đình",
        "Phường Hoàn Kiếm",
        "Phường Đống Đa",
        "Phường Hai Bà Trưng",
        "Phường Tây Hồ",
        "Phường Cầu Giấy",
        "Phường Thanh Xuân",
        "Phường Hoàng Mai",
        "Phường Long Biên",
        "Phường Nam Từ Liêm",
        "Phường Bắc Từ Liêm",
        "Phường Hà Đông",
        "Phường Sơn Tây",
        "Phường Phúc La",
        "Phường Yên Nghĩa",
        "Phường Dịch Vọng",
        "Phường Trung Hòa",
        "Phường Kim Mã",
        "Phường Nghĩa Tân",
        "Phường Xuân La"
    ]

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
if (!currentUser || !currentUser.username) {
    alert("Vui lòng đăng nhập để đặt hàng!");
    return;
}

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
    orderId: "SF" + Date.now(),
    username: currentUser.username,
    customer: {
        fullname,
        phone,
        address: `${addressDetail}, ${ward}, ${province}`
    },
    items: cart,
    totalQty,
    totalPrice,
    status: "Đang xử lý",
    createdAt: new Date().toISOString()
};


        let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || {};

if (!orderHistory[currentUser.username]) {
    orderHistory[currentUser.username] = [];
}

orderHistory[currentUser.username].push(order);

localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
localStorage.setItem("orderLast", JSON.stringify(order));

localStorage.removeItem("cartProducts");

window.location.href = "order_sucess.html";

    });

});
