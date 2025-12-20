async function fetchBlogs() {
    try {
        // Gọi file từ thư mục data
        const response = await fetch('./data/blog.json'); 
        
        if (!response.ok) throw new Error('Không tìm thấy file blog.json');
        
        const data = await response.json();
        const container = document.getElementById('blog-container');
        
        // Dùng đúng các tên: title, description, image như trong JSON của bạn
        container.innerHTML = data.map(blog => `
            <div class="blog-card">
                <div class="image-wrapper">
                    <img src="${blog.image}" alt="${blog.title}" 
                         onerror="this.src='https://via.placeholder.com/400x250?text=Loi+Anh'">
                </div>
                <div class="blog-content">
                    <h3>${blog.title}</h3>
                    <p>${blog.description}</p>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error("Lỗi hiển thị:", error);
    }
}
fetchBlogs();