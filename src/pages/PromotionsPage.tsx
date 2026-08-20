import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Promotion, Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { PageHeader } from '@/components/PageHeader';

export function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('promotions').select('*').eq('active', true),
      supabase
        .from('products')
        .select('*')
        .not('compare_price', 'is', null)
        .order('created_at', { ascending: false }),
    ]).then(([promoRes, prodRes]) => {
      setPromotions((promoRes.data as Promotion[]) ?? []);
      setDiscountedProducts((prodRes.data as Product[]) ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHeader
        title="Khuyến mãi"
        subtitle="Những ưu đãi đặc biệt dành cho bạn từ Sắc Mộc"
        breadcrumbs={[{ label: 'Trang chủ', to: '/' }, { label: 'Khuyến mãi' }]}
      />

      {promotions.length > 0 && (
        <section className="section-padding bg-stone-50">
          <div className="container-app">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {promotions.map((promo) => (
                <div key={promo.id} className="relative overflow-hidden bg-wood-800 p-8">
                  {promo.image_url && (
                    <div className="absolute inset-0 opacity-30">
                      <img
                        src={promo.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <span className="bg-accent-500 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white">
                      {promo.discount_text}
                    </span>
                    <h3 className="mt-4 font-serif text-2xl font-semibold text-wood-50">
                      {promo.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-wood-200">
                      {promo.description}
                    </p>
                    <Link to="/cua-hang" className="mt-6 inline-block btn-accent">
                      Mua ngay
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-white">
        <div className="container-app">
          <h2 className="font-serif text-3xl font-semibold text-wood-800">
            Sản phẩm đang giảm giá
          </h2>
          {loading ? (
            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-stone-200" />
              ))}
            </div>
          ) : discountedProducts.length === 0 ? (
            <p className="mt-8 text-sm text-stone-500">
              Hiện không có sản phẩm nào đang giảm giá.
            </p>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
              {discountedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
