import React from "react";
import { Clock, Star } from "lucide-react";
import { posts } from "@pages/HomePage/BlogPost/data";
import type { Post } from "@pages/HomePage/BlogPost/data";
import endPoint from "@routes/router";

/* ---------- Post Card (đã hạ size) ---------- */
const PostCard = ({ post }: { post: Post }) => {
  return (
    <article className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2">
      {/* Featured Badge */}
      {post.featured && (
        <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          NỔI BẬT
        </div>
      )}

      <div className="relative">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Author Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-full ${post.avatarColor} flex items-center justify-center text-[13px] font-bold border-2 border-white/30`}
              >
                {post.initials}
              </div>
              <div>
                <div className="font-semibold text-[13px] leading-none">
                  {post.author}
                </div>
                <div className="text-[11px] opacity-80 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 shrink-0 relative top-[0.5px]" />
                  <span className="leading-none relative bottom-[-1px] ml-0.5">
                    {post.date} • {post.time}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[11px]">
              {post.category}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-2.5 group-hover:text-teal-600 transition-colors leading-tight text-lg">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-5 leading-relaxed text-sm line-clamp-2">
          {post.description}
        </p>

        {/* Stats & CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5 text-sm text-gray-500">
            {/* Like */}
            <span className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
          <a
            href={endPoint.BLOGPOST}
            className="group relative text-teal-600 font-medium text-sm flex items-center gap-1 
                       transition-all duration-300 hover:brightness-75 hover:translate-x-1"
          >
            Đọc Thêm »
          </a>
        </div>
      </div>
    </article>
  );
};

/* ---------- Community Section (đã hạ size) ---------- */
const CommunitySection = () => {
  const featuredPosts = posts.filter((p) => p.featured);

  let displayPosts: typeof posts = [];

  if (featuredPosts.length > 0) {
    displayPosts = featuredPosts.slice(0, 3);
    if (displayPosts.length < 3) {
      const remainingPosts = posts
        .filter((p) => !p.featured)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      displayPosts = [
        ...displayPosts,
        ...remainingPosts.slice(0, 3 - displayPosts.length),
      ];
    }
  } else {
    displayPosts = [...posts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }

  return (
    <section className="py-8 sm:py-14 bg-gray-50">
      {/* dùng px chuẩn thay lg:px-15 */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900 mb-2">
            Cộng Đồng Cầu Lông
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Chia sẻ kinh nghiệm và kết nối với cộng đồng người chơi cầu lông
            trên khắp cả nước.
          </p>
        </div>

        {/* Posts */}
        <div className="grid md:grid-cols-3 gap-6">
          {displayPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Button */}
        <div className="text-center mt-10">
          <a
            href={endPoint.BLOGPOST}
            className="group inline-flex items-center gap-1 px-3 py-1.5 border-2 border-teal-200 text-teal-600 rounded-xl font-medium
                       hover:bg-teal-50 hover:border-teal-300 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
          >
            Xem Thêm Bài Viết
            <span className="transform transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
