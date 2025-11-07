// src/lib/contentful.js
import * as contentful from 'contentful';

// Khởi tạo Contentful Client sử dụng biến môi trường
const client = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
});

/**
 * Lấy danh sách tất cả bài viết blog đã xuất bản
 */
export async function getBlogPosts() {
  try {
    const entries = await client.getEntries({
      content_type: 'post', // SỬ DỤNG ID CONTENT MODEL CỦA BẠN
      order: '-fields.publishedAt', // Sắp xếp theo ngày đăng (PublishedAt) giảm dần
      include: 2,
    });
    return entries.items;
  } catch (error) {
    console.error('Lỗi khi fetch bài viết từ Contentful:', error);
    return [];
  }
}