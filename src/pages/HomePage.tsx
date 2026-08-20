import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TreePine, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product, Collection, Promotion } from '@/types';
import { ProductCard } from '@/components/ProductCard';

export function HomePage() {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase
        .from('products')
        .select('*')
        .eq('is_new', true)
        .order('created_at', { ascending: false })
        .limit(4),
      supabase
        .from('products')
        .select('*')
        .eq('bestseller', true)
        .limit(4),
      supabase.from('collections').select('*').order('created_at'),
      supabase.from('promotions').select('*').eq('active', true),
    ]).then(([newRes, bestRes, collRes, promoRes]) => {
      setNewProducts((newRes.data as Product[]) ?? []);
      setBestsellers((bestRes.data as Product[]) ?? []);
      setCollections((collRes.data as Collection[]) ?? []);
      setPromotions((promoRes.data as Promotion[]) ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/6580396/pexels-photo-6580396.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Nội thất Sắc Mộc"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-wood-900/80 via-wood-900/50 to-transparent" />
        </div>
        <div className="container-app relative flex h-full items-center">
          <div className="max-w-xl animate-slide-up">
            <p className="heading-eyebrow text-accent-300">Bộ sưu tập mới</p>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight text-wood-50 md:text-6xl">
              Mộc mạc bản thể
            </h1>
            <p className="mt-2 font-serif text-2xl text-wood-200 italic">
              Sắc sảo đường nét
            </p>
            <p className="mt-6 text-base leading-relaxed text-wood-100">
              Khám phá bộ sưu tập nội thất gỗ tự nhiên cao cấp, mang vẻ đẹp nguyên bản
              của thiên nhiên vào không gian sống của bạn.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/cua-hang" className="btn-accent">
                Khám phá ngay
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/gioi-thieu"
                className="inline-flex items-center justify-center gap-2 border border-wood-300 px-8 py-3 text-sm font-medium uppercase tracking-wider text-wood-50 transition-all hover:bg-wood-800"
              >
                Về Sắc Mộc
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions */}
      {promotions.length > 0 && (
        <section className="border-b border-stone-200 bg-stone-100">
          <div className="container-app py-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className="flex items-center gap-4 bg-stone-50 p-4"
                >
                  {promo.image_url && (
                    <img
                      src={promo.image_url}
                      alt={promo.title}
                      className="h-16 w-16 flex-shrink-0 object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-accent-500 px-2 py-0.5 text-xs font-medium text-white">
                        {promo.discount_text}
                      </span>
                      <h3 className="text-sm font-medium text-stone-800">{promo.title}</h3>
                    </div>
                    <p className="mt-1 text-xs text-stone-500 line-clamp-2">
                      {promo.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="border-b border-stone-200 bg-stone-50">
        <div className="container-app py-12">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <TreePine className="h-10 w-10 text-wood-600" />
              <h3 className="mt-3 text-sm font-medium text-stone-800">Gỗ tự nhiên 100%</h3>
              <p className="mt-1 text-xs text-stone-500">Nguyên liệu tuyển chọn</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="h-10 w-10 text-wood-600" />
              <h3 className="mt-3 text-sm font-medium text-stone-800">Bảo hành 5 năm</h3>
              <p className="mt-1 text-xs text-stone-500">Cam kết chất lượng</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Truck className="h-10 w-10 text-wood-600" />
              <h3 className="mt-3 text-sm font-medium text-stone-800">Giao hàng toàn quốc</h3>
              <p className="mt-1 text-xs text-stone-500">Miễn phí nội thành</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Sparkles className="h-10 w-10 text-wood-600" />
              <h3 className="mt-3 text-sm font-medium text-stone-800">Thủ công tinh xảo</h3>
              <p className="mt-1 text-xs text-stone-500">Nghệ nhân lành nghề</p>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      {collections.length > 0 && (
        <section className="section-padding bg-stone-50">
          <div className="container-app">
            <div className="mb-12 text-center">
              <p className="heading-eyebrow">Bộ sưu tập</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-wood-800">
                Những bộ sưu tập nổi bật
              </h2>
              <p className="mt-3 text-sm text-stone-500">
                Mỗi bộ sưu tập mang một câu chuyện riêng, một cảm hứng riêng
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {collections.map((coll) => (
                <Link
                  key={coll.id}
                  to={`/cua-hang?collection=${coll.slug}`}
                  className="group relative overflow-hidden"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={coll.image_url ?? ''}
                      alt={coll.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-wood-900/80 via-wood-900/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-2xl font-semibold text-wood-50">
                      {coll.name}
                    </h3>
                    <p className="mt-2 text-xs text-wood-200 line-clamp-2">
                      {coll.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-accent-300">
                      Khám phá <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="section-padding bg-white">
        <div className="container-app">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="heading-eyebrow">Hàng mới về</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-wood-800">
                Sản phẩm mới
              </h2>
            </div>
            <Link
              to="/cua-hang"
              className="hidden items-center gap-1 text-sm font-medium text-wood-700 hover:text-wood-900 sm:flex"
            >
              Xem tất cả <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-stone-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Story */}
      <section className="relative overflow-hidden bg-wood-800">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[400px]">
            <img
              src="https://images.pexels.com/photos/7539830/pexels-photo-7539830.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Xưởng Sắc Mộc"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-12 lg:p-16">
            <p className="heading-eyebrow text-accent-300">Về Sắc Mộc</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-wood-50">
              Câu chuyện của chúng tôi
            </h2>
            <p className="mt-6 text-base leading-relaxed text-wood-100">
              Sắc Mộc ra đời từ tình yêu dành cho vẻ đẹp nguyên bản của gỗ tự nhiên.
              Chúng tôi tin rằng mỗi thớ gỗ, mỗi đường vân đều mang trong mình một
              câu chuyện của thiên nhiên.
            </p>
            <p className="mt-4 text-base leading-relaxed text-wood-100">
              Từ xưởng mộc truyền thống đến không gian sống hiện đại, Sắc Mộc mang
              đến những món đồ nội thất vừa mộc mạc, vừa sắc sảo - giữ trọn tinh hoa
              của nghề mộc Việt.
            </p>
            <Link
              to="/gioi-thieu"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-accent-300 hover:text-accent-200"
            >
              Đọc thêm <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="section-padding bg-stone-50">
        <div className="container-app">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="heading-eyebrow">Bán chạy nhất</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-wood-800">
                Sản phẩm được yêu thích
              </h2>
            </div>
            <Link
              to="/cua-hang"
              className="hidden items-center gap-1 text-sm font-medium text-wood-700 hover:text-wood-900 sm:flex"
            >
              Xem tất cả <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-stone-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {bestsellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
