import { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', phone: '', message: '' });
  }

  return (
    <div>
      <PageHeader
        title="Liên hệ"
        subtitle="Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn"
        breadcrumbs={[{ label: 'Trang chủ', to: '/' }, { label: 'Liên hệ' }]}
      />

      <section className="section-padding bg-stone-50">
        <div className="container-app">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-2xl font-semibold text-wood-800">
                Thông tin liên hệ
              </h2>
              <ul className="mt-6 space-y-5">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-wood-600" />
                  <div>
                    <p className="text-sm font-medium text-stone-800">Showroom</p>
                    <p className="text-sm text-stone-500">
                      123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-wood-600" />
                  <div>
                    <p className="text-sm font-medium text-stone-800">Hotline</p>
                    <a href="tel:0903884358" className="text-sm text-stone-500 hover:text-wood-700">
                      0903 884 358
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-wood-600" />
                  <div>
                    <p className="text-sm font-medium text-stone-800">Email</p>
                    <a href="mailto:info@sacmoc.vn" className="text-sm text-stone-500 hover:text-wood-700">
                      info@sacmoc.vn
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-wood-600" />
                  <div>
                    <p className="text-sm font-medium text-stone-800">Giờ mở cửa</p>
                    <p className="text-sm text-stone-500">
                      Thứ 2 - Thứ 7: 8:00 - 20:00<br />
                      Chủ nhật: 9:00 - 18:00
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 aspect-[16/9] overflow-hidden bg-stone-200">
                <iframe
                  title="Bản đồ Sắc Mộc"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=106.6951%2C10.7623%2C106.7151%2C10.7723&layer=mapnik"
                  className="h-full w-full border-0"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-2xl font-semibold text-wood-800">
                Gửi tin nhắn cho chúng tôi
              </h2>
              {sent ? (
                <div className="mt-6 border border-success-300 bg-success-50 p-6 text-center">
                  <p className="text-sm text-success-700">
                    Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-4 btn-secondary"
                  >
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1 block text-xs text-stone-500">Họ và tên *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-stone-500">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-stone-500">Số điện thoại</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-stone-500">Nội dung *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Gửi tin nhắn
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
