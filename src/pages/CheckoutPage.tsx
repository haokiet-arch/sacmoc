import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';

export function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    email: user?.email ?? '',
    phone: profile?.phone ?? '',
    address: profile?.address ?? '',
    city: '',
    district: '',
    note: '',
  });

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError('Giỏ hàng của bạn đang trống.');
      return;
    }

    if (!form.full_name || !form.email || !form.phone || !form.address) {
      setError('Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }

    setLoading(true);
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id ?? null,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        district: form.district,
        note: form.note,
        total_amount: totalAmount,
        status: 'pending',
        payment_method: 'cod',
      })
      .select()
      .single();

    if (orderError) {
      setError('Không thể tạo đơn hàng. Vui lòng thử lại.');
      setLoading(false);
      return;
    }

    const orderItems = items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.images[0] ?? null,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      setError('Không thể tạo chi tiết đơn hàng. Vui lòng thử lại.');
      setLoading(false);
      return;
    }

    setOrderId(orderData.id);
    setSuccess(true);
    clearCart();
    setLoading(false);
  }

  if (success) {
    return (
      <div className="container-app py-24">
        <div className="mx-auto max-w-lg text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-success-500" />
          <h1 className="mt-6 font-serif text-3xl font-semibold text-wood-800">
            Đặt hàng thành công!
          </h1>
          <p className="mt-3 text-sm text-stone-600">
            Cảm ơn bạn đã đặt hàng tại Sắc Mộc. Chúng tôi sẽ liên hệ với bạn trong thời gian
            sớm nhất để xác nhận đơn hàng.
          </p>
          {orderId && (
            <p className="mt-2 text-xs text-stone-400">
              Mã đơn hàng: {orderId.slice(0, 8).toUpperCase()}
            </p>
          )}
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/cua-hang" className="btn-primary">
              Ti tục mua sắm
            </Link>
            {user && (
              <Link to="/tai-khoan" className="btn-secondary">
                Xem đơn hàng
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold text-wood-800">Giỏ hàng trống</h1>
        <p className="mt-3 text-sm text-stone-500">
          Bạn chưa có sản phẩm nào trong giỏ hàng.
        </p>
        <Link to="/cua-hang" className="mt-6 inline-block btn-primary">
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-12">
      <Link
        to="/cua-hang"
        className="mb-6 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-wood-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Ti tục mua sắm
      </Link>

      <h1 className="font-serif text-3xl font-semibold text-wood-800">Thanh toán</h1>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-800">
                Thông tin giao hàng
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-stone-500">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={(e) => update('full_name', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-stone-500">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-stone-500">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-stone-500">Địa chỉ giao hàng *</label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-stone-500">Thành phố</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-stone-500">Quận / Huyện</label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={(e) => update('district', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-stone-500">Ghi chú</label>
                  <textarea
                    rows={3}
                    value={form.note}
                    onChange={(e) => update('note', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-800">
                Phương thức thanh toán
              </h2>
              <div className="border border-wood-700 bg-wood-50 p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="accent-wood-700"
                  />
                  <span className="text-sm font-medium text-stone-800">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                </div>
                <p className="mt-2 text-xs text-stone-500">
                  Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng tại nhà.
                </p>
              </div>
            </div>

            {error && (
              <div className="border border-error-300 bg-error-50 p-3 text-sm text-error-700">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="sticky top-24 border border-stone-200 bg-stone-50 p-6">
            <h2 className="text-sm font-medium uppercase tracking-wider text-stone-800">
              Đơn hàng của bạn
            </h2>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-3">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden bg-stone-100">
                    <img
                      src={item.product.images[0] ?? ''}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-stone-800">{item.product.name}</p>
                    <p className="mt-1 text-xs text-stone-500">
                      {item.quantity} x {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-wood-800">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 border-t border-stone-200 pt-4">
              <div className="flex justify-between text-sm text-stone-600">
                <span>Tạm tính</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-600">
                <span>Phí giao hàng</span>
                <span>Miễn phí</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-semibold text-wood-800">
                <span>Tổng cộng</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
