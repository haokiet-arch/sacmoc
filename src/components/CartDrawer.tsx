import { Link } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, totalAmount, totalItems } =
    useCart();

  return (
    <>
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-stone-900/50"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-stone-50 shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
              <h2 className="font-serif text-xl font-semibold text-wood-800">
                Giỏ hàng ({totalItems})
              </h2>
              <button onClick={() => setIsCartOpen(false)} aria-label="Đóng giỏ hàng">
                <X className="h-5 w-5 text-stone-600" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
                <ShoppingBag className="h-16 w-16 text-stone-300" />
                <p className="text-sm text-stone-500">Giỏ hàng của bạn đang trống</p>
                <Link
                  to="/cua-hang"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-primary"
                >
                  Khám phá sản phẩm
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <ul className="space-y-4">
                    {items.map((item) => (
                      <li key={item.product.id} className="flex gap-4">
                        <Link
                          to={`/san-pham/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="h-24 w-24 flex-shrink-0 overflow-hidden bg-stone-100"
                        >
                          <img
                            src={item.product.images[0] ?? ''}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <Link
                            to={`/san-pham/${item.product.slug}`}
                            onClick={() => setIsCartOpen(false)}
                            className="text-sm font-medium text-stone-800 hover:text-wood-700"
                          >
                            {item.product.name}
                          </Link>
                          <p className="mt-1 text-sm text-wood-700">
                            {formatPrice(item.product.price)}
                          </p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center border border-stone-300">
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity - 1)
                                }
                                className="px-2 py-1 text-stone-600 hover:bg-stone-100"
                                aria-label="Giảm số lượng"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-3 text-sm">{item.quantity}</span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity + 1)
                                }
                                className="px-2 py-1 text-stone-600 hover:bg-stone-100"
                                aria-label="Tăng số lượng"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-xs text-stone-400 hover:text-error-500"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-stone-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-600">Tổng cộng</span>
                    <span className="font-serif text-xl font-semibold text-wood-800">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      to="/thanh-toan"
                      onClick={() => setIsCartOpen(false)}
                      className="btn-primary w-full"
                    >
                      Thanh toán
                    </Link>
                    <Link
                      to="/cua-hang"
                      onClick={() => setIsCartOpen(false)}
                      className="btn-secondary w-full"
                    >
                      Ti tục mua sắm
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
