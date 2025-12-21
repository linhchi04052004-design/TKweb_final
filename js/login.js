document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    if (!loginForm) return;

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("loginUsername").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        // 1. Kiểm tra rỗng
        if (!username || !password) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        // 2. Lấy danh sách user
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // 3. Kiểm tra tài khoản
        const user = users.find(
            u => u.username === username && u.password === password
        );

        if (!user) {
            alert("Sai tên đăng nhập hoặc mật khẩu!");
            return;
        }

        // 4. Lưu trạng thái đăng nhập
        localStorage.setItem("currentUser", JSON.stringify({
            username: user.username
        }));

        // 5. Chuyển về trang chủ
        window.location.href = "homepage.html";
    });
});