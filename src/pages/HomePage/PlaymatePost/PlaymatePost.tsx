import { useEffect, useState } from "react";
import { Clock, Users, MapPin, ArrowLeft, UserPlus, UserMinus, Search, Filter } from "lucide-react";
import Pagination from "@components/Pagination";
import { useGetPlaymatePostsQuery, useGetPlaymatePostQuery } from "@redux/api/playmatePost/playmatePostApi"; // Adjust path if needed
import { useGetMyPlaymateJoinsQuery, useCreatePlaymateJoinMutation, useDeletePlaymateJoinMutation } from "@redux/api/playmateJoin/playmateJoinApi"; // Adjust path if needed
import type { PlaymatePost, PlaymatePostFilterParams, PlaymateJoin } from "@redux/api/playmatePost/type"; // Adjust types path
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/features/auth/authSlice";

const POSTS_PER_PAGE = 9;

/* ====== Playmate Post Card ====== */
const PlaymatePostCard = ({ post }: { post: PlaymatePost }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/playPost/${post.id}`);
  };

  return (
    <article
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
    >
      {/* Cover Image - Use first court image or fallback */}
      <div className="relative">
        <img
          src={post.courtImageUrls[0] || 'https://via.placeholder.com/400x240'} // Fallback image
          alt={post.courtName}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Overlay Info */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-semibold">{post.courtName}</span>
            </div>
            <div className="bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-md text-xs">
              {post.skilllevel}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors text-lg">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-3 text-sm line-clamp-2">
          {post.content}
        </p>
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
         <div className="flex items-center gap-1 text-gray-600 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />{post.slotStarttime} — {post.slotEndtime}
            </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {post.currentPlayers}/{post.neededplayers} players
          </div>
        </div>
        <button
          onClick={handleViewDetails}
          className="w-full bg-teal-600 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Xem chi tiết
        </button>
      </div>
    </article>
  );
};

/* ====== Playmate Post List Page ====== */
const PlaymatePostList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [skilllevel, setSkilllevel] = useState('');
  const [sortBy, setSortBy] = useState('createdat');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
 const { accessToken } = useSelector(selectAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      const redirectUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`/auth?view=login&redirect=${redirectUrl}`);
    }
  }, [accessToken, navigate]);
  const params: PlaymatePostFilterParams = {
    search: search || undefined,
    status: status || undefined,
    skilllevel: skilllevel || undefined,
    sortBy,
    sortOrder,
    page: currentPage,
    pageSize: POSTS_PER_PAGE,
  };

  const { data, isLoading, isError } = useGetPlaymatePostsQuery(params);

  const posts = data?.data && 'items' in data.data ? data.data.items : (data?.data as PlaymatePost[]) || [];
  const totalPages = data?.data && 'totalPages' in data.data ? data.data.totalPages : Math.ceil((data?.data as PlaymatePost[] || []).length / POSTS_PER_PAGE) || 1;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Title Section */}
      <section className="relative py-8 text-center">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            Tìm Bạn Chơi Cầu Lông
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kết nối với các cầu thủ khác để tham gia trận đấu tại các sân gần bạn.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="px-5 md:px-8 pb-5">
        <div className="mx-auto w-full max-w-7xl flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Open">Mở</option>
            <option value="Closed">Đóng</option>
            {/* Add more statuses if needed */}
          </select>
          <select
            value={skilllevel}
            onChange={(e) => setSkilllevel(e.target.value)}
            className="py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
          >
            <option value="">Tất cả trình độ</option>
            <option value="Beginner">Mới bắt đầu</option>
            <option value="Intermediate">Trung bình</option>
            <option value="Advanced">Nâng cao</option>
            {/* Add more skill levels if needed */}
          </select>
          <select
            value={`${sortBy}|${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('|');
              setSortBy(by);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500"
          >
            <option value="createdat|desc">Mới nhất</option>
            <option value="createdat|asc">Cũ nhất</option>
            <option value="title|asc">Tiêu đề A-Z</option>
            <option value="title|desc">Tiêu đề Z-A</option>
          </select>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="px-5 md:px-8 pb-10">
        <div className="mx-auto w-full max-w-7xl">
          {isLoading ? (
            <div className="text-center py-14">Đang tải...</div>
          ) : isError ? (
            <div className="text-center py-14 text-red-500">Lỗi khi tải dữ liệu</div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PlaymatePostCard key={post.id} post={post} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="text-center py-14">
              <h3 className="text-xl font-bold text-gray-600 mb-1.5">Không tìm thấy bài đăng</h3>
              <p className="text-gray-500 text-sm">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PlaymatePostList;

