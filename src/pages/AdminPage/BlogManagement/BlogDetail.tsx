import React, { useEffect } from 'react';
import { X, FileText, Image, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGetBlogQuery } from '@redux/api/blog/blogApi';
import type { Blog } from '@redux/api/blog/type';
import LoadingSpinner from '@components/Loading_Spinner';

type Props = {
  blogId: number;
  onClose: () => void;
};

const labelCls = 'text-xs font-semibold text-gray-500 mb-1 block';

const Section: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="rounded-xl border border-slate-200 p-4">
    <div className="mb-3 flex items-center gap-2 text-slate-900">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600 ring-1 ring-teal-100">
        {icon}
      </span>
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);

const BlogDetail: React.FC<Props> = ({ blogId, onClose }) => {
  const { data, isLoading, isError } = useGetBlogQuery(blogId);
  const blog: Blog | undefined = data?.data;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (isLoading) return <div className="p-6 text-center"><LoadingSpinner inline /> Đang tải...</div>;
  if (isError || !blog) return <div className="p-6 text-center text-red-500">Lỗi khi tải dữ liệu blog.</div>;

  return (
    <div className="flex flex-col min-h-0 w-full max-h-[80vh] overflow-y-auto p-4">
      <div className="sticky top-0 z-10 -mt-2 -mx-2 flex items-center justify-between rounded-t-xl bg-white/90 px-2 py-2 backdrop-blur border-b">
        <h2 className="text-2xl font-semibold text-slate-900">Chi tiết Blog: {blog.title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 mt-4">
        <Section icon={<User className="w-4 h-4" />} title="Thông tin cơ bản">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tác giả</label>
              <p className="text-sm text-gray-600">{blog.authorName}</p>
            </div>
            <div>
              <label className={labelCls}>Tiêu đề</label>
              <p className="text-sm text-gray-600">{blog.title}</p>
            </div>
            <div>
              <label className={labelCls}>Mô tả ngắn</label>
              <p className="text-sm text-gray-600">{blog.shortdesc ?? '--'}</p>
            </div>
            <div>
              <label className={labelCls}>Trạng thái</label>
              <p className="text-sm text-gray-600">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    blog.status === 'Published'
                      ? 'bg-green-100 text-green-700'
                      : blog.status === 'Draft'
                      ? 'bg-yellow-100 text-yellow-700'
                      : blog.status === 'Banned'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {blog.status ?? '--'}
                </span>
              </p>
            </div>
            <div>
              <label className={labelCls}>Ngày tạo</label>
              <p className="text-sm text-gray-600">{new Date(blog.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label className={labelCls}>Ngày cập nhật</label>
              <p className="text-sm text-gray-600">
                {blog.updatedAt ? new Date(blog.updatedAt).toLocaleString() : '--'}
              </p>
            </div>
          </div>
        </Section>

        <Section icon={<FileText className="w-4 h-4" />} title="Nội dung">
          <div
            className="prose max-w-none overflow-y-auto whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: blog.content || '<p class="text-sm text-gray-500">Chưa có nội dung.</p>' }}
          ></div>
        </Section>

        <Section icon={<Image className="w-4 h-4" />} title="Hình ảnh">
          {blog.imageUrl ? (
            <img src={blog.imageUrl} alt="Blog image" className="w-full max-h-96 object-cover rounded-lg" />
          ) : (
            <p className="text-sm text-gray-500">Chưa có hình ảnh.</p>
          )}
        </Section>
      </div>
    </div>
  );
};

export const BlogDetailModal: React.FC<Props & { open: boolean }> = ({ open, blogId, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            key="panel"
            initial={{ y: -8, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -8, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="relative z-[101] w-[90vw] max-w-3xl rounded-2xl bg-white shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <BlogDetail blogId={blogId} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlogDetail;