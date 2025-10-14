import React, { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Blog } from '@redux/api/blog/type';

type BlogFormProps = {
  blog?: Blog | null;
  onSave: (data: Partial<Blog> & { Image?: File | undefined }) => void;
  loading: boolean;
};

type BlogFormModalProps = {
  open: boolean;
  blog?: Blog | null;
  onSave: (data: Partial<Blog> & { Image?: File | undefined }) => void;
  onClose: () => void;
  loading: boolean;
};

const BlogForm: React.FC<BlogFormProps> = ({ blog, onSave, loading }) => {
  const [formData, setFormData] = useState({
    title: blog?.title ?? '',
    shortdesc: blog?.shortdesc ?? '',
    content: blog?.content ?? '',
    status: blog?.status ?? 'Draft',
    Image: undefined as File | undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: blog?.id,
      title: formData.title,
      shortdesc: formData.shortdesc,
      content: formData.content,
      status: formData.status,
      Image: formData.Image,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, Image: e.target.files[0] });
    } else {
      setFormData({ ...formData, Image: undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Tiêu đề</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Nhập tiêu đề..."
          className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
          required
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Mô tả ngắn</label>
        <textarea
          value={formData.shortdesc}
          onChange={(e) => setFormData({ ...formData, shortdesc: e.target.value })}
          placeholder="Nhập mô tả ngắn..."
          className="h-20 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
          required
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Nội dung</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Nhập nội dung bài viết..."
          className="h-48 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
          required
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Hình ảnh</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-50 file:text-teal-700 file:hover:bg-teal-100"
        />
        {formData.Image && <p className="mt-1 text-sm text-gray-600">{formData.Image.name}</p>}
        {blog?.imageUrl && !formData.Image && (
          <img src={blog.imageUrl} alt="Current blog" className="mt-2 h-32 w-auto rounded-lg" />
        )}
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Trạng thái</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Banned">Banned</option>
          <option value="Deleted">Deleted</option>
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setFormData({ title: '', shortdesc: '', content: '', status: 'Draft', Image: undefined })}
          className="h-10 px-4 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
          disabled={loading}
        >
          Reset
        </button>
        <button
          type="submit"
          className="h-10 px-4 rounded-lg bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 flex items-center gap-2"
          disabled={loading}
        >
          <Save className="w-4 h-4" />
          Lưu
        </button>
      </div>
    </form>
  );
};

export const BlogFormModal: React.FC<BlogFormModalProps> = ({ open, blog, onSave, onClose, loading }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

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
            <div className="sticky top-0 z-10 flex items-center justify-between bg-white/90 backdrop-blur border-b px-4 py-2">
              <h2 className="text-xl font-semibold">{blog ? 'Sửa Blog' : 'Tạo Blog'}</h2>
              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0 max-h-[80vh] overflow-y-auto p-4">
              <BlogForm blog={blog} onSave={onSave} loading={loading} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlogForm;