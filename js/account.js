document.addEventListener("DOMContentLoaded", () => {

    /* ===== 1. LẤY USER ĐANG ĐĂNG NHẬP ===== */
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    /* ===== 2. LẤY DANH SÁCH USERS ===== */
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === currentUser.username);

    if (!user) {
        alert("Không tìm thấy thông tin người dùng!");
        return;
    }

    /* ===== 3. GÁN DỮ LIỆU VÀO FORM ===== */
    const usernameText = document.getElementById("usernameText");
    const fullnameInput = document.getElementById("fullnameInput");
    const phoneInput = document.getElementById("phoneInput");
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    const btnSaveProfile = document.getElementById("btnSaveProfile");

    if (usernameText) usernameText.textContent = user.username;
    if (fullnameInput) fullnameInput.value = user.fullname || "";
    if (phoneInput) phoneInput.value = user.phone || "";
    if (emailInput) emailInput.value = user.email || "";

    /* ===== 4. CẬP NHẬT HỒ SƠ ===== */
    btnSaveProfile.addEventListener("click", () => {
        user.fullname = fullnameInput.value.trim();
        user.phone = phoneInput.value.trim();
        user.email = emailInput.value.trim();

        if (passwordInput.value.trim() !== "") {
            user.password = passwordInput.value.trim();
        }

        localStorage.setItem("users", JSON.stringify(users));
        alert("Cập nhật hồ sơ thành công!");
    });

    /* ===== 5. SWITCH TAB ===== */
    const tabProfile = document.getElementById("tabProfile");
    const tabOrders = document.getElementById("tabOrders");
    const profileTab = document.getElementById("profileTab");
    const ordersTabContent = document.getElementById("ordersTabContent");

    tabProfile.addEventListener("click", () => {
        tabProfile.classList.add("active");
        tabOrders.classList.remove("active");
        profileTab.style.display = "block";
        ordersTabContent.style.display = "none";
    });

    tabOrders.addEventListener("click", () => {
        tabOrders.classList.add("active");
        tabProfile.classList.remove("active");
        profileTab.style.display = "none";
        ordersTabContent.style.display = "block";
        loadOrders();
    });

    /* ===== 6. LOAD LỊCH SỬ ĐƠN HÀNG ===== */
    function loadOrders() {
        const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || {};
        const orders = orderHistory[currentUser.username] || [];
        const ordersList = document.getElementById("ordersList");
        ordersList.innerHTML = "";

        if (orders.length === 0) {
            ordersList.innerHTML = "<p>Bạn chưa có đơn hàng nào.</p>";
return;
        }

        orders.forEach(order => {
            const div = document.createElement("div");
            div.style.border = "1px solid #ccc";
            div.style.padding = "10px";
            div.style.marginBottom = "10px";
            div.innerHTML = `
                <p><b>Mã đơn hàng:</b> ${order.orderId}</p>
                <p><b>Ngày đặt:</b> ${new Date(order.createdAt).toLocaleString()}</p>
                <p><b>Trạng thái:</b> ${order.status}</p>
                <p><b>Tổng số lượng:</b> ${order.totalQty}</p>
                <p><b>Tổng giá:</b> ${order.totalPrice.toLocaleString("vi-VN")} VND</p>
                <p><b>Sản phẩm:</b></p>
                <ul>
                    ${order.items.map(item => `<li>${item.title} x ${item.quantity}</li>`).join("")}
                </ul>
            `;
            ordersList.appendChild(div);
        });
    }

});