import { useEffect, useState } from 'react';
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

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    const orderList = (data as Order[]) ?? [];
    setOrders(orderList);
    setLoading(false);

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
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateStatus(orderId: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    fetchOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: status as Order['status'] });
    }
  }

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  if (loading) {
    return <div className="h-64 bg-stone-200" />;
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-wood-800">Quản lý đơn hàng</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-1.5 text-xs font-medium ${
            filterStatus === 'all' ? 'bg-wood-800 text-wood-50' : 'border border-stone-300 text-stone-600'
          }`}
        >
          Tất cả ({orders.length})
        </button>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilterStatus(value)}
            className={`px-4 py-1.5 text-xs font-medium ${
              filterStatus === value ? 'bg-wood-800 text-wood-50' : 'border border-stone-300 text-stone-600'
            }`}
          >
            {label} ({orders.filter((o) => o.status === value).length})
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">Mã</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">Khách hàng</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">Ngày</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">Tổng</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">Trạng thái</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-stone-500">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-mono text-xs text-stone-600">
                  {order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-800">{order.full_name}</p>
                  <p className="text-xs text-stone-400">{order.phone}</p>
                </td>
                <td className="px-4 py-3 text-stone-600">{formatDate(order.created_at)}</td>
                <td className="px-4 py-3 font-medium text-wood-800">{formatPrice(order.total_amount)}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`border-0 px-2 py-1 text-xs font-medium ${STATUS_COLORS[order.status] ?? ''}`}
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-xs font-medium text-wood-700 hover:text-wood-900"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-wood-800">
                Đơn hàng {selectedOrder.id.slice(0, 8).toUpperCase()}
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-500">
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-stone-400">Thông tin khách hàng</h3>
                <div className="mt-2 space-y-1 text-sm text-stone-700">
                  <p><span className="text-stone-400">Tên:</span> {selectedOrder.full_name}</p>
                  <p><span className="text-stone-400">Email:</span> {selectedOrder.email}</p>
                  <p><span className="text-stone-400">Điện thoại:</span> {selectedOrder.phone}</p>
                  <p><span className="text-stone-400">Địa chỉ:</span> {selectedOrder.address}</p>
                  {selectedOrder.city && <p><span className="text-stone-400">Thành phố:</span> {selectedOrder.city}</p>}
                  {selectedOrder.note && <p><span className="text-stone-400">Ghi chú:</span> {selectedOrder.note}</p>}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-stone-400">Sản phẩm</h3>
                <ul className="mt-2 space-y-2">
                  {(orderItems[selectedOrder.id] ?? []).map((item) => (
                    <li key={item.id} className="flex items-center gap-3 text-sm">
                      {item.product_image && (
                        <img src={item.product_image} alt="" className="h-12 w-12 object-cover" />
                      )}
                      <div className="flex-1">
                        <p className="text-stone-800">{item.product_name}</p>
                        <p className="text-xs text-stone-400">
                          {item.quantity} x {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="font-medium text-wood-800">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between border-t border-stone-200 pt-4">
                <span className="text-sm font-medium text-stone-600">Tổng cộng</span>
                <span className="font-serif text-lg font-semibold text-wood-800">
                  {formatPrice(selectedOrder.total_amount)}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-stone-400">Cập nhật trạng thái</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => updateStatus(selectedOrder.id, value)}
                      className={`px-3 py-1.5 text-xs font-medium ${
                        selectedOrder.status === value
                          ? STATUS_COLORS[value] + ' ring-2 ring-wood-500'
                          : 'border border-stone-300 text-stone-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
