document.addEventListener("DOMContentLoaded", () => {
        //nhúng header và footer 
    fetch("./components/header.html")
        .then(res => res.text())
        .then(data => {
        document.getElementById("header").innerHTML = data;
        })
        .catch(err => console.error("Không load được header", err));

    fetch("./components/footer.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    })
    .catch(error => console.error("Lỗi load footer:", error));
    //chỉnh banner
    let slider = document.querySelector('.slider .list');
    let items = document.querySelectorAll('.slider .list .item');
    let next = document.getElementById('next');
    let prev = document.getElementById('prev');
    let dots = document.querySelectorAll('.slider .dots li');
    let video = document.getElementById('introVideo'); // Lấy video

    let lengthItems = items.length - 1;
    let active = 0;
    let refreshInterval;

    // Hàm bắt đầu đếm thời gian tự động chuyển
    function startAutoNext() {
        clearInterval(refreshInterval);
        refreshInterval = setInterval(() => {
            next.click();
        }, 3000);
    }

    next.onclick = function() {
        active = active + 1 <= lengthItems ? active + 1 : 0;
        reloadSlider();
    }

    prev.onclick = function() {
        active = active - 1 >= 0 ? active - 1 : lengthItems;
        reloadSlider();
    }

    function reloadSlider() {
        slider.style.left = -items[active].offsetLeft + 'px';
        
        let last_active_dot = document.querySelector('.slider .dots li.active');
        last_active_dot.classList.remove('active');
        dots[active].classList.add('active');

        // KIỂM TRA NẾU LÀ SLIDE VIDEO
        if (items[active].contains(video)) {
            clearInterval(refreshInterval); // Dừng tự động chuyển
            video.currentTime = 0; // Chạy lại từ đầu
            video.play();
            
            // Khi video kết thúc, tự động sang slide tiếp theo
            video.onended = function() {
                next.click();
            };
        } else {
            video.pause(); // Nếu sang slide ảnh thì dừng video lại
            startAutoNext(); // Quay lại chế độ tự động chuyển slide ảnh (3 giây)
        }
    }

    // Khởi tạo chạy lần đầu
    if (items[active].contains(video)) {
        clearInterval(refreshInterval);
        video.play();
        video.onended = () => next.click();
    } else {
        startAutoNext();
    }

    dots.forEach((li, key) => {
        li.addEventListener('click', () => {
            active = key;
            reloadSlider();
        })
    });

});