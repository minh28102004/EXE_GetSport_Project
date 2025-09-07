import React, { useState, useEffect } from "react";
import { Clock, Search, Star, TrendingUp } from "lucide-react";
import Pagination from "@components/Pagination";
import { posts, categories } from "./data";
import type { Post } from "./data";
const POSTS_PER_PAGE = 9;

const PostCard = ({ post, index }: { post: Post; index: number }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <article
      className="group relative bg-white rounded-3xl shadow-lg overflow-hidden 
      hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 "
    >
      {/* Featured Badge */}
      {post.featured && (
        <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          NỔI BẬT
        </div>
      )}

      <div className="relative">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Author Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${post.avatarColor} flex items-center justify-center text-sm font-bold border-2 border-white/30`}
              >
                {post.initials}
              </div>
              <div>
                <div className="font-semibold text-sm">{post.author}</div>
                <div className="text-xs opacity-80 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 shrink-0 relative top-[0.5px]" />
                  <span className="leading-none relative bottom-[-1px] ml-0.5">
                    {post.date} • {post.time}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg text-xs">
              {post.category}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors leading-tight text-xl">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed text-sm line-clamp-2">
          {post.description}
        </p>

        {/* Stats & CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-gray-500">
            {/* Like */}
            <span
              className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer"
              onClick={() => setIsLiked(!isLiked)}
            >
              <svg
                className={`w-4 h-4 ${isLiked ? "text-red-500" : ""}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              {post.likes}
            </span>

            {/* Comment */}
            <span className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 
               0 01-4.083-.98L2 17l1.338-3.123C2.493 
               12.767 2 11.434 2 10c0-3.866 3.582-7 
               8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 
               0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              {post.comments}
            </span>
          </div>

          {/* Read More */}
          <button className="group relative text-teal-600 font-medium text-sm flex items-center gap-1 transition-all duration-300 hover:brightness-60 hover:translate-x-1">
            Đọc Thêm »
          </button>
        </div>
      </div>
    </article>
  );
};

const BlogPost = ({ index = 0 }: { index?: number }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Paging logic
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50">
      {/* Custom CSS for animations */}

      {/* Title */}
      <section className="relative py-6 text-center overflow-hidden">
        <div className="relative mx-auto">
          {/* Sub-title nhỏ 🏸 */}
          <div className="inline-block bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent text-lg font-bold mb-0.5 ">
            🏸 BLOG CẦU LÔNG CHUYÊN NGHIỆP
          </div>

          {/* Tiêu đề chính */}
          <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2 leading-snug ">
            Cộng Đồng & Kiến Thức
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500 -mt-1.5 ">
              Cầu Lông Việt Nam
            </span>
          </div>

          {/* Mô tả */}
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4 leading-relaxed ">
            Chia sẻ kinh nghiệm, tips hữu ích và kết nối với cộng đồng người
            chơi cầu lông trên khắp cả nước. Từ người mới bắt đầu đến pro
            player.
          </p>
          {/* Floating elements decoration */}
          <div
            className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full opacity-10 animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-32 right-16 w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-10 animate-bounce"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className="absolute top-48 left-1/4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-10 animate-bounce"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="sm:px-20 px-5 pb-13">
        <div className="mx-auto">
          {paginatedPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-14">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                Không tìm thấy bài viết
              </h3>
              <p className="text-gray-500">
                Thử tìm kiếm với từ khóa khác hoặc chọn category khác
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
