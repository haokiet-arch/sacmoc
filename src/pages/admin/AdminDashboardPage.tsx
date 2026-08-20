import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Order, Product } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('orders').select('*'),
      supabase.from('products').select('*').limit(5),
    ]).then(([ordersRes, productsRes]) => {
      const orders = (ordersRes.data as Order[]) ?? [];
      const products = (productsRes.data as Product[]) ?? [];
      const revenue = orders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total_amount, 0);
      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === 'pending').length,
        totalRevenue: revenue,
        totalProducts: products.length,
      });
      setRecentOrders(orders.slice(0, 5));
      setTopProducts(products);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="h-64 bg-stone-200" />;
  }

  const statCards = [
    { label: 'Tổng đơn hàng', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-600' },
    { label: 'Đơn chờ xử lý', value: stats.pendingOrders, icon: Package, color: 'text-warning-600' },
    { label: 'Tổng doanh thu', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'text-success-600' },
    { label: 'Số sản phẩm', value: stats.totalProducts, icon: TrendingUp, color: 'text-accent-600' },
  ];

  const STATUS_LABELS: Record<string, string> = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-wood-800">Tổng quan</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold text-stone-800">{card.value}</p>
              </div>
              <card.icon className={`h-8 w-8 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-stone-800">
              Đơn hàng gần đây
            </h2>
            <Link to="/admin/don-hang" className="text-xs text-wood-700 hover:text-wood-900">
              Xem tất cả
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="mt-4 text-sm text-stone-400">Chưa có đơn hàng nào.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between border-b border-stone-100 pb-3 last:border-0">
                  <div>
                    <p className="text-xs font-medium text-stone-800">
                      {order.full_name}
                    </p>
                    <p className="text-xs text-stone-400">
                      {formatDate(order.created_at)} - {STATUS_LABELS[order.status] ?? order.status}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-wood-800">
                    {formatPrice(order.total_amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick Links */}
        <div className="border border-stone-200 bg-white p-5">
          <h2 className="text-sm font-medium uppercase tracking-wider text-stone-800">
            Truy cập nhanh
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              to="/admin/san-pham"
              className="border border-stone-200 p-4 text-center transition-colors hover:bg-stone-50"
            >
              <Package className="mx-auto h-6 w-6 text-wood-600" />
              <p className="mt-2 text-xs text-stone-600">Quản lý sản phẩm</p>
            </Link>
            <Link
              to="/admin/don-hang"
              className="border border-stone-200 p-4 text-center transition-colors hover:bg-stone-50"
            >
              <ShoppingCart className="mx-auto h-6 w-6 text-wood-600" />
              <p className="mt-2 text-xs text-stone-600">Quản lý đơn hàng</p>
            </Link>
            <Link
              to="/admin/bai-viet"
              className="border border-stone-200 p-4 text-center transition-colors hover:bg-stone-50"
            >
              <Package className="mx-auto h-6 w-6 text-wood-600" />
              <p className="mt-2 text-xs text-stone-600">Quản lý bài viết</p>
            </Link>
            <Link
              to="/admin/khuyen-mai"
              className="border border-stone-200 p-4 text-center transition-colors hover:bg-stone-50"
            >
              <Package className="mx-auto h-6 w-6 text-wood-600" />
              <p className="mt-2 text-xs text-stone-600">Quản lý khuyến mãi</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
