import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.compare_price && product.compare_price > product.price;
  const discountPercent = discount
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0;

  return (
    <Link to={`/san-pham/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-stone-100">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={product.images[0] ?? ''}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.is_new && (
            <span className="bg-wood-800 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-wood-50">
              Mới
            </span>
          )}
          {discount && (
            <span className="bg-accent-500 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
              -{discountPercent}%
            </span>
          )}
          {product.bestseller && !product.is_new && !discount && (
            <span className="bg-success-600 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
              Bán chạy
            </span>
          )}
        </div>
        {!product.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/40">
            <span className="text-sm font-medium uppercase tracking-wider text-white">
              Hết hàng
            </span>
          </div>
        )}
      </div>
      <div className="pt-4">
        <h3 className="text-base font-medium text-stone-800 transition-colors group-hover:text-wood-700">
          {product.name}
        </h3>
        {product.material && (
          <p className="mt-1 text-xs text-stone-500">{product.material}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-semibold text-wood-800">
            {formatPrice(product.price)}
          </span>
          {discount && (
            <span className="text-sm text-stone-400 line-through">
              {formatPrice(product.compare_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="block">
      <div className="aspect-[4/3] bg-stone-200" />
      <div className="pt-4">
        <div className="h-4 w-3/4 bg-stone-200" />
        <div className="mt-2 h-3 w-1/2 bg-stone-200" />
        <div className="mt-2 h-5 w-1/3 bg-stone-200" />
      </div>
    </div>
  );
}

export function ProductCardWithAdd({ product }: ProductCardProps) {
  return (
    <div className="relative">
      <ProductCard product={product} />
      <button
        type="button"
        disabled={!product.in_stock}
        className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center bg-wood-800 text-wood-50 transition-colors hover:bg-wood-900 disabled:cursor-not-allowed disabled:bg-stone-300"
        title="Thêm vào giỏ"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <ShoppingBag className="h-4 w-4" />
      </button>
    </div>
  );
}
