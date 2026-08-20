import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { BlogPost } from '@/types';
import { formatDate, slugify } from '@/lib/utils';

export function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  async function fetchPosts() {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    setPosts((data as BlogPost[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    fetchPosts();
  }

  if (loading) {
    return <div className="h-64 bg-stone-200" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-wood-800">Quản lý bài viết</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          Thêm bài viết
        </button>
      </div>

      <div className="mt-6 overflow-x-auto border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">Tiêu đề</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">Ngày</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">Trạng thái</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-stone-500">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {post.image_url && (
                      <img src={post.image_url} alt="" className="h-10 w-10 flex-shrink-0 object-cover" />
                    )}
                    <span className="font-medium text-stone-800">{post.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-600">{formatDate(post.created_at)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs ${post.published ? 'bg-success-100 text-success-700' : 'bg-stone-100 text-stone-500'}`}>
                    {post.published ? 'Đã đăng' : 'Bản nháp'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditing(post);
                        setShowForm(true);
                      }}
                      className="p-1.5 text-stone-500 hover:text-wood-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 text-stone-500 hover:text-error-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <BlogForm
          post={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            fetchPosts();
          }}
        />
      )}
    </div>
  );
}

interface BlogFormProps {
  post: BlogPost | null;
  onClose: () => void;
  onSaved: () => void;
}

function BlogForm({ post, onClose, onSaved }: BlogFormProps) {
  const [form, setForm] = useState({
    title: post?.title ?? '',
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
    image_url: post?.image_url ?? '',
    published: post?.published ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const data = {
      slug: post?.slug ?? (slugify(form.title) + '-' + Date.now().toString(36)),
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      image_url: form.image_url,
      published: form.published,
    };

    if (post) {
      const { error } = await supabase.from('blog_posts').update(data).eq('id', post.id);
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.from('blog_posts').insert(data);
      if (error) setError(error.message);
    }

    setSaving(false);
    if (!error) onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-wood-800">
            {post ? 'Sửa bài viết' : 'Thêm bài viết mới'}
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs text-stone-500">Tiêu đề *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-stone-500">Tóm tắt</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-stone-500">Nội dung (hỗ trợ Markdown)</label>
            <textarea
              rows={10}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="input-field font-mono text-xs"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-stone-500">URL hình ảnh</label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="input-field"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="accent-wood-700"
            />
            Đăng bài
          </label>
          {error && (
            <div className="border border-error-300 bg-error-50 p-3 text-sm text-error-700">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
