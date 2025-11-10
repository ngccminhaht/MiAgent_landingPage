// src/lib/contentful.js

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
      // === THAY ĐỔI QUAN TRỌNG ===
      // Tăng giới hạn từ 20 lên 100 để lấy TẤT CẢ bài viết
      // (Contentful có giới hạn mặc định 100 nếu không set)
      limit: 100, 
      // ===========================
    });
    return entries.items;
  } catch (error) {
    console.error('Lỗi khi fetch bài viết từ Contentful:', error);
    return [];
  }
}

// Hàm mới: Xử lý và chia tách dữ liệu blog
export async function getProcessedBlogData() {
    // 1. FETCH DỮ LIỆU THÔ (Bây giờ sẽ lấy tối đa 100 bài)
    const posts = await getBlogPosts();

    // 2. ĐỊNH HÌNH LẠI DỮ LIỆU (Data Transformation)
    const blogEntries = posts.map((item) => ({
        title: item.fields?.title,
        slug: item.fields?.slug,
        excerpt: item.fields?.excerpt,
        category: item.fields?.category,
        thumbnailUrl: item.fields?.thumbnail?.fields?.file?.url ?? '/images/default-placeholder.jpg',
        publishedDate: item.fields?.publishedAt ? new Date(item.fields.publishedAt).toLocaleDateString('vi-VN') : 'N/A',
    }));

    // 3. TÁCH BÀI VIẾT (Split Featured/Remaining)
    //    Giờ đây blogEntries có thể có 50 bài
    const featuredPost = blogEntries[0];      // 1 bài nổi bật
    const remainingPosts = blogEntries.slice(1); // 49 bài còn lại

    return {
        blogEntries,     // Toàn bộ 50 bài
        featuredPost,    // 1 bài nổi bật
        remainingPosts,  // 49 bài còn lại
    };
}