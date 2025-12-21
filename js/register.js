document.addEventListener("DOMContentLoaded", () => {
    const phoneInput = document.getElementById("phone");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const btnRegister = document.querySelector(".btn-register");
    if (!btnRegister) return;

    /* 1. CHỈ CHO NHẬP SỐ ĐIỆN THOẠI */
    phoneInput.addEventListener("keypress", (e) => {
        if (!/[0-9]/.test(e.key)) e.preventDefault();
    });

    /*  2. KIỂM TRA MẬT KHẨU*/
    function checkPassword() {
        const val = passwordInput.value;

        const rules = {
            length: val.length >= 8,
            uppercase: /[A-Z]/.test(val),
            lowercase: /[a-z]/.test(val),
            number: /[0-9]/.test(val)
        };

        let isValid = true;

        for (const id in rules) {
            const el = document.getElementById(id);
            if (!el) continue;

            if (rules[id]) {
                el.classList.remove("invalid");
                el.classList.add("valid");
            } else {
                el.classList.remove("valid");
                el.classList.add("invalid");
                isValid = false;
            }
        }

        return isValid;
    }

    passwordInput.addEventListener("input", checkPassword);

    /* 3. KIỂM TRA SỐ ĐIỆN THOẠI VN */
    function validatePhone(phone) {
        return /^(03|05|07|08|09)\d{8}$/.test(phone);
    }

    /* 4. XỬ LÝ ĐĂNG KÝ*/
    btnRegister.addEventListener("click", (e) => {
        e.preventDefault();

        const phone = phoneInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!phone || !username || !password) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (!validatePhone(phone)) {
            alert("Số điện thoại không hợp lệ!");
            phoneInput.focus();
            return;
        }

        if (username.length < 5) {
            alert("Tên đăng nhập phải từ 5 ký tự trở lên!");
            usernameInput.focus();
            return;
        }

        if (!checkPassword()) {
            alert("Mật khẩu chưa đạt yêu cầu!");
            passwordInput.focus();
            return;
        }

        /*  5. LƯU USER (GIẢ LẬP DATABASE) */
        let users = JSON.parse(localStorage.getItem("users")) || [];

        const isExist = users.find(
            u => u.phone === phone || u.username === username
        );

        if (isExist) {
            alert("Số điện thoại hoặc tên đăng nhập đã tồn tại!");
            return;
        }

        const newUser = {
            phone: phone,
            username: username,
            password: password
        };

        // LƯU USER
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));


        /*  7. QUAY LẠI TRANG TRƯỚC (NẾU CÓ) */
        const redirect = localStorage.getItem("redirectAfterLogin");

        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        window.location.href = "login.html";
        return;

    });
});
