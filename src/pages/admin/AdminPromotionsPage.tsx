import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Promotion } from '@/types';

export function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function fetchPromotions() {
    const { data } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });
    setPromotions((data as Promotion[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchPromotions();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Bạn có chắc muốn xóa khuyến mãi này?')) return;
    await supabase.from('promotions').delete().eq('id', id);
    fetchPromotions();
  }

  async function toggleActive(promo: Promotion) {
    await supabase.from('promotions').update({ active: !promo.active }).eq('id', promo.id);
    fetchPromotions();
  }

  if (loading) {
    return <div className="h-64 bg-stone-200" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-wood-800">Quản lý khuyến mãi</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="h-4 w-4" />
          Thêm khuyến mãi
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {promotions.map((promo) => (
          <div key={promo.id} className="border border-stone-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {promo.discount_text && (
                    <span className="bg-accent-500 px-2 py-0.5 text-xs font-medium text-white">
                      {promo.discount_text}
                    </span>
                  )}
                  <h3 className="text-sm font-medium text-stone-800">{promo.title}</h3>
                </div>
                <p className="mt-2 text-xs text-stone-500">{promo.description}</p>
                <button
                  onClick={() => toggleActive(promo)}
                  className={`mt-3 px-3 py-1 text-xs font-medium ${
                    promo.active
                      ? 'bg-success-100 text-success-700'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {promo.active ? 'Đang hiển thị' : 'Đã ẩn'}
                </button>
              </div>
              <button
                onClick={() => handleDelete(promo.id)}
                className="p-1.5 text-stone-500 hover:text-error-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <PromoForm
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            fetchPromotions();
          }}
        />
      )}
    </div>
  );
}

function PromoForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    discount_text: '',
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('promotions').insert(form);
    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      onSaved();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-wood-800">Thêm khuyến mãi</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-stone-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs text-stone-500">Tiêu đề *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
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
          <div>
            <label className="mb-1 block text-xs text-stone-500">Văn bản giảm giá</label>
            <input
              type="text"
              value={form.discount_text}
              onChange={(e) => setForm({ ...form, discount_text: e.target.value })}
              className="input-field"
              placeholder="Giảm 15%"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-stone-500">URL hình ảnh</label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="input-field"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="accent-wood-700"
            />
            Hiển thị ngay
          </label>
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
