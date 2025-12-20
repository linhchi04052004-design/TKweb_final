const getLocalTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Biến lưu trữ trạng thái đặt bàn
let bookingState = {
    guests: 1,
    date: getLocalTodayString(),
    time: "",
    restaurant: "Sushi Fuji Nguyễn Chí Thanh",
    finalData: {} // Lưu dữ liệu cuối cùng để hiển thị trang chi tiết
};

// --- QUẢN LÝ SỐ KHÁCH ---
window.changeGuest = (val) => {
    bookingState.guests = Math.max(1, bookingState.guests + val);
    const guestEl = document.getElementById('guestCount');
    if (guestEl) guestEl.innerText = bookingState.guests;
};

// --- QUẢN LÝ DROPDOWN GIỜ ---
const setupTimeDropdown = () => {
    const trigger = document.getElementById('timeTrigger');
    if (!trigger) return;

    trigger.onclick = (e) => {
        e.stopPropagation();
        const options = document.getElementById('timeOptions');
        options.classList.toggle('invisible');
        options.classList.toggle('opacity-0');
        options.classList.toggle('translate-y-[-10px]');
    };

    window.onclick = () => {
        const options = document.getElementById('timeOptions');
        if (options) {
            options.classList.add('invisible');
            options.classList.add('opacity-0');
            options.classList.add('translate-y-[-10px]');
        }
    };
};

document.addEventListener('DOMContentLoaded', async () => {
    setupTimeDropdown();
    const config = await loadConfig();
    if (config) {
        bookingState.restaurant = config.restaurantName || "Sushi Fuji Nguyễn Chí Thanh";
        initDate(config);
        generateTimeSlots(config);
    }
});

async function loadConfig() {
    try {
        const res = await fetch('./data/time.json');
        return await res.json();
    } catch (e) { 
        return { openingHour: 10, closingHour: 22, bufferMinutes: 30, restaurantName: "Sushi Fuji Nguyễn Chí Thanh" }; 
    }
}

function initDate(config) {
    const el = document.getElementById('bookingDate');
    if (!el) return;
    const today = getLocalTodayString();
    el.value = today;
    el.min = today; 
    el.onchange = (e) => {
        bookingState.date = e.target.value;
        bookingState.time = ""; 
        document.getElementById('selectedTimeText').innerText = "Thời gian";
        generateTimeSlots(config);
    };
}

function generateTimeSlots(config) {
    const optionsContainer = document.getElementById('timeOptions');
    if (!optionsContainer) return;
    const now = new Date();
    const todayStr = getLocalTodayString();
    
    optionsContainer.innerHTML = '';
    let hasSlots = false;

    for (let h = config.openingHour; h < config.closingHour; h++) {
        ["00", "30"].forEach(m => {
            const timeStr = `${h.toString().padStart(2, '0')}:${m}`;
            const slot = new Date(bookingState.date + 'T' + timeStr);
            const buffer = new Date(now.getTime() + (config.bufferMinutes * 60000));
            const isToday = bookingState.date === todayStr;

            if (!isToday || slot > buffer) {
                const item = document.createElement('div');
                item.className = "p-3 hover:bg-fujiRed hover:text-white cursor-pointer transition text-center border-b border-gray-50 last:border-none";
                item.innerText = timeStr;
                item.onclick = (e) => {
                    e.stopPropagation();
                    bookingState.time = timeStr;
                    document.getElementById('selectedTimeText').innerText = timeStr;
                    optionsContainer.classList.add('invisible', 'opacity-0', 'translate-y-[-10px]');
                };
                optionsContainer.appendChild(item);
                hasSlots = true;
            }
        });
    }

    if (!hasSlots) {
        optionsContainer.innerHTML = '<div class="p-4 text-gray-400 text-sm text-center">Hết chỗ hôm nay</div>';
    }
}

// --- 1. XÁC NHẬN THÔNG TIN (HIỆN MODAL ĐỎ) ---
window.handleConfirm = () => {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const note = document.getElementById('custNote').value.trim();

    if (!bookingState.time || bookingState.time === "") return alert("Vui lòng chọn khung giờ!");
    if (!name || !phone) return alert("Vui lòng điền Họ tên và Số điện thoại!");

    const body = document.getElementById('modalBody');
    body.innerHTML = `
        <div class="space-y-3">
            <div class="flex justify-between border-b pb-2"><span class="text-gray-400">Nhà hàng</span><span class="font-bold text-fujiRed">${bookingState.restaurant}</span></div>
            <div class="flex justify-between border-b pb-2"><span class="text-gray-400">Thời gian</span><span class="font-bold">${bookingState.time} | ${bookingState.date}</span></div>
            <div class="flex justify-between border-b pb-2"><span class="text-gray-400">Số lượng</span><span class="font-bold">${bookingState.guests} khách</span></div>
            <div class="flex justify-between border-b pb-2"><span class="text-gray-400">Họ tên</span><span class="font-bold uppercase">${name}</span></div>
            <div class="flex justify-between border-b pb-2"><span class="text-gray-400">SĐT</span><span class="font-bold">${phone}</span></div>
            <div class="flex justify-between pt-1">
                <span class="text-gray-400">Lưu ý</span>
                <span class="font-bold text-right italic text-gray-600">${note || 'Không có'}</span>
            </div>
        </div>
    `;

    document.getElementById('summaryModal').classList.remove('hidden');
};

/// --- 2. GỬI ĐƠN ĐẶT BÀN (CẬP NHẬT: LƯU DATA VÀO BỘ NHỚ) ---
window.submitBooking = () => {
    // 1. Tạo dữ liệu ngẫu nhiên và thời gian hiện tại
    const bookingID = Math.floor(10000000 + Math.random() * 90000000);
    const now = new Date();
    const timeCreated = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 2. Gom toàn bộ thông tin vào một biến Object
    const dataToSave = {
        id: bookingID,
        createdTime: timeCreated, // Giờ đặt (VD: 07:22)
        mealTime: bookingState.time, // Giờ ăn (VD: 10:00)
        mealDate: bookingState.date,
        guests: bookingState.guests,
        name: document.getElementById('custName').value.trim(),
        phone: document.getElementById('custPhone').value.trim(),
        email: "hwanyi@gmail.com", // Giả lập vì form của bạn chưa có ô email
        note: document.getElementById('custNote').value.trim(),
        restaurantName: bookingState.restaurant
    };

    // 3. LƯU VÀO LOCAL STORAGE (Quan trọng nhất)
    localStorage.setItem('fujiBookingData', JSON.stringify(dataToSave));

    // 4. Hiển thị ID lên popup và xử lý giao diện như cũ
    const idDisplay = document.getElementById('displayBookingID');
    if (idDisplay) idDisplay.innerText = bookingID;

    closeModal();
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.remove('hidden');
    }
};

// --- 3. THEO DÕI ĐẶT BÀN (HIỆN TRANG CHI TIẾT - ẢNH 2) ---
window.showDetailsView = () => {
    const data = bookingState.finalData;

    // Đổ dữ liệu vào trang chi tiết
    if(document.getElementById('detID')) document.getElementById('detID').innerText = `#${data.id}`;
    if(document.getElementById('detBookingTime')) document.getElementById('detBookingTime').innerText = `Hôm nay - ${data.timeCreated}`;
    if(document.getElementById('detMealTime')) document.getElementById('detMealTime').innerText = `Hôm nay - ${bookingState.time}`;
    if(document.getElementById('detGuests')) document.getElementById('detGuests').innerText = `${bookingState.guests} người`;
    if(document.getElementById('detName')) document.getElementById('detName').innerText = data.name;
    if(document.getElementById('detPhone')) document.getElementById('detPhone').innerText = data.phone;
    if(document.getElementById('detNote')) document.getElementById('detNote').innerText = data.note || "Không có";

    // Ẩn popup thành công, hiện trang chi tiết (Ảnh 2)
    document.getElementById('successModal').classList.add('hidden');
    document.getElementById('detailsView').classList.remove('hidden');
};

window.closeModal = () => {
    const modal = document.getElementById('summaryModal');
    if (modal) modal.classList.add('hidden');
};