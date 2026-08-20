import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag, User, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Category } from '@/types';
import { supabase } from '@/lib/supabase';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const { totalItems, setIsCartOpen } = useCart();
  const { user, profile } = useAuth();

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .order('sort_order')
      .then(({ data }) => {
        if (data) setCategories(data as Category[]);
      });
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cua-hang?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileOpen(false);
      setSearchQuery('');
    }
  }

  return (
    <>
      <div className="bg-wood-900 text-wood-100">
        <div className="container-app flex items-center justify-center py-2 text-center text-xs tracking-wide">
          <span className="hidden sm:inline">Miễn phí giao hàng nội thành cho đơn hàng từ 5.000.000đ</span>
          <span className="sm:hidden">Miễn phí giao hàng cho đơn từ 5.000.000đ</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/95 backdrop-blur-md">
        <div className="container-app">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Mở menu"
              >
                <Menu className="h-6 w-6 text-stone-700" />
              </button>
              <Link to="/" className="flex flex-col">
                <span className="font-serif text-2xl font-semibold tracking-wide text-wood-800">
                  Sắc Mộc
                </span>
                <span className="hidden text-[10px] uppercase tracking-[0.2em] text-stone-500 sm:block">
                  Mộc mạc bản thể
                </span>
              </Link>
            </div>

            <nav className="hidden items-center gap-8 lg:flex">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/danh-muc/${cat.slug}`}
                  className="text-sm font-medium text-stone-700 transition-colors hover:text-wood-700"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                to="/cua-hang"
                className="text-sm font-medium text-stone-700 transition-colors hover:text-wood-700"
              >
                Cửa hàng
              </Link>
              <Link
                to="/khuyen-mai"
                className="text-sm font-medium text-accent-600 transition-colors hover:text-accent-700"
              >
                Khuyến mãi
              </Link>
            </nav>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Tìm kiếm"
                className="text-stone-700 transition-colors hover:text-wood-700"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                to={user ? '/tai-khoan' : '/dang-nhap'}
                aria-label="Tài khoản"
                className="text-stone-700 transition-colors hover:text-wood-700"
              >
                <User className="h-5 w-5" />
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Giỏ hàng"
                className="relative text-stone-700 transition-colors hover:text-wood-700"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-accent-500 text-[10px] font-medium text-white">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-stone-200 bg-stone-50">
            <div className="container-app py-4">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <Search className="h-5 w-5 text-stone-400" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="flex-1 border-none bg-transparent text-sm text-stone-800 placeholder-stone-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-stone-900/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-stone-50 shadow-xl animate-slide-in-right">
            <div className="flex items-center justify-between border-b border-stone-200 p-4">
              <span className="font-serif text-xl font-semibold text-wood-800">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Đóng menu">
                <X className="h-6 w-6 text-stone-700" />
              </button>
            </div>
            <nav className="flex flex-col p-4">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="border-b border-stone-100 py-3 text-sm font-medium text-stone-700"
              >
                Trang chủ
              </Link>
              <Link
                to="/cua-hang"
                onClick={() => setMobileOpen(false)}
                className="border-b border-stone-100 py-3 text-sm font-medium text-stone-700"
              >
                Cửa hàng
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/danh-muc/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-stone-100 py-3 text-sm font-medium text-stone-700"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                to="/khuyen-mai"
                onClick={() => setMobileOpen(false)}
                className="border-b border-stone-100 py-3 text-sm font-medium text-accent-600"
              >
                Khuyến mãi
              </Link>
              <Link
                to="/tin-tuc"
                onClick={() => setMobileOpen(false)}
                className="border-b border-stone-100 py-3 text-sm font-medium text-stone-700"
              >
                Tin tức
              </Link>
              <Link
                to="/gioi-thieu"
                onClick={() => setMobileOpen(false)}
                className="border-b border-stone-100 py-3 text-sm font-medium text-stone-700"
              >
                Giới thiệu
              </Link>
              <Link
                to="/lien-he"
                onClick={() => setMobileOpen(false)}
                className="border-b border-stone-100 py-3 text-sm font-medium text-stone-700"
              >
                Liên hệ
              </Link>
              {profile?.is_admin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-stone-100 py-3 text-sm font-medium text-wood-700"
                >
                  Quản trị
                </Link>
              )}
              <Link
                to={user ? '/tai-khoan' : '/dang-nhap'}
                onClick={() => setMobileOpen(false)}
                className="mt-4 btn-primary"
              >
                {user ? 'Tài khoản của tôi' : 'Đăng nhập'}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
