import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, Truck, ShieldCheck, RotateCcw, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product, Category, Collection } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { ProductCard } from '@/components/ProductCard';

export function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          setLoading(false);
          return;
        }
        const prod = data as Product;
        setProduct(prod);
        setSelectedImage(0);
        setQuantity(1);

        if (prod.category_id) {
          supabase
            .from('categories')
            .select('*')
            .eq('id', prod.category_id)
            .maybeSingle()
            .then(({ data }) => setCategory(data as Category | null));
        }
        if (prod.collection_id) {
          supabase
            .from('collections')
            .select('*')
            .eq('id', prod.collection_id)
            .maybeSingle()
            .then(({ data }) => setCollection(data as Collection | null));
        }
        if (prod.category_id) {
          supabase
            .from('products')
            .select('*')
            .eq('category_id', prod.category_id)
            .neq('id', prod.id)
            .limit(4)
            .then(({ data }) => setRelated((data as Product[]) ?? []));
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="container-app py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="aspect-square bg-stone-200" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-stone-200" />
            <div className="h-6 w-1/3 bg-stone-200" />
            <div className="h-24 w-full bg-stone-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-app py-24 text-center">
        <p className="text-stone-500">Không tìm thấy sản phẩm.</p>
        <Link to="/cua-hang" className="mt-4 inline-block btn-primary">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const discount = product.compare_price && product.compare_price > product.price;
  const discountPercent = discount
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0;

  function handleAddToCart() {
    if (product) {
      addItem(product, quantity);
    }
  }

  function handleBuyNow() {
    if (product) {
      addItem(product, quantity);
      navigate('/thanh-toan');
    }
  }

  return (
    <div>
      <div className="border-b border-stone-200 bg-stone-50">
        <div className="container-app py-4">
          <nav className="flex items-center gap-2 text-xs text-stone-500">
            <Link to="/" className="hover:text-wood-700">Trang chủ</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/cua-hang" className="hover:text-wood-700">Cửa hàng</Link>
            {category && (
              <>
                <ChevronRight className="h-3 w-3" />
                <Link to={`/danh-muc/${category.slug}`} className="hover:text-wood-700">
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-stone-700">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-app py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square overflow-hidden bg-stone-100">
              <img
                src={product.images[selectedImage] ?? ''}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-20 w-20 overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-wood-700' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {collection && (
              <Link
                to={`/cua-hang?collection=${collection.slug}`}
                className="heading-eyebrow hover:text-accent-700"
              >
                {collection.name}
              </Link>
            )}
            <h1 className="mt-2 font-serif text-3xl font-semibold text-wood-800 md:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <span className="font-serif text-3xl font-semibold text-wood-800">
                {formatPrice(product.price)}
              </span>
              {discount && (
                <>
                  <span className="text-lg text-stone-400 line-through">
                    {formatPrice(product.compare_price!)}
                  </span>
                  <span className="bg-accent-500 px-2 py-1 text-xs font-medium text-white">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-stone-600">
              {product.description}
            </p>

            {/* Specs */}
            <div className="mt-8 space-y-3 border-y border-stone-200 py-6">
              {product.material && (
                <div className="flex gap-4">
                  <span className="w-24 flex-shrink-0 text-xs font-medium uppercase tracking-wider text-stone-400">
                    Chất liệu
                  </span>
                  <span className="text-sm text-stone-700">{product.material}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex gap-4">
                  <span className="w-24 flex-shrink-0 text-xs font-medium uppercase tracking-wider text-stone-400">
                    Kích thước
                  </span>
                  <span className="text-sm text-stone-700">{product.dimensions}</span>
                </div>
              )}
              {product.color && (
                <div className="flex gap-4">
                  <span className="w-24 flex-shrink-0 text-xs font-medium uppercase tracking-wider text-stone-400">
                    Màu sắc
                  </span>
                  <span className="text-sm text-stone-700">{product.color}</span>
                </div>
              )}
              <div className="flex gap-4">
                <span className="w-24 flex-shrink-0 text-xs font-medium uppercase tracking-wider text-stone-400">
                  Tình trạng
                </span>
                <span className={`text-sm ${product.in_stock ? 'text-success-600' : 'text-error-500'}`}>
                  {product.in_stock ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-stone-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100"
                  aria-label="Giảm số lượng"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100"
                  aria-label="Tăng số lượng"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-stone-500">
                Tổng: <span className="font-medium text-wood-800">{formatPrice(product.price * quantity)}</span>
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="btn-secondary flex-1"
              >
                <ShoppingBag className="h-4 w-4" />
                Thêm vào giỏ
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.in_stock}
                className="btn-primary flex-1"
              >
                Mua ngay
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center">
                <Truck className="h-6 w-6 text-wood-600" />
                <span className="mt-1 text-xs text-stone-500">Giao hàng toàn quốc</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="h-6 w-6 text-wood-600" />
                <span className="mt-1 text-xs text-stone-500">Bảo hành 5 năm</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="h-6 w-6 text-wood-600" />
                <span className="mt-1 text-xs text-stone-500">Đổi trả 7 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="border-t border-stone-200 bg-stone-50 py-16">
          <div className="container-app">
            <h2 className="mb-8 font-serif text-3xl font-semibold text-wood-800">
              Sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
