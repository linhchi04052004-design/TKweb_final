document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const btnRegister = document.querySelector('.btn-register');

    // Chỉ cho phép nhập số
    phoneInput.addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key)) e.preventDefault();
    });

    function checkPassword() {
        const val = passwordInput.value;
        const requirements = {
            length: val.length >= 8,
            uppercase: /[A-Z]/.test(val),
            lowercase: /[a-z]/.test(val),
            number: /[0-9]/.test(val)
        };

        let isAllValid = true;
        for (const id in requirements) {
            const el = document.getElementById(id);
            if (requirements[id]) {
                el.classList.replace('invalid', 'valid');
            } else {
                el.classList.replace('valid', 'invalid');
                isAllValid = false;
            }
        }
        return isAllValid;
    }

    passwordInput.addEventListener('input', checkPassword);

    function validatePhone(phone) {
        return /^(03|05|07|08|09)\d{8}$/.test(phone);
    }

    btnRegister.addEventListener('click', (e) => {
        e.preventDefault();

        const phone = phoneInput.value.trim();
        const user = usernameInput.value.trim();
        const pass = passwordInput.value;

        if (!phone || !user || !pass) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (!validatePhone(phone)) {
            alert("Số điện thoại không hợp lệ!");
            phoneInput.focus();
            return;
        }

        if (user.length < 5) {
            alert("Tên đăng nhập phải từ 5 ký tự trở lên");
            usernameInput.focus();
            return;
        }

        if (!checkPassword()) {
            alert("Mật khẩu chưa đạt yêu cầu!");
            passwordInput.focus();
            return;
        }

        // ✅ THÀNH CÔNG
        alert("Đăng ký thành công! Chuyển về trang đăng nhập.");
        window.location.href = "login.html";
    });
});
