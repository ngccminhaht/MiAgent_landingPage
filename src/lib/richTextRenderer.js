import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';

// Các quy tắc xử lý node tùy chỉnh
const options = {
  renderNode: {
    // 1. Xử lý khối ảnh được nhúng (EMBEDDED_ASSET)
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { title, description, file } = node.data.target.fields;
      
      if (!file || !file.url) {
        return ''; 
      }

      // Tạo thẻ HTML cho ảnh nhúng
      return `
        <figure class="my-8">
          <img 
            src="${file.url}" 
            alt="${description || title}" 
            loading="lazy"
            class="w-full h-auto object-cover rounded-lg"
          />
          <figcaption class="text-center text-sm text-gray-500 mt-2">${description || ''}</figcaption>
        </figure>
      `;
    },

    // 2. Xử lý liên kết đến Entry khác (nếu cần)
    [INLINES.ENTRY_HYPERLINK]: (node) => {
        // Giả sử Entry liên kết cũng có trường 'slug'
        return `<a href="/blog/${node.data.target.fields.slug}">${node.content[0].value}</a>`;
    },
    
    // (Bạn có thể thêm các xử lý cho H1, P, List nếu muốn thêm class CSS)
    // [BLOCKS.PARAGRAPH]: (node, next) => `<p class="leading-relaxed">${next(node.content)}</p>`,
  },
};

// Hàm xuất ra (export) để sử dụng trong file Astro
export const richTextToHtml = (richTextDocument) => {
  if (!richTextDocument) return '';
  return documentToHtmlString(richTextDocument, options);
};