document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Ngăn load lại trang

    // 1. Lấy thông tin từ các ô nhập
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const guests = document.getElementById('guests').value;
    const message = document.getElementById('message').value.trim();

    // 2. Kiểm tra dữ liệu đầu vào (Validation)
    if (name === "" || phone === "") {
        alert("Vui lòng nhập đầy đủ Họ tên và Số điện thoại!");
        return; // Dừng thực thi nếu thiếu thông tin
    }

    // Kiểm tra định dạng số điện thoại cơ bản (ít nhất 10 số)
    if (phone.length < 10) {
        alert("Số điện thoại không hợp lệ. Vui lòng kiểm tra lại!");
        return;
    }

    // 3. Hiển thị thông báo thành công
    const successBox = document.getElementById('successBox');
    const displayResult = document.getElementById('displayResult');

    // Nếu bạn không dùng successBox (thông báo ẩn hiện trên trang), 
    // bạn có thể dùng alert truyền thống như dưới đây:
    
    if (successBox) {
        successBox.style.display = 'flex';
        displayResult.innerHTML = `
            <strong>Gửi thành công!</strong><br>
            Cảm ơn ${name}. Sushi Fuji đã nhận được yêu cầu cho ${guests} khách và sẽ sớm liên hệ qua SĐT ${phone}.
        `;

        // Tự động ẩn thông báo sau 8 giây
        setTimeout(() => {
            successBox.style.display = 'none';
        }, 8000);
    } else {
        alert(`Cảm ơn ${name}! Yêu cầu của bạn đã được gửi thành công.`);
    }

    // 4. Reset lại form sau khi gửi
    this.reset();
});