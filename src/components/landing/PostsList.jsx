import React, { useEffect, useState } from "react";
import { createClient } from "contentful";

const client = createClient({
  space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

export default function PostsList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const res = await client.getEntries({
        content_type: "post",
        order: "-fields.date",
      });
      setPosts(res.items);
    }
    fetchPosts();
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Bài viết mới nhất</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.sys.id}
              className="p-4 bg-white rounded-2xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold mb-2">
                {post.fields.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {post.fields.description}
              </p>
              <a
                href={`/blog/${post.fields.slug}`}
                className="text-blue-600 font-medium hover:underline"
              >
                Đọc thêm →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
