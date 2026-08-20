import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Package, LogOut, User, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Order, OrderItem } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-warning-100 text-warning-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipping: 'bg-accent-100 text-accent-700',
  delivered: 'bg-success-100 text-success-700',
  cancelled: 'bg-error-100 text-error-700',
};

export function AccountPage() {
  const { user, profile, signOut, refreshProfile, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    address: profile?.address ?? '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const orderList = (data as Order[]) ?? [];
        setOrders(orderList);
        orderList.forEach((order) => {
          supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id)
            .then(({ data: items }) => {
              setOrderItems((prev) => ({
                ...prev,
                [order.id]: (items as OrderItem[]) ?? [],
              }));
            });
        });
      });
  }, [user]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name ?? '',
        phone: profile.phone ?? '',
        address: profile.address ?? '',
      });
    }
  }, [profile]);

  if (!loading && !user) {
    return <Navigate to="/dang-nhap" replace />;
  }

  if (loading) {
    return (
      <div className="container-app py-24">
        <div className="h-8 w-48 bg-stone-200" />
      </div>
    );
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        address: formData.address,
      })
      .eq('id', user.id);
    await refreshProfile();
    setSaving(false);
    setEditing(false);
  }

  return (
    <div className="container-app py-12">
      <h1 className="font-serif text-3xl font-semibold text-wood-800">Tài khoản của tôi</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Profile */}
        <div className="lg:col-span-1">
          <div className="border border-stone-200 bg-stone-50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center bg-wood-800 text-wood-50">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-800">
                  {profile?.full_name ?? 'Người dùng'}
                </p>
                <p className="text-xs text-stone-500">{user?.email}</p>
              </div>
            </div>

            {editing ? (
              <form onSubmit={handleSaveProfile} className="mt-6 space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-stone-500">Họ và tên</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-stone-500">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-stone-500">Địa chỉ</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={saving} className="btn-primary flex-1">
                    {saving ? 'Đang lưu...' : 'Lưu'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="btn-secondary flex-1"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 space-y-2 text-sm">
                {profile?.phone && (
                  <p className="text-stone-600">Điện thoại: {profile.phone}</p>
                )}
                {profile?.address && (
                  <p className="flex items-start gap-1 text-stone-600">
                    <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" />
                    {profile.address}
                  </p>
                )}
                <button
                  onClick={() => setEditing(true)}
                  className="mt-2 text-xs font-medium text-wood-700 hover:text-wood-900"
                >
                  Chỉnh sửa thông tin
                </button>
              </div>
            )}

            <button
              onClick={signOut}
              className="mt-6 flex w-full items-center justify-center gap-2 border border-stone-300 py-2 text-xs text-stone-600 hover:bg-stone-100"
            >
              <LogOut className="h-3 w-3" />
              Đăng xuất
            </button>

            {profile?.is_admin && (
              <Link
                to="/admin"
                className="mt-3 block border border-wood-300 bg-wood-50 py-2 text-center text-xs font-medium text-wood-700 hover:bg-wood-100"
              >
                Vào trang quản trị
              </Link>
            )}
          </div>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <h2 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-stone-800">
            <Package className="h-4 w-4" />
            Lịch sử đơn hàng
          </h2>

          {orders.length === 0 ? (
            <div className="mt-4 border border-stone-200 bg-stone-50 p-12 text-center">
              <p className="text-sm text-stone-500">Bạn chưa có đơn hàng nào.</p>
              <Link to="/cua-hang" className="mt-4 inline-block btn-primary">
                Khám phá sản phẩm
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-stone-200 bg-white p-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <p className="text-xs text-stone-400">
                        Mã: {order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-stone-400">{formatDate(order.created_at)}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.status] ?? ''}`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {(orderItems[order.id] ?? []).map((item) => (
                      <li key={item.id} className="flex items-center gap-3">
                        {item.product_image && (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="h-12 w-12 flex-shrink-0 object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-xs font-medium text-stone-800">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-stone-500">
                            SL: {item.quantity} x {formatPrice(item.price)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex justify-between border-t border-stone-100 pt-3">
                    <span className="text-xs text-stone-500">Thanh toán khi nhận hàng (COD)</span>
                    <span className="text-sm font-semibold text-wood-800">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
