import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product, Category, Collection } from '@/types';
import { formatPrice, slugify } from '@/lib/utils';

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function fetchData() {
    const [prodRes, catRes, collRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('collections').select('*'),
    ]);
    setProducts((prodRes.data as Product[]) ?? []);
    setCategories((catRes.data as Category[]) ?? []);
    setCollections((collRes.data as Collection[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchData();
  }

  function handleEdit(product: Product) {
    setEditing(product);
    setShowForm(true);
  }

  function handleAdd() {
    setEditing(null);
    setShowForm(true);
  }

  if (loading) {
    return <div className="h-64 bg-stone-200" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-wood-800">Quản lý sản phẩm</h1>
        <button onClick={handleAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </button>
      </div>

      <div className="mt-6 overflow-x-auto border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">Sản phẩm</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">Danh mục</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">Giá</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">Tình trạng</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-stone-500">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map((product) => {
              const cat = categories.find((c) => c.id === product.category_id);
              return (
                <tr key={product.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0] ?? ''}
                        alt={product.name}
                        className="h-12 w-12 flex-shrink-0 object-cover"
                      />
                      <span className="font-medium text-stone-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{cat?.name ?? '-'}</td>
                  <td className="px-4 py-3 text-stone-600">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs ${product.in_stock ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'}`}>
                      {product.in_stock ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1.5 text-stone-500 hover:text-wood-700"
                        aria-label="Sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-stone-500 hover:text-error-600"
                        aria-label="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          product={editing}
          categories={categories}
          collections={collections}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  collections: Collection[];
  onClose: () => void;
  onSaved: () => void;
}

function ProductForm({ product, categories, collections, onClose, onSaved }: ProductFormProps) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    compare_price: product?.compare_price?.toString() ?? '',
    category_id: product?.category_id ?? '',
    collection_id: product?.collection_id ?? '',
    material: product?.material ?? '',
    dimensions: product?.dimensions ?? '',
    color: product?.color ?? '',
    in_stock: product?.in_stock ?? true,
    is_featured: product?.is_featured ?? false,
    is_new: product?.is_new ?? false,
    bestseller: product?.bestseller ?? false,
    images: product?.images.join('\n') ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const images = form.images
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean);

    if (images.length === 0) {
      setError('Vui lòng thêm ít nhất một hình ảnh.');
      setSaving(false);
      return;
    }

    const data = {
      slug: slugify(form.name) + '-' + Date.now().toString(36),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      category_id: form.category_id || null,
      collection_id: form.collection_id || null,
      material: form.material,
      dimensions: form.dimensions,
      color: form.color,
      in_stock: form.in_stock,
      is_featured: form.is_featured,
      is_new: form.is_new,
      bestseller: form.bestseller,
      images,
    };

    if (product) {
      const { error } = await supabase.from('products').update({
        ...data,
        slug: product.slug,
      }).eq('id', product.id);
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.from('products').insert(data);
      if (error) setError(error.message);
    }

    setSaving(false);
    if (!error) onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-wood-800">
            {product ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <button onClick={onClose} aria-label="Đóng">
            <X className="h-5 w-5 text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs text-stone-500">Tên sản phẩm *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-stone-500">Mô tả</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-stone-500">Giá (VND) *</label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-stone-500">Giá gốc (VND)</label>
              <input
                type="number"
                value={form.compare_price}
                onChange={(e) => setForm({ ...form, compare_price: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-stone-500">Danh mục</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="input-field"
              >
                <option value="">Không</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-stone-500">Bộ sưu tập</label>
              <select
                value={form.collection_id}
                onChange={(e) => setForm({ ...form, collection_id: e.target.value })}
                className="input-field"
              >
                <option value="">Không</option>
                {collections.map((coll) => (
                  <option key={coll.id} value={coll.id}>{coll.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs text-stone-500">Chất liệu</label>
              <input
                type="text"
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-stone-500">Kích thước</label>
              <input
                type="text"
                value={form.dimensions}
                onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-stone-500">Màu sắc</label>
              <input
                type="text"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-stone-500">Hình ảnh (mỗi URL trên 1 dòng) *</label>
            <textarea
              rows={3}
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              className="input-field font-mono text-xs"
              placeholder="https://images.pexels.com/..."
            />
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { key: 'in_stock', label: 'Còn hàng' },
              { key: 'is_featured', label: 'Nổi bật' },
              { key: 'is_new', label: 'Mới' },
              { key: 'bestseller', label: 'Bán chạy' },
            ].map((opt) => (
              <label key={opt.key} className="flex cursor-pointer items-center gap-2 text-sm text-stone-600">
                <input
                  type="checkbox"
                  checked={form[opt.key as keyof typeof form] as boolean}
                  onChange={(e) => setForm({ ...form, [opt.key]: e.target.checked })}
                  className="accent-wood-700"
                />
                {opt.label}
              </label>
            ))}
          </div>
          {error && (
            <div className="border border-error-300 bg-error-50 p-3 text-sm text-error-700">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
