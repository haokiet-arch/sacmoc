import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-wood-900 text-wood-100">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-wood-50">Sắc Mộc</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-wood-300">
              Mộc mạc bản thể
            </p>
            <p className="mt-4 text-sm leading-relaxed text-wood-200">
              Sắc sảo đường nét. Nội thất gỗ tự nhiên cao cấp, mang vẻ đẹp nguyên bản
              của thiên nhiên vào không gian sống của bạn.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center border border-wood-700 transition-colors hover:bg-wood-800"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center border border-wood-700 transition-colors hover:bg-wood-800"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Youtube"
                className="flex h-9 w-9 items-center justify-center border border-wood-700 transition-colors hover:bg-wood-800"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-wood-50">
              Danh mục
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-wood-200">
              <li>
                <Link to="/danh-muc/sofa-armchair" className="transition-colors hover:text-wood-50">
                  Sofa & Armchair
                </Link>
              </li>
              <li>
                <Link to="/danh-muc/ban" className="transition-colors hover:text-wood-50">
                  Bàn
                </Link>
              </li>
              <li>
                <Link to="/danh-muc/ghe" className="transition-colors hover:text-wood-50">
                  Ghế
                </Link>
              </li>
              <li>
                <Link to="/danh-muc/giuong-ngu" className="transition-colors hover:text-wood-50">
                  Giường ngủ
                </Link>
              </li>
              <li>
                <Link to="/danh-muc/tu-ke" className="transition-colors hover:text-wood-50">
                  Tủ & Kệ
                </Link>
              </li>
              <li>
                <Link to="/danh-muc/bep" className="transition-colors hover:text-wood-50">
                  Bếp
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-wood-50">
              Về Sắc Mộc
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-wood-200">
              <li>
                <Link to="/gioi-thieu" className="transition-colors hover:text-wood-50">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/tin-tuc" className="transition-colors hover:text-wood-50">
                  Tin tức & Tư vấn
                </Link>
              </li>
              <li>
                <Link to="/khuyen-mai" className="transition-colors hover:text-wood-50">
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link to="/lien-he" className="transition-colors hover:text-wood-50">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-wood-50">
              Liên hệ
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-wood-200">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-wood-400" />
                <span>123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-wood-400" />
                <a href="tel:0903884358" className="transition-colors hover:text-wood-50">
                  0903 884 358
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-wood-400" />
                <a
                  href="mailto:info@sacmoc.vn"
                  className="transition-colors hover:text-wood-50"
                >
                  info@sacmoc.vn
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-xs font-medium uppercase tracking-wider text-wood-50">
                Đăng ký nhận tin
              </h4>
              <form
                className="mt-3 flex"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full border border-wood-700 bg-transparent px-3 py-2 text-sm text-wood-100 placeholder-wood-400 focus:border-wood-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-accent-500 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-accent-600"
                >
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-wood-800">
        <div className="container-app py-4 text-center text-xs text-wood-400">
          © 2026 Sắc Mộc. Mộc mạc bản thể, Sắc sảo đường nét. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
