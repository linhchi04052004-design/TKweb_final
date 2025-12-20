// Hàm tiện ích để lấy ngày hiện tại theo giờ địa phương định dạng YYYY-MM-DD
const getLocalTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

let bookingState = {
    guests: 2,
    date: getLocalTodayString(), // ĐÃ SỬA: Lấy ngày theo giờ địa phương thay vì ISOString
    time: "",
    restaurant: "Sushi Fuji Nguyễn Chí Thanh"
};

document.addEventListener('DOMContentLoaded', async () => {
    const config = await loadConfig();
    if (config) {
        bookingState.restaurant = config.restaurantName;
        initDate(config);
        generateTimeSlots(config);
    }
});

async function loadConfig() {
    try {
        const res = await fetch('./data/time.json');
        return await res.json();
    } catch (e) { return null; }
}

function initDate(config) {
    const el = document.getElementById('bookingDate');
    el.value = bookingState.date;
    el.min = bookingState.date; // Chặn ngày quá khứ
    el.onchange = (e) => {
        bookingState.date = e.target.value;
        bookingState.time = ""; // Reset giờ khi đổi ngày
        generateTimeSlots(config);
    };
}

function generateTimeSlots(config) {
    const container = document.getElementById('timeSlotsContainer');
    const now = new Date();
    container.innerHTML = "";

    // Lấy ngày hiện tại thực tế để so sánh logic "hôm nay"
    const todayStr = getLocalTodayString(); 

    for (let h = config.openingHour; h < config.closingHour; h++) {
        ["00", "30"].forEach(m => {
            const timeStr = `${h.toString().padStart(2, '0')}:${m}`;
            const slot = new Date(bookingState.date);
            slot.setHours(h, parseInt(m), 0);

            // Logic thực: Giờ hiện tại + 30 phút buffer
            const buffer = new Date(now.getTime() + (config.bufferMinutes * 60000));
            
            // ĐÃ SỬA: So sánh với ngày địa phương thực tế
            const isToday = bookingState.date === todayStr;

            if (!isToday || slot > buffer) {
                const btn = document.createElement('button');
                btn.innerText = timeStr;
                btn.className = "p-2 border border-gray-100 rounded-lg text-xs hover:border-fujiRed transition";
                btn.onclick = () => {
                    document.querySelectorAll('#timeSlotsContainer button').forEach(b => 
                        b.className = "p-2 border border-gray-100 rounded-lg text-xs transition");
                    btn.className = "p-2 bg-fujiRed text-white rounded-lg text-xs font-bold shadow-md";
                    bookingState.time = timeStr;
                };
                container.appendChild(btn);
            }
        });
    }
}

// HÀM XỬ LÝ KHI NHẤN NÚT XÁC NHẬN
function handleConfirm() {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();

    if (!bookingState.time) return alert("Vui lòng chọn khung giờ đặt bàn!");
    if (!name || !phone) return alert("Vui lòng điền đầy đủ Họ tên và Số điện thoại!");

    const body = document.getElementById('modalBody');
    body.innerHTML = `
        <div class="space-y-3">
            <div class="flex justify-between border-b pb-2"><span class="text-gray-400">Nhà hàng</span><span class="font-bold text-fujiRed">${bookingState.restaurant}</span></div>
            <div class="flex justify-between border-b pb-2"><span class="text-gray-400">Thời gian</span><span class="font-bold">${bookingState.time} | ${bookingState.date}</span></div>
            <div class="flex justify-between border-b pb-2"><span class="text-gray-400">Số lượng khách</span><span class="font-bold">${bookingState.guests} khách</span></div>
            <div class="flex justify-between border-b pb-2"><span class="text-gray-400">Họ và tên</span><span class="font-bold">${name}</span></div>
            <div class="flex justify-between"><span class="text-gray-400">Số điện thoại</span><span class="font-bold">${phone}</span></div>
        </div>
        <p class="text-[10px] text-gray-400 italic text-center pt-4 italic">* Đơn đặt bàn sẽ được nhà hàng liên hệ lại trong ít phút.</p>
    `;

    document.getElementById('summaryModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('summaryModal').classList.add('hidden');
}

window.changeGuest = (val) => {
    bookingState.guests = Math.max(1, bookingState.guests + val);
    document.getElementById('guestCount').innerText = bookingState.guests;
};