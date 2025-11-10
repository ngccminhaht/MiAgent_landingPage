import * as contentful from 'contentful';

// Khởi tạo Contentful Client sử dụng biến môi trường
const client = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
});

// Hàm gốc: Lấy dữ liệu thô từ Contentful (Tối ưu với limit)
export async function getBlogPosts() {
  try {
    const entries = await client.getEntries({
      content_type: 'post', 
      order: '-fields.publishedAt', 
      include: 2, 
      limit: 20, // Giới hạn 20 bài viết mới nhất
    });
    return entries.items;
  } catch (error) {
    console.error('Lỗi khi fetch bài viết từ Contentful:', error);
    return [];
  }
}

// Hàm mới: Xử lý và chia tách dữ liệu blog
export async function getProcessedBlogData() {
    // 1. FETCH DỮ LIỆU THÔ
    const posts = await getBlogPosts();

    // 2. ĐỊNH HÌNH LẠI DỮ LIỆU (Data Transformation)
    // Loại bỏ kiểu TypeScript (any) ở đây để giữ code JavaScript thuần
    const blogEntries = posts.map((item) => ({
        // Ép kiểu trong runtime JS (chỉ an toàn khi đã fix lỗi TS bằng as any ở file Astro)
        title: item.fields?.title,
        slug: item.fields?.slug,
        excerpt: item.fields?.excerpt,
        category: item.fields?.category,
        
        // Xử lý an toàn Thumbnail
        thumbnailUrl: item.fields?.thumbnail?.fields?.file?.url ?? '/images/default-placeholder.jpg',
        
        // Định dạng lại ngày tháng
        publishedDate: item.fields?.publishedAt ? new Date(item.fields.publishedAt).toLocaleDateString('vi-VN') : 'N/A',
    }));

    // 3. TÁCH BÀI VIẾT (Split Featured/Remaining)
    const featuredPost = blogEntries[0];        
    const remainingPosts = blogEntries.slice(1); 

    return {
        blogEntries, // Toàn bộ danh sách
        featuredPost, // Bài viết nổi bật (phần tử đầu)
        remainingPosts, // Các bài viết còn lại
    };
}