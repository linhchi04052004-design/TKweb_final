document.addEventListener("DOMContentLoaded", () => {

    /* 1. LẤY USER ĐANG ĐĂNG NHẬP */
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Nếu chưa đăng nhập → đá về login
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }
    

    /* 2. LẤY DANH SÁCH USERS */
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Tìm user đầy đủ thông tin
    const user = users.find(u => u.username === currentUser.username);

    if (!user) {
        alert("Không tìm thấy thông tin người dùng!");
        return;
    }
    const emailInput = document.getElementById("emailInput");
    if (emailInput) emailInput.value = user.email || "";


    /* 3. ĐỔ DỮ LIỆU RA GIAO DIỆN */

    // Text
    const usernameText = document.getElementById("usernameText");
    const passwordInput = document.getElementById("passwordInput");


    if (usernameText) usernameText.textContent = user.username;
    
    // Input
    const fullnameInput = document.getElementById("fullnameInput");
    const phoneInput = document.getElementById("phoneInput");

    if (fullnameInput) fullnameInput.value = user.fullname || "";
    if (phoneInput) phoneInput.value = user.phone || "";
    const btnSaveProfile = document.getElementById("btnSaveProfile");

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


});
