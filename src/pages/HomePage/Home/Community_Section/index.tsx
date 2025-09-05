import React from "react";
import { Clock, Star, TrendingUp } from "lucide-react";
import { posts } from "@pages/HomePage/BlogPost/data";
import type { Post } from "@pages/HomePage/BlogPost/data";
import { Link } from "react-router-dom";

const PostCard = ({ post }: { post: Post }) => {
  return (
    <article
      className={`group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3`}
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
          <div className="flex items-center gap-6 text-sm text-gray-500 ">
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
          <button
            className="group relative text-teal-600 font-medium text-sm flex items-center gap-1 
  transition-all duration-300 hover:brightness-60 hover:translate-x-1"
          >
            Đọc Thêm »
          </button>
        </div>
      </div>
    </article>
  );
};

const CommunitySection = () => {
  const featuredPosts = posts.filter((p) => p.featured);

  let displayPosts: typeof posts = [];

  if (featuredPosts.length > 0) {
    // Lấy tối đa 3 featured
    displayPosts = featuredPosts.slice(0, 3);

    // Nếu chưa đủ 3 thì bù thêm bài mới nhất không trùng
    if (displayPosts.length < 3) {
      const remainingPosts = posts
        .filter((p) => !p.featured) // loại bỏ featured đã chọn
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

      displayPosts = [
        ...displayPosts,
        ...remainingPosts.slice(0, 3 - displayPosts.length),
      ];
    }
  } else {
    // Không có featured => lấy 3 bài mới nhất
    displayPosts = [...posts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-15">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cộng Đồng Cầu Lông
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chia sẻ kinh nghiệm và kết nối với cộng đồng người chơi cầu lông
            trên khắp cả nước.
          </p>
        </div>

        {/* Posts */}
        <div className="grid md:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Button */}
        <div className="text-center mt-12">
          <Link
            to="/blogPost"
            className="group inline-flex items-center gap-1 px-3 py-2 border-2 border-teal-200 text-teal-600 rounded-xl font-semibold 
               hover:bg-teal-50 hover:border-teal-300 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
          >
            Xem Thêm Bài Viết
            <span className="transform transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
