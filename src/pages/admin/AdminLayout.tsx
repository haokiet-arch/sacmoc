import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, FileText, Tag, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function AdminLayout() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !profile?.is_admin)) {
      navigate('/admin/dang-nhap');
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <p className="text-sm text-stone-500">Đang tải...</p>
      </div>
    );
  }

  if (!user || !profile?.is_admin) {
    return null;
  }

  const navItems = [
    { to: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
    { to: '/admin/san-pham', label: 'Sản phẩm', icon: Package },
    { to: '/admin/don-hang', label: 'Đơn hàng', icon: ShoppingCart },
    { to: '/admin/bai-viet', label: 'Bài viết', icon: FileText },
    { to: '/admin/khuyen-mai', label: 'Khuyến mãi', icon: Tag },
  ];

  function handleSignOut() {
    signOut();
    navigate('/');
  }

  return (
    <div className="flex min-h-screen bg-stone-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-wood-900 text-wood-100 transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6">
          <Link to="/admin" className="font-serif text-2xl font-semibold text-wood-50">
            Sắc Mộc
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="px-6 pb-4 text-xs uppercase tracking-wider text-wood-400">Quản trị</p>
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-wood-800 text-wood-50'
                    : 'text-wood-300 hover:bg-wood-800 hover:text-wood-100'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-3">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-wood-300 hover:bg-wood-800 hover:text-wood-100"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
          <Link
            to="/"
            className="mt-1 block px-3 py-2.5 text-sm text-wood-300 hover:bg-wood-800 hover:text-wood-100"
          >
            Về trang chủ
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-stone-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-0">
        <header className="flex items-center justify-between border-b border-stone-200 bg-white px-6 py-4">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Mở menu"
          >
            <Menu className="h-5 w-5 text-stone-700" />
          </button>
          <p className="text-sm text-stone-500">
            Xin chào, <span className="font-medium text-stone-800">{profile.full_name ?? 'Admin'}</span>
          </p>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
