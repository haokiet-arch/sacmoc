import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      navigate('/tai-khoan');
    }
  }

  return (
    <div className="container-app py-16">
      <div className="mx-auto max-w-md">
        <h1 className="font-serif text-3xl font-semibold text-wood-800">Đăng nhập</h1>
        <p className="mt-2 text-sm text-stone-500">
          Đăng nhập để theo dõi đơn hàng và quản lý tài khoản.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-xs text-stone-500">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-stone-500">Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>
          {error && (
            <div className="border border-error-300 bg-error-50 p-3 text-sm text-error-700">
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          Chưa có tài khoản?{' '}
          <Link to="/dang-ky" className="font-medium text-wood-700 hover:text-wood-900">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
