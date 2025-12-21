document.addEventListener("DOMContentLoaded", () => {
        //nhúng header và footer 
    fetch("./components/header.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("header").innerHTML = data;
        
        // CHỈNH SỬA Ở ĐÂY: Phát một sự kiện để báo rằng Header đã sẵn sàng
        document.dispatchEvent(new Event("headerLoaded"));
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

// Tạo một hàm riêng để khởi tạo slider ngay khi gọi
function initHotSlider() {
    const trackHot = document.querySelector('.hot-slider-track');
    const itemsHot = document.querySelectorAll('.item-hot');
    const nextBtnHot = document.getElementById('next-hot');
    const prevBtnHot = document.getElementById('prev-hot');
    const dotsHot = document.querySelectorAll('.dots-hot li');

    if (!trackHot || itemsHot.length === 0) return;

    let indexHot = 0;
    const itemsVisible = 3;
    const totalRealItems = itemsHot.length;
    const gap = 15;
    let isTransitioning = false;
    let autoPlay;

    // 1. NHÂN BẢN NGAY LẬP TỨC
    for (let i = 0; i < itemsVisible; i++) {
        const cloneFirst = itemsHot[i].cloneNode(true);
        const cloneLast = itemsHot[totalRealItems - 1 - i].cloneNode(true);
        trackHot.appendChild(cloneFirst);
        trackHot.insertBefore(cloneLast, trackHot.firstChild);
    }

    // 2. THIẾT LẬP VỊ TRÍ TỨC THỜI (Không dùng transition ở bước này)
    const updatePosition = () => {
        const itemWidth = document.querySelector('.item-hot').offsetWidth + gap;
        trackHot.style.transition = "none";
        trackHot.style.transform = `translateX(${-indexHot * itemWidth}px) translateZ(0)`;
    };

    indexHot = itemsVisible;
    updatePosition();

    // 3. HÀM CẬP NHẬT TRƯỢT
    function moveSlider(hasAnim = true) {
        const itemWidth = document.querySelector('.item-hot').offsetWidth + gap;
        trackHot.style.transition = hasAnim ? "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)" : "none";
        trackHot.style.transform = `translateX(${-indexHot * itemWidth}px) translateZ(0)`;
        
        let dotIndex = (indexHot - itemsVisible) % totalRealItems;
        if (dotIndex < 0) dotIndex = totalRealItems + dotIndex;
        
        dotsHot.forEach((dot, i) => {
            dot.classList.toggle('active-hot', i === dotIndex);
        });
    }

    // 4. CHẠY VÒNG TRÒN VÔ TẬN
    trackHot.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (indexHot >= totalRealItems + itemsVisible) {
            indexHot = itemsVisible;
            moveSlider(false);
        }
        if (indexHot <= 0) {
            indexHot = totalRealItems;
            moveSlider(false);
        }
    });

    const nextSlide = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        indexHot++;
        moveSlider();
    };

    nextBtnHot.onclick = () => { nextSlide(); startTimer(); };
    prevBtnHot.onclick = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        indexHot--;
        moveSlider();
        startTimer();
    };

    // 5. QUẢN LÝ THỜI GIAN CHẠY TỰ ĐỘNG
    const startTimer = () => {
        clearInterval(autoPlay);
        autoPlay = setInterval(nextSlide, 3000);
    };

    // Khởi động chạy ngay
    startTimer();

    // Tạm dừng khi rê chuột
    trackHot.parentElement.onmouseenter = () => clearInterval(autoPlay);
    trackHot.parentElement.onmouseleave = startTimer;
}

// Gọi hàm khởi tạo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHotSlider);
} else {
    initHotSlider(); // Nếu trang đã load xong thì chạy luôn
}

//review

 const track = document.getElementById('track');
  const prev1 = document.getElementById('prevreview');
  const next2 = document.getElementById('nextreview');

  let index = 0;

  function itemWidth() {
    return track.children[0].offsetWidth + 24;
  }

  function update() {
    track.style.transform = `translateX(-${index * itemWidth()}px)`;
  }

  nextreview.onclick = () => {
    const max = track.children.length - 3;
    if (index < max) {
      index++;
      update();
    }
  };

  prevreview.onclick = () => {
    if (index > 0) {
      index--;
      update();
    }
  };

  window.addEventListener('resize', update);

  // COLLAPSE REVIEW
  document.querySelectorAll('.toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.previousElementSibling;
      text.classList.toggle('line-clamp-2');
      btn.textContent = text.classList.contains('line-clamp-2')
        ? 'Xem thêm'
        : 'Thu gọn';
    });
  });
});
function initHeader() {
  const menuToggle = document.getElementById("mobile-menu");
  const menuBar = document.getElementById("menuBar");

  if (!menuToggle || !menuBar) {
    console.warn("❌ Không tìm thấy menu header");
    return;
  }

  // Toggle menu mobile
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menuBar.classList.toggle("active");

    const icon = menuToggle.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");
  });

  // Click ra ngoài thì đóng
  document.addEventListener("click", (e) => {
    if (!menuBar.contains(e.target) && !menuToggle.contains(e.target)) {
      menuBar.classList.remove("active");
    }
  });

  // LOGIN STATE
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const loginText = document.getElementById("loginText");
  const registerText = document.getElementById("registerText");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser && currentUser.username) {
    loginText.textContent = currentUser.username;
    loginBtn.href = "../account.html";

    registerText.textContent = "Đăng xuất";
    registerBtn.href = "#";

    registerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      location.reload();
    });
  } else {
    loginText.textContent = "Đăng nhập";
    registerText.textContent = "Đăng ký";
    loginBtn.href = "../login.html";
    registerBtn.href = "../register.html";
  }
}


document.addEventListener("headerLoaded", () => {

  // 🔥 KHỞI TẠO MENU & LOGIN
  initHeader();

  // ACTIVE MENU
  const currentPage =
    window.location.pathname.split("/").pop() || "homepage.html";

  const menuLinks = document.querySelectorAll(".menu-bar a");

  menuLinks.forEach(link => {
    const linkPage = link.getAttribute("href").split("/").pop();
    link.classList.toggle("active", linkPage === currentPage);
  });
});

