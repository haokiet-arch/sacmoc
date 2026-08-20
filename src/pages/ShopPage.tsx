import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { PageHeader } from '@/components/PageHeader';

export function ShopPage() {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const collectionSlug = searchParams.get('collection') ?? '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<'all' | 'under10' | '10to30' | 'over30'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .order('sort_order')
      .then(({ data }) => {
        if (data) setCategories(data as Category[]);
      });
  }, []);

  useEffect(() => {
    let category: Category | null = null;
    if (categorySlug) {
      category = categories.find((c) => c.slug === categorySlug) ?? null;
      setCurrentCategory(category);
    } else {
      setCurrentCategory(null);
    }
  }, [categorySlug, categories]);

  useEffect(() => {
    setLoading(true);
    let dbQuery = supabase.from('products').select('*');

    if (currentCategory) {
      const subCatIds = categories
        .filter((c) => c.parent_id === currentCategory.id)
        .map((c) => c.id);
      const allCatIds = [currentCategory.id, ...subCatIds];
      dbQuery = dbQuery.in('category_id', allCatIds);
    }

    if (collectionSlug) {
      dbQuery = dbQuery.eq(
        'collection_id',
        (supabase.from('collections').select('id').eq('slug', collectionSlug).maybeSingle() as any)
      );
    }

    dbQuery.order('created_at', { ascending: false }).then(({ data }) => {
      let filtered = (data as Product[]) ?? [];

      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.material?.toLowerCase().includes(q)
        );
      }

      if (priceRange !== 'all') {
        filtered = filtered.filter((p) => {
          if (priceRange === 'under10') return p.price < 10000000;
          if (priceRange === '10to30') return p.price >= 10000000 && p.price < 30000000;
          if (priceRange === 'over30') return p.price >= 30000000;
          return true;
        });
      }

      setProducts(filtered);
      setLoading(false);
    });
  }, [currentCategory, categories, query, collectionSlug, priceRange]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [products, sortBy]);

  const title = currentCategory?.name ?? 'Tất cả sản phẩm';
  const subtitle = currentCategory?.description ?? 'Khám phá bộ sưu tập nội thất gỗ tự nhiên cao cấp';

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Cửa hàng', to: '/cua-hang' },
          ...(currentCategory ? [{ label: currentCategory.name }] : []),
        ]}
        image={currentCategory?.image_url ?? undefined}
      />

      <div className="container-app py-12">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="sticky top-24">
              <h3 className="text-sm font-medium uppercase tracking-wider text-stone-800">
                Danh mục
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="/cua-hang" className="text-sm text-stone-600 hover:text-wood-700">
                    Tất cả sản phẩm
                  </a>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={`/danh-muc/${cat.slug}`}
                      className={`text-sm transition-colors hover:text-wood-700 ${
                        currentCategory?.id === cat.id
                          ? 'font-medium text-wood-700'
                          : 'text-stone-600'
                      }`}
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-sm font-medium uppercase tracking-wider text-stone-800">
                Khoảng giá
              </h3>
              <ul className="mt-4 space-y-2">
                {[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'under10', label: 'Dưới 10 triệu' },
                  { value: '10to30', label: '10 - 30 triệu' },
                  { value: 'over30', label: 'Trên 30 triệu' },
                ].map((opt) => (
                  <li key={opt.value}>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-600">
                      <input
                        type="radio"
                        name="price"
                        checked={priceRange === opt.value}
                        onChange={() => setPriceRange(opt.value as typeof priceRange)}
                        className="accent-wood-700"
                      />
                      {opt.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-stone-500">
                {loading ? 'Đang tải...' : `${sortedProducts.length} sản phẩm`}
              </p>
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-1 text-sm text-stone-600 lg:hidden"
                  onClick={() => setShowFilters(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Lọc
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 focus:border-wood-500 focus:outline-none"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                  <option value="name">Tên (A-Z)</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/3] bg-stone-200" />
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-stone-500">Không tìm thấy sản phẩm phù hợp.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-stone-900/50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-stone-50 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-medium text-wood-800">Bộ lọc</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5 text-stone-600" />
              </button>
            </div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-stone-800">
              Danh mục
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="/cua-hang" className="text-sm text-stone-600">
                  Tất cả sản phẩm
                </a>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/danh-muc/${cat.slug}`}
                    className="text-sm text-stone-600"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
            <h4 className="mt-8 text-sm font-medium uppercase tracking-wider text-stone-800">
              Khoảng giá
            </h4>
            <ul className="mt-4 space-y-2">
              {[
                { value: 'all', label: 'Tất cả' },
                { value: 'under10', label: 'Dưới 10 triệu' },
                { value: '10to30', label: '10 - 30 triệu' },
                { value: 'over30', label: 'Trên 30 triệu' },
              ].map((opt) => (
                <li key={opt.value}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-600">
                    <input
                      type="radio"
                      name="price-mobile"
                      checked={priceRange === opt.value}
                      onChange={() => setPriceRange(opt.value as typeof priceRange)}
                      className="accent-wood-700"
                    />
                    {opt.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
