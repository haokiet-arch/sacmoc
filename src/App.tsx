import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { AccountPage } from '@/pages/AccountPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { BlogPage, BlogPostPage } from '@/pages/BlogPage';
import { PromotionsPage } from '@/pages/PromotionsPage';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminBlogPage } from '@/pages/admin/AdminBlogPage';
import { AdminPromotionsPage } from '@/pages/admin/AdminPromotionsPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin routes (no public layout) */}
            <Route path="/admin/dang-nhap" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="san-pham" element={<AdminProductsPage />} />
              <Route path="don-hang" element={<AdminOrdersPage />} />
              <Route path="bai-viet" element={<AdminBlogPage />} />
              <Route path="khuyen-mai" element={<AdminPromotionsPage />} />
            </Route>

            {/* Public routes (with header/footer) */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/cua-hang" element={<ShopPage />} />
              <Route path="/danh-muc/:categorySlug" element={<ShopPage />} />
              <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
              <Route path="/thanh-toan" element={<CheckoutPage />} />
              <Route path="/dang-nhap" element={<LoginPage />} />
              <Route path="/dang-ky" element={<SignupPage />} />
              <Route path="/tai-khoan" element={<AccountPage />} />
              <Route path="/gioi-thieu" element={<AboutPage />} />
              <Route path="/lien-he" element={<ContactPage />} />
              <Route path="/tin-tuc" element={<BlogPage />} />
              <Route path="/tin-tuc/:slug" element={<BlogPostPage />} />
              <Route path="/khuyen-mai" element={<PromotionsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
