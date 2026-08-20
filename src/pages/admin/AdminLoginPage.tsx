import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function AdminLoginPage() {
  const { signIn, user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user && profile?.is_admin) {
    navigate('/admin');
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setSubmitting(false);
    } else {
      // AuthContext will redirect via AdminLayout if is_admin
      setTimeout(() => navigate('/admin'), 500);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-wood-900">
      <div className="w-full max-w-md p-8">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-semibold text-wood-50">Sắc Mộc</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-wood-400">
            Trang quản trị
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 bg-wood-800 p-8">
          <div>
            <label className="mb-1 block text-xs text-wood-200">Email quản trị</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-wood-600 bg-wood-900 px-4 py-2.5 text-sm text-wood-50 placeholder-wood-400 focus:border-accent-500 focus:outline-none"
              placeholder="admin@sacmoc.vn"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-wood-200">Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-wood-600 bg-wood-900 px-4 py-2.5 text-sm text-wood-50 placeholder-wood-400 focus:border-accent-500 focus:outline-none"
            />
          </div>
          {error && (
            <div className="border border-error-400 bg-error-900/30 p-3 text-sm text-error-300">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent-500 py-3 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-accent-600 disabled:opacity-50"
          >
            {submitting ? 'Đang xử lý...' : 'Đăng nhập quản trị'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-wood-400">
          Chỉ dành cho quản trị viên. Nếu bạn là khách hàng,{' '}
          <a href="/dang-nhap" className="text-accent-300 hover:text-accent-200">
            đăng nhập tại đây
          </a>
        </p>
      </div>
    </div>
  );
}
