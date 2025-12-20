document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const btnRegister = document.querySelector('.btn-register');

    // 1. Chỉ cho phép nhập số vào ô điện thoại
    phoneInput.addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    // 2. Kiểm tra mật khẩu thời gian thực (Real-time)
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
            const element = document.getElementById(id);
            if (requirements[id]) {
                element.classList.replace('invalid', 'valid');
            } else {
                element.classList.replace('valid', 'invalid');
                isAllValid = false;
            }
        }
        return isAllValid;
    }

    passwordInput.addEventListener('input', checkPassword);

    // 3. Hàm kiểm tra định dạng số điện thoại
    function validatePhone(phone) {
        const vnf_regex = /^(03|05|07|08|09)\d{8}$/;
        return vnf_regex.test(phone);
    }

    // 4. Xử lý nút đăng ký
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
            alert("Số điện thoại không đúng (Phải có 10 số, bắt đầu bằng 03, 05, 07, 08, 09)");
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

        // Thành công
        alert("Đăng ký thành công!");
        console.log("Dữ liệu chuẩn:", { phone, user, pass });
    });
});



// Tìm đến đoạn xử lý sự kiện click của nút ĐĂNG KÝ
btnRegister.addEventListener('click', (e) => {
    // ... các đoạn kiểm tra dữ liệu trước đó ...

    if (checkPassword() && validatePhone(phone)) {
        // Hiện thông báo thành công
        alert("Đăng ký thành công! Hệ thống sẽ đưa bạn về trang Đăng nhập.");
        
        // Tự động chuyển hướng về trang đăng nhập
        window.location.href = "login.html"; 
    }
});