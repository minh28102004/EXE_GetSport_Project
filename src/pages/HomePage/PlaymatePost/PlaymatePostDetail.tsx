import { Clock, Users, MapPin, ArrowLeft, UserPlus, UserMinus } from "lucide-react";
import { useGetPlaymatePostQuery } from "@redux/api/playmatePost/playmatePostApi"; 
import { useGetMyPlaymateJoinsQuery, useCreatePlaymateJoinMutation, useDeletePlaymateJoinMutation, useGetPlaymateJoinsQuery } from "@redux/api/playmateJoin/playmateJoinApi"; 
import type { PlaymateJoin } from "@redux/api/playmateJoin/type"; // Corrected import path for PlaymateJoin
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/features/auth/authSlice";

/* ====== Playmate Post Detail Page ====== */
const PlaymatePostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const loc = useLocation();
  const { data: postData, isLoading: postLoading, isError: postError } = useGetPlaymatePostQuery(Number(id) || 0);
  const { data: joinsData } = useGetPlaymateJoinsQuery({ postId: Number(id) });
  const { data: myJoinsData } = useGetMyPlaymateJoinsQuery({ postId: Number(id) });
  const [createJoin, { isLoading: joinLoading }] = useCreatePlaymateJoinMutation();
  const [deleteJoin] = useDeletePlaymateJoinMutation();
  const { accessToken } = useSelector(selectAuth);
  
  useEffect(() => {
    if (!accessToken) {
      const redirectUrl = encodeURIComponent(loc.pathname + loc.search);
      navigate(`/auth?view=login&redirect=${redirectUrl}`);
    }
  }, [accessToken, navigate, loc]);

  const post = postData?.data;
  const joins = joinsData?.data && 'items' in joinsData.data ? joinsData.data.items : (joinsData?.data as PlaymateJoin[]) || [];
  const myJoin = myJoinsData?.data && 'items' in myJoinsData.data ? myJoinsData.data.items[0] : (myJoinsData?.data as PlaymateJoin[] || [])[0];

  if (postLoading) return <div className="text-center py-14">Đang tải...</div>;
  if (postError || !post) return <div className="text-center py-14 text-red-500">Bài đăng không tồn tại</div>;

  const handleJoin = async () => {
    if (post.currentPlayers >= post.neededplayers || post.status !== 'Open') return; 
    await createJoin({ postId: post.id });
  };

  const handleLeave = async () => {
    if (myJoin) await deleteJoin(myJoin.id);
  };

  const showJoinButton = !myJoin && post.currentPlayers < post.neededplayers && post.status == 'Open';
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back Button */}
      <section className="px-5 md:px-8 pt-5">
        <button onClick={() => navigate('/playmate-posts')} className="flex items-center gap-2 text-teal-600 hover:text-teal-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Quay lại danh sách
        </button>
      </section>

      {/* Title Section */}
      <section className="relative py-8 text-center">
        <div className="mx-auto w-full max-w-4xl px-5 md:px-8">
          <h1 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">{post.title}</h1>
          <p className="text-lg text-gray-600 mb-6">{post.content}</p>
          <div className="flex items-center justify-center gap-4 text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(post.bookingdate).toLocaleDateString()} {post.slotStarttime} - {post.slotEndtime}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {post.courtName} - {post.courtLocation}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {post.currentPlayers}/{post.neededplayers} players
            </div>
            <div>{post.skilllevel}</div>
            <div className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm">{post.status}</div>
          </div>
        </div>
      </section>

      {/* Court Image */}
      {post.courtImageUrls.length > 0 && (
        <section className="px-5 md:px-8">
          <div className="mx-auto w-full max-w-4xl">
            <img src={post.courtImageUrls[0]} alt={post.courtName} className="w-full h-auto rounded-2xl shadow-lg mb-8" />
          </div>
        </section>
      )}

      {/* Join Button */}
      <section className="px-5 md:px-8 pb-5">
        <div className="mx-auto w-full max-w-4xl">
          {myJoin ? (
            <button
              onClick={handleLeave}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 transition-colors"
              disabled={joinLoading}
            >
              <UserMinus className="w-5 h-5" />
              Rời khỏi nhóm
            </button>
          ) : showJoinButton ? (
            <button
              onClick={handleJoin}
              className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 transition-colors"
              disabled={joinLoading}
            >
              <UserPlus className="w-5 h-5" />
              Tham gia
            </button>
          ) : (
            <p className="text-gray-600">Nhóm đã đầy hoặc đã đóng.</p>
          )}
        </div>
      </section>

      {/* Joined Users List */}
      <section className="px-5 md:px-8 pb-10">
        <div className="mx-auto w-full max-w-4xl">
          <h3 className="font-bold text-xl mb-4">Người tham gia ({joins.length})</h3>
          {joins.length > 0 ? (
            <ul className="space-y-3">
              {joins.map((join) => (
                <li key={join.id} className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
                    {join.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{join.userName}</p>
                    <p className="text-sm text-gray-500">Tham gia lúc: {new Date(join.joinedat).toLocaleDateString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Chưa có người tham gia.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default PlaymatePostDetail;