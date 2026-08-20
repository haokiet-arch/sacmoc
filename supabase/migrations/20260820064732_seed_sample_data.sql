/*
# Sắc Mộc - Seed Sample Data

## Overview
Populates the database with initial sample data for the Sắc Mộc furniture store:
- 7 main categories with subcategories
- 3 collections
- 24+ products across all categories with real images
- 4 blog posts
- 2 promotions

## Data inserted
- categories: Sofa & Armchair, Bàn, Ghế, Giường ngủ, Tủ & Kệ, Bếp, Hàng trang trí (with subcategories)
- collections: Victoria, Côte Noire, Mộc Nguyên Thủy
- products: sample furniture items with prices, images, materials, dimensions
- blog_posts: 4 articles about furniture tips and trends
- promotions: 2 promotional banners
*/

-- ============ CATEGORIES ============
INSERT INTO categories (slug, name, description, image_url, sort_order) VALUES
  ('sofa-armchair', 'Sofa & Armchair', 'Sofa và ghế bành cao cấp từ gỗ tự nhiên', 'https://images.pexels.com/photos/6580396/pexels-photo-6580396.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 1),
  ('ban', 'Bàn', 'Các loại bàn từ gỗ tự nhiên: bàn ăn, bàn nước, bàn làm việc', 'https://images.pexels.com/photos/7180275/pexels-photo-7180275.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 2),
  ('ghe', 'Ghế', 'Ghế ăn, ghế bar, ghế làm việc từ gỗ tự nhiên', 'https://images.pexels.com/photos/29917912/pexels-photo-29917912.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 3),
  ('giuong-ngu', 'Giường ngủ', 'Giường gỗ tự nhiên, tủ đầu giường, nệm', 'https://images.pexels.com/photos/5644286/pexels-photo-5644286.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4),
  ('tu-ke', 'Tủ & Kệ', 'Tủ tivi, tủ giày, kệ sách, tủ áo từ gỗ tự nhiên', 'https://images.pexels.com/photos/7005283/pexels-photo-7005283.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 5),
  ('bep', 'Bếp', 'Tủ bếp, đảo bếp, quầy bar từ gỗ tự nhiên', 'https://images.pexels.com/photos/8146322/pexels-photo-8146322.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 6),
  ('hang-trang-tri', 'Hàng trang trí', 'Bình trang trí, đèn, đồ decor gỗ tự nhiên', 'https://images.pexels.com/photos/7119222/pexels-photo-7119222.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 7)
ON CONFLICT (slug) DO NOTHING;

-- Subcategories
INSERT INTO categories (slug, name, parent_id, sort_order) VALUES
  ('sofa-bang', 'Sofa băng', (SELECT id FROM categories WHERE slug='sofa-armchair'), 1),
  ('sofa-goc', 'Sofa góc', (SELECT id FROM categories WHERE slug='sofa-armchair'), 2),
  ('armchair', 'Armchair', (SELECT id FROM categories WHERE slug='sofa-armchair'), 3),
  ('ghe-thu-gian', 'Ghế thư giãn', (SELECT id FROM categories WHERE slug='sofa-armchair'), 4),
  ('ban-an', 'Bàn ăn', (SELECT id FROM categories WHERE slug='ban'), 1),
  ('ban-nuoc', 'Bàn nước', (SELECT id FROM categories WHERE slug='ban'), 2),
  ('ban-lam-viec', 'Bàn làm việc', (SELECT id FROM categories WHERE slug='ban'), 3),
  ('ban-trang-diem', 'Bàn trang điểm', (SELECT id FROM categories WHERE slug='ban'), 4),
  ('ghe-an', 'Ghế ăn', (SELECT id FROM categories WHERE slug='ghe'), 1),
  ('ghe-bar', 'Ghế bar', (SELECT id FROM categories WHERE slug='ghe'), 2),
  ('ghe-lam-viec', 'Ghế làm việc', (SELECT id FROM categories WHERE slug='ghe'), 3),
  ('giuong', 'Giường', (SELECT id FROM categories WHERE slug='giuong-ngu'), 1),
  ('tu-dau-giuong', 'Tủ đầu giường', (SELECT id FROM categories WHERE slug='giuong-ngu'), 2),
  ('tu-tivi', 'Tủ tivi', (SELECT id FROM categories WHERE slug='tu-ke'), 1),
  ('tu-giay', 'Tủ giày', (SELECT id FROM categories WHERE slug='tu-ke'), 2),
  ('tu-ao', 'Tủ áo', (SELECT id FROM categories WHERE slug='tu-ke'), 3),
  ('ke-sach', 'Kệ sách', (SELECT id FROM categories WHERE slug='tu-ke'), 4),
  ('tu-bep', 'Tủ bếp', (SELECT id FROM categories WHERE slug='bep'), 1),
  ('dao-bep', 'Đảo bếp', (SELECT id FROM categories WHERE slug='bep'), 2),
  ('binh-trang-tri', 'Bình trang trí', (SELECT id FROM categories WHERE slug='hang-trang-tri'), 1),
  ('den-trang-tri', 'Đèn trang trí', (SELECT id FROM categories WHERE slug='hang-trang-tri'), 2)
ON CONFLICT (slug) DO NOTHING;

-- ============ COLLECTIONS ============
INSERT INTO collections (slug, name, description, image_url) VALUES
  ('victoria', 'Victoria', 'Từ cảm hứng miền quê Pháp đến cảm xúc ngôi nhà Việt - đường cong mềm mại, chi tiết chạm tay và tông màu ấm cho từng không gian sống.', 'https://images.pexels.com/photos/16985123/pexels-photo-16985123.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('cote-noire', 'Côte Noire', 'Sự giao thoa giữa vẻ đẹp cổ điển và nét hiện đại, mang đến không gian sống đẳng cấp và tinh tế.', 'https://images.pexels.com/photos/38127108/pexels-photo-38127108.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('moc-nguyen-thuy', 'Mộc Nguyên Thủy', 'Vẻ đẹp nguyên bản của gỗ tự nhiên - giữ trọn vẹn đường vân, màu gỗ và hơi thở của thiên nhiên trong từng chi tiết.', 'https://images.pexels.com/photos/15456211/pexels-photo-15456211.jpeg?auto=compress&cs=tinysrgb&h=650&w=940')
ON CONFLICT (slug) DO NOTHING;

-- ============ PRODUCTS ============
-- Sofa & Armchair
INSERT INTO products (slug, name, description, price, compare_price, category_id, collection_id, material, dimensions, color, in_stock, is_featured, is_new, bestseller, images) VALUES
  ('sofa-victoria-3-cho', 'Sofa Victoria 3 chỗ', 'Sofa Victoria mang đường cong mềm mại lấy cảm hứng từ miền quê Pháp, với phần đệm bọc vải cao cấp và khung gỗ sồi tự nhiên. Từng chi tiết được chạm khắc thủ công, tạo nên vẻ đẹp vừa cổ điển vừa ấm áp cho không gian phòng khách.', 28500000, 32000000, (SELECT id FROM categories WHERE slug='sofa-bang'), (SELECT id FROM collections WHERE slug='victoria'), 'Gỗ sồi tự nhiên, vải bọc cao cấp', '220 x 95 x 85 cm', 'Màu kem', true, true, true, true, ARRAY['https://images.pexels.com/photos/6580396/pexels-photo-6580396.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/12277350/pexels-photo-12277350.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/12277201/pexels-photo-12277201.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('sofa-goc-cote-noire', 'Sofa góc Côte Noire', 'Sofa góc Côte Noire với thiết kế hiện đại, phần lưng tựa cao bọc da thật, khung gỗ cẩm lai đặc. Sự kết hợp giữa da và gỗ tạo nên vẻ đẹp sang trọng, phù hợp cho cả không gian mở và phòng khách riêng tư.', 45000000, NULL, (SELECT id FROM categories WHERE slug='sofa-goc'), (SELECT id FROM collections WHERE slug='cote-noire'), 'Gỗ cẩm lai, da thật', '320 x 200 x 90 cm', 'Màu nâu đậm', true, true, false, true, ARRAY['https://images.pexels.com/photos/7539830/pexels-photo-7539830.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/6480707/pexels-photo-6480707.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('armchair-victoria-khong-tay', 'Armchair Victoria không tay', 'Armchair Victoria không tay với thiết kế tối giản, đường cong lưng tựa uyển chuyển, đệm bọc vải linen tự nhiên. Ghế phù hợp đặt ở góc đọc sách hoặc kết hợp cùng sofa trong phòng khách.', 12500000, 14000000, (SELECT id FROM categories WHERE slug='armchair'), (SELECT id FROM collections WHERE slug='victoria'), 'Gỗ sồi, vải linen', '75 x 80 x 90 cm', 'Màu xám nhạt', true, false, true, false, ARRAY['https://images.pexels.com/photos/17948130/pexels-photo-17948130.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/12420730/pexels-photo-12420730.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('ghe-thu-gian-moc-nguyen-thuy', 'Ghế thư giãn Mộc Nguyên Thủy', 'Ghế thư giãn giữ trọn vẻ đẹp nguyên bản của gỗ tự nhiên với đường vân nổi rõ. Thiết kế công học ôm sát cơ thể, phần tựa lưng nghiêng vừa phải cho cảm giác thư thái tuyệt đối.', 8500000, NULL, (SELECT id FROM categories WHERE slug='ghe-thu-gian'), (SELECT id FROM collections WHERE slug='moc-nguyen-thuy'), 'Gỗ hương tự nhiên', '95 x 90 x 100 cm', 'Màu gỗ tự nhiên', true, false, false, false, ARRAY['https://images.pexels.com/photos/12277020/pexels-photo-12277020.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/12277021/pexels-photo-12277021.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('sofa-bang-moc-nho', 'Sofa băng Mộc nhỏ', 'Sofa băng nhỏ gọn với khung gỗ sồi, đệm bọc vải cotton mềm mại. Phù hợp cho căn hộ diện tích vừa, có thể kết hợp với armchair hoặc dùng độc lập.', 15500000, 17500000, (SELECT id FROM categories WHERE slug='sofa-bang'), NULL, 'Gỗ sồi, vải cotton', '180 x 85 x 80 cm', 'Màu be', true, false, false, false, ARRAY['https://images.pexels.com/photos/5824608/pexels-photo-5824608.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/31749757/pexels-photo-31749757.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'])
ON CONFLICT (slug) DO NOTHING;

-- Bàn
INSERT INTO products (slug, name, description, price, compare_price, category_id, collection_id, material, dimensions, color, in_stock, is_featured, is_new, bestseller, images) VALUES
  ('ban-an-victoria-6-cho', 'Bàn ăn Victoria 6 chỗ', 'Bàn ăn Victoria với mặt bàn gỗ sồi nguyên khối, chân trụ điêu khắc tinh xảo. Bề mặt gỗ được đánh vecanh thủ công, giữ trọn đường vân tự nhiên. Kèm 6 ghế ăn gỗ sồi bọc đệm.', 32000000, NULL, (SELECT id FROM categories WHERE slug='ban-an'), (SELECT id FROM collections WHERE slug='victoria'), 'Gỗ sồi tự nhiên', '200 x 100 x 75 cm', 'Màu gỗ sồi', true, true, true, true, ARRAY['https://images.pexels.com/photos/5998031/pexels-photo-5998031.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7180275/pexels-photo-7180275.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/4221404/pexels-photo-4221404.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('ban-nuoc-cote-noire', 'Bàn nước Côte Noire', 'Bàn nước Côte Noire với mặt đá cẩm thạch tự nhiên, khung gỗ gõ đỏ. Thiết kế thấp, rộng, phù hợp cho không gian phòng khách hiện đại. Vẻ đẹp đến từ sự tương phản giữa đá lạnh và gỗ ấm.', 18500000, 21000000, (SELECT id FROM categories WHERE slug='ban-nuoc'), (SELECT id FROM collections WHERE slug='cote-noire'), 'Gỗ gõ đỏ, đá cẩm thạch', '140 x 70 x 38 cm', 'Màu nâu đỏ', true, true, false, false, ARRAY['https://images.pexels.com/photos/6908357/pexels-photo-6908357.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/3773579/pexels-photo-3773579.png?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('ban-lam-viec-moc-nguyen-thuy', 'Bàn làm việc Mộc Nguyên Thủy', 'Bàn làm việc giữ trọn vẻ đẹp nguyên bản của gỗ tự nhiên. Mặt bàn gỗ sồi nguyên tấm, chân Z bằng gỗ đặc, không gian để chân rộng rãi. Kèm 1 ngăn kéo ẩn cho văn phòng phẩm.', 9800000, NULL, (SELECT id FROM categories WHERE slug='ban-lam-viec'), (SELECT id FROM collections WHERE slug='moc-nguyen-thuy'), 'Gỗ sồi tự nhiên', '140 x 70 x 75 cm', 'Màu gỗ tự nhiên', true, false, true, false, ARRAY['https://images.pexels.com/photos/265096/pexels-photo-265096.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/6284230/pexels-photo-6284230.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('ban-trang-diem-victoria', 'Bàn trang điểm Victoria', 'Bàn trang điểm Victoria với thiết kế thanh lịch, mặt bàn hình oval, kèm gương và 3 ngăn kéo. Chân bàn chạm khắc hoa văn cổ điển, đệm ghế bọc vải nhung.', 12500000, 14500000, (SELECT id FROM categories WHERE slug='ban-trang-diem'), (SELECT id FROM collections WHERE slug='victoria'), 'Gỗ sồi, vải nhung', '100 x 45 x 75 cm', 'Màu trắng kem', true, false, false, false, ARRAY['https://images.pexels.com/photos/12277124/pexels-photo-12277124.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/8135289/pexels-photo-8135289.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'])
ON CONFLICT (slug) DO NOTHING;

-- Ghế
INSERT INTO products (slug, name, description, price, compare_price, category_id, collection_id, material, dimensions, color, in_stock, is_featured, is_new, bestseller, images) VALUES
  ('ghe-an-victoria', 'Ghế ăn Victoria', 'Ghế ăn Victoria với lưng tựa cao chạm khắc hoa văn, đệm bọc vải linen. Ghế được làm từ gỗ sồi tự nhiên, vừa vững chãi vừa thanh lịch. Bán theo chiếc hoặc theo bộ bàn ăn.', 3200000, NULL, (SELECT id FROM categories WHERE slug='ghe-an'), (SELECT id FROM collections WHERE slug='victoria'), 'Gỗ sồi, vải linen', '45 x 50 x 95 cm', 'Màu gỗ sồi', true, false, false, true, ARRAY['https://images.pexels.com/photos/29917912/pexels-photo-29917912.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/35073993/pexels-photo-35073993.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('ghe-bar-cote-noire', 'Ghế bar Côte Noire', 'Ghế bar Côte Noire với thiết kế hiện đại, chân gỗ cẩm lai cao, đệm bọc da. Ghế có chân đỡ tiện năng, phù hợp cho quầy bar hoặc đảo bếp.', 4500000, 5200000, (SELECT id FROM categories WHERE slug='ghe-bar'), (SELECT id FROM collections WHERE slug='cote-noire'), 'Gỗ cẩm lai, da thật', '45 x 45 x 105 cm', 'Màu đen', true, false, true, false, ARRAY['https://images.pexels.com/photos/112474/pexels-photo-112474.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/23384612/pexels-photo-23384612.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('ghe-lam-viec-moc-nguyen-thuy', 'Ghế làm việc Mộc Nguyên Thủy', 'Ghế làm việc giữ vẻ đẹp mộc mạc của gỗ tự nhiên. Thiết kế công học, lưng tựa cong theo cột sống, có thể điều chỉnh độ cao. Phù hợp cho văn phòng và phòng làm việc tại nhà.', 5500000, NULL, (SELECT id FROM categories WHERE slug='ghe-lam-viec'), (SELECT id FROM collections WHERE slug='moc-nguyen-thuy'), 'Gỗ hương tự nhiên', '60 x 60 x 90-100 cm', 'Màu gỗ tự nhiên', true, false, false, false, ARRAY['https://images.pexels.com/photos/265096/pexels-photo-265096.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/29463228/pexels-photo-29463228.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'])
ON CONFLICT (slug) DO NOTHING;

-- Giường ngủ
INSERT INTO products (slug, name, description, price, compare_price, category_id, collection_id, material, dimensions, color, in_stock, is_featured, is_new, bestseller, images) VALUES
  ('giuong-victoria-1m8', 'Giường Victoria 1m8', 'Giường Victoria 1m8 với đầu giường chạm khắc hoa văn cổ điển, khung gỗ sồi tự nhiên. Phần đệm bọc vải nhung cao cấp, tạo cảm giác ấm áp và sang trọng cho phòng ngủ.', 28500000, 32000000, (SELECT id FROM categories WHERE slug='giuong'), (SELECT id FROM collections WHERE slug='victoria'), 'Gỗ sồi tự nhiên, vải nhung', '200 x 180 x 130 cm', 'Màu kem', true, true, false, true, ARRAY['https://images.pexels.com/photos/8135289/pexels-photo-8135289.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/27164976/pexels-photo-27164976.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/189293/pexels-photo-189293.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('giuong-moc-nguyen-thuy-1m6', 'Giường Mộc Nguyên Thủy 1m6', 'Giường gỗ tự nhiên giữ trọn vẻ đẹp nguyên bản của gỗ. Đầu giường dạng vân gỗ nổi, không sơn phủ, chỉ đánh vecanh trong để bảo vệ. Thiết kế tối giản, phù hợp phong cách hiện đại.', 18500000, NULL, (SELECT id FROM categories WHERE slug='giuong'), (SELECT id FROM collections WHERE slug='moc-nguyen-thuy'), 'Gỗ hương tự nhiên', '200 x 160 x 100 cm', 'Màu gỗ tự nhiên', true, false, true, false, ARRAY['https://images.pexels.com/photos/5644286/pexels-photo-5644286.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7587809/pexels-photo-7587809.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/34838628/pexels-photo-34838628.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('tu-dau-giuong-cote-noire', 'Tủ đầu giường Côte Noire', 'Tủ đầu giường Côte Noire với thiết kế hiện đại, mặt gỗ cẩm lai sơn mờ, tay nắm đồng. Tủ có 2 ngăn kéo, bề mặt rộng đủ đặt đèn ngủ và sách.', 6500000, 7500000, (SELECT id FROM categories WHERE slug='tu-dau-giuong'), (SELECT id FROM collections WHERE slug='cote-noire'), 'Gỗ cẩm lai', '50 x 40 x 55 cm', 'Màu nâu đậm', true, false, false, false, ARRAY['https://images.pexels.com/photos/7005280/pexels-photo-7005280.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/9615255/pexels-photo-9615255.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'])
ON CONFLICT (slug) DO NOTHING;

-- Tủ & Kệ
INSERT INTO products (slug, name, description, price, compare_price, category_id, collection_id, material, dimensions, color, in_stock, is_featured, is_new, bestseller, images) VALUES
  ('tu-tivi-victoria', 'Tủ tivi Victoria', 'Tủ tivi Victoria với thiết kế cổ điển, chân trụ chạm khắc, 2 ngăn cửa có tay nắm đồng. Mặt tủ rộng rãi, có kệ phụ 2 tầng để thiết bị giải trí.', 15500000, NULL, (SELECT id FROM categories WHERE slug='tu-tivi'), (SELECT id FROM collections WHERE slug='victoria'), 'Gỗ sồi tự nhiên', '180 x 45 x 55 cm', 'Màu gỗ sồi', true, true, false, false, ARRAY['https://images.pexels.com/photos/6934239/pexels-photo-6934239.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/12277193/pexels-photo-12277193.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('tu-giay-moc-nguyen-thuy', 'Tủ giày Mộc Nguyên Thủy', 'Tủ giày gỗ tự nhiên với 3 tầng, mỗi tầng 2 ngăn kéo rút. Thiết kế tối giản, mặt gỗ để vân tự nhiên. Chân tủ cao 15cm, chống ẩm và dễ vệ sinh.', 7500000, 8500000, (SELECT id FROM categories WHERE slug='tu-giay'), (SELECT id FROM collections WHERE slug='moc-nguyen-thuy'), 'Gỗ sồi tự nhiên', '100 x 35 x 120 cm', 'Màu gỗ tự nhiên', true, false, true, false, ARRAY['https://images.pexels.com/photos/36738046/pexels-photo-36738046.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/27562185/pexels-photo-27562185.png?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('tu-ao-cote-noire', 'Tủ áo Côte Noire', 'Tủ áo Côte Noire với 4 cánh cửa mở, bên trong chia ngăn thông minh: thanh treo, kệ gấp, ngăn kéo. Bề mặt gỗ cẩm lai sơn mờ, tay nắm đồng cổ điển.', 32000000, 36000000, (SELECT id FROM categories WHERE slug='tu-ao'), (SELECT id FROM collections WHERE slug='cote-noire'), 'Gỗ cẩm lai', '200 x 60 x 220 cm', 'Màu nâu đậm', true, false, false, true, ARRAY['https://images.pexels.com/photos/7005283/pexels-photo-7005283.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7166634/pexels-photo-7166634.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('ke-sach-moc-nguyen-thuy', 'Kệ sách Mộc Nguyên Thủy', 'Kệ sách 5 tầng gỗ tự nhiên, thiết kế mở, không che chắn. Giữ vân gỗ nguyên bản, mỗi tầng chịu tải 30kg. Phù hợp cho phòng đọc, phòng làm việc hoặc phòng khách.', 12500000, NULL, (SELECT id FROM categories WHERE slug='ke-sach'), (SELECT id FROM collections WHERE slug='moc-nguyen-thuy'), 'Gỗ sồi tự nhiên', '120 x 35 x 200 cm', 'Màu gỗ tự nhiên', true, false, false, false, ARRAY['https://images.pexels.com/photos/6899442/pexels-photo-6899442.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/10117739/pexels-photo-10117739.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'])
ON CONFLICT (slug) DO NOTHING;

-- Bếp
INSERT INTO products (slug, name, description, price, compare_price, category_id, collection_id, material, dimensions, color, in_stock, is_featured, is_new, bestseller, images) VALUES
  ('tu-bep-cote-noire', 'Tủ bếp Côte Noire', 'Tủ bếp Côte Noire với hệ tủ chữ L, mặt cánh gỗ cẩm lai sơn mờ, mặt đá thạch anh. Bao gồm tủ dưới, tủ trên, phụ kiện ray trượt, thùng rác ẩn. Thiết kế công năng cao cho không gian bếp hiện đại.', 65000000, NULL, (SELECT id FROM categories WHERE slug='tu-bep'), (SELECT id FROM collections WHERE slug='cote-noire'), 'Gỗ cẩm lai, đá thạch anh', '300 x 60 x 85 cm', 'Màu nâu đậm', true, true, false, true, ARRAY['https://images.pexels.com/photos/8146322/pexels-photo-8146322.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7045356/pexels-photo-7045356.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/8089082/pexels-photo-8089082.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('dao-bep-moc-nguyen-thuy', 'Đảo bếp Mộc Nguyên Thủy', 'Đảo bếp gỗ tự nhiên với mặt bàn gỗ sồi nguyên tấm, chân gỗ đặc. Bên dưới có 2 ngăn kéo lớn và kệ mở. Phù hợp làm quầy bar nhỏ hoặc khu vực chế biến phụ.', 28500000, 32000000, (SELECT id FROM categories WHERE slug='dao-bep'), (SELECT id FROM collections WHERE slug='moc-nguyen-thuy'), 'Gỗ sồi tự nhiên', '160 x 80 x 90 cm', 'Màu gỗ tự nhiên', true, false, true, false, ARRAY['https://images.pexels.com/photos/6908565/pexels-photo-6908565.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/6283972/pexels-photo-6283972.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'])
ON CONFLICT (slug) DO NOTHING;

-- Hàng trang trí
INSERT INTO products (slug, name, description, price, compare_price, category_id, collection_id, material, dimensions, color, in_stock, is_featured, is_new, bestseller, images) VALUES
  ('binh-trang-tri-victoria', 'Bình trang trí Victoria', 'Bình trang trí Victoria với dáng cao, cổ hẹp, chất liệu gốm tráng men thủ công. Hoa văn chìm lấy cảm hứng từ hoa văn cổ điển Pháp. Phù hợp cắm hoa khô hoặc làm đồ decor độc lập.', 1850000, NULL, (SELECT id FROM categories WHERE slug='binh-trang-tri'), (SELECT id FROM collections WHERE slug='victoria'), 'Gốm tráng men thủ công', '35 x 35 x 60 cm', 'Màu trắng kem', true, false, true, false, ARRAY['https://images.pexels.com/photos/7119222/pexels-photo-7119222.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/27180805/pexels-photo-27180805.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('binh-trang-tri-moc-nguyen-thuy', 'Bình trang trí Mộc Nguyên Thủy', 'Bình trang trí gỗ tự nhiên, được tiện từ khối gỗ nguyên thể. Giữ trọn vân gỗ và màu gỗ bản địa. Mỗi bình là một tác phẩm độc bản, không có chiếc thứ hai giống hệt.', 2200000, 2500000, (SELECT id FROM categories WHERE slug='binh-trang-tri'), (SELECT id FROM collections WHERE slug='moc-nguyen-thuy'), 'Gỗ hương tự nhiên', '25 x 25 x 45 cm', 'Màu gỗ tự nhiên', true, false, false, false, ARRAY['https://images.pexels.com/photos/26774901/pexels-photo-26774901.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/1629161/pexels-photo-1629161.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']),
  ('den-trang-tri-cote-noire', 'Đèn trang trí Côte Noire', 'Đèn bàn Côte Noire với thân gỗ cẩm lai, chụp vải lụa màu ấm. Thiết kế tối giản, ánh sáng dịu nhẹ, phù hợp đặt trên tủ đầu giường hoặc bàn nước.', 3500000, NULL, (SELECT id FROM categories WHERE slug='den-trang-tri'), (SELECT id FROM collections WHERE slug='cote-noire'), 'Gỗ cẩm lai, vải lụa', '30 x 30 x 55 cm', 'Màu nâu đậm', true, false, false, false, ARRAY['https://images.pexels.com/photos/6952339/pexels-photo-6952339.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/13981325/pexels-photo-13981325.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'])
ON CONFLICT (slug) DO NOTHING;

-- ============ BLOG POSTS ============
INSERT INTO blog_posts (slug, title, excerpt, content, image_url, published) VALUES
  ('cach-chon-noi-that-go-tu-nhien', 'Cách chọn nội thất gỗ tự nhiên cho không gian sống', 'Hướng dẫn chi tiết cách chọn gỗ tự nhiên phù hợp với phong cách và ngân sách của gia đình bạn. Từ việc nhận biết loại gỗ đến đánh giá chất lượng.', '## Tại sao nên chọn gỗ tự nhiên?

Gỗ tự nhiên mang lại vẻ đẹp nguyên bản mà không vật liệu nào có thể thay thế. Mỗi thớ gỗ, mỗi đường vân đều mang dấu ấn riêng của thiên nhiên, tạo nên những món đồ nội thất độc bản.

## Các loại gỗ phổ biến tại Việt Nam

### Gỗ sồi
Gỗ sồi có màu sáng, đường vân rõ ràng, độ cứng cao và chịu lực tốt. Phù hợp cho sofa, bàn ăn, tủ.

### Gỗ cẩm lai
Gỗ cẩm lai có màu nâu đậm, vân gỗ đẹp, chịu ẩm tốt. Thường dùng cho tủ áo, tủ bếp, giường.

### Gỗ hương
Gỗ hương có mùi thơm đặc trưng, màu ấm, độ bền cao. Phù hợp cho giường, ghế thư giãn, đồ decor.

## Tiêu chí chọn nội thất gỗ

1. **Đường vân**: Vân gỗ tự nhiên sẽ không đều, có sự thay đổi liên tục. Nếu vân quá đều, có thể là gỗ công nghiệp in vân.

2. **Trọng lượng**: Gỗ tự nhiên thường nặng hơn gỗ công nghiệp cùng kích thước.

3. **Mùi hương**: Gỗ tự nhiên có mùi đặc trưng, đặc biệt là gỗ hương, gỗ trắc.

4. **Bề mặt**: Sờ vào bề mặt gỗ tự nhiên sẽ có cảm giác mịn nhưng vẫn có độ sần nhẹ của thớ gỗ.

5. **Giá thành**: Gỗ tự nhiên đắt hơn gỗ công nghiệp, nhưng độ bền có thể lên đến hàng chục năm.

## Kết luận

Chọn nội thất gỗ tự nhiên là đầu tư dài hạn cho không gian sống. Hy vọng bài viết giúp bạn đưa ra quyết định phù hợp cho tổ ấm của mình.', 'https://images.pexels.com/photos/6580396/pexels-photo-6580396.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true),
  ('xu-huong-noi-that-2026', 'Xu hướng nội thất gỗ 2026: Mộc mạc và bền vững', 'Khám phá xu hướng nội thất gỗ tự nhiên 2026 với trọng tâm vào vẻ đẹp nguyên bản, vật liệu bền vững và thiết kế tối giản.', '## Xu hướng mộc mạc

Năm 2026, xu hướng nội thất gỗ thiên về vẻ đẹp mộc mạc, giữ trọn đường vân và màu gỗ tự nhiên thay vì sơn phủ dày. Người dùng ngày càng yêu thích sự nguyên bản, muốn cảm nhận hơi thở của thiên nhiên trong ngôi nhà.

## Vật liệu bền vững

Các loại gỗ được khai thác bền vững, có chứng chỉ FSC ngày càng được ưa chuộng. Người tiêu dùng quan tâm đến nguồn gốc gỗ, quy trình sản xuất và tác động môi trường.

## Thiết kế tối giản

Nội thất gỗ 2026 ưu tiên thiết kế tối giản, đường nét sạch sẽ, ít chi tiết chạm khắc rườm rà. Sự tinh tế nằm trong chất liệu và tỷ lệ, không cần lớp lớp trang trí.

## Màu gỗ ấm

Tông màu gỗ ấm như nâu mật, vàng nhạt, kem be lên ngôi. Các tông lạnh như xám, trắng sáng nhường chỗ cho màu gỗ tự nhiên ấm áp, tạo cảm giác gần gũi.

## Kết hợp vật liệu

Gỗ tự nhiên kết hợp với đá, da, vải linen tạo nên những không gian đa chiều, vừa ấm áp vừa sang trọng. Sự tương phản giữa các chất liệu là điểm nhấn của năm 2026.', 'https://images.pexels.com/photos/16985123/pexels-photo-16985123.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true),
  ('bao-quan-noi-that-go-tu-nhien', 'Bảo quản nội thất gỗ tự nhiên đúng cách', 'Những nguyên tắc cơ bản để giữ cho nội thất gỗ tự nhiên luôn đẹp và bền bỉ theo thời gian. Từ vệ sinh hàng ngày đến xử lý vết xước.', '## Nguyên tắc vệ sinh hàng ngày

- Lau bụi bằng khăn mềm, khô ráo
- Tránh dùng khăn ướt, nước đọng trên bề mặt gỗ
- Không dùng hóa chất tẩy rửa mạnh, chỉ dùng dung dịch chuyên dụng cho gỗ

## Kiểm soát độ ẩm

Gỗ tự nhiên dễ bị nứt nếu môi trường quá khô, hoặc mốc nếu quá ẩm. Nên giữ độ ẩm phòng ở mức 40-60%. Sử dụng máy phun sương hoặc máy hút ẩm khi cần.

## Tránh ánh nắng trực tiếp

Ánh nắng trực tiếp làm gỗ bị phai màu, nứt nẻ. Nên đặt nội thất tránh cửa sổ hướng tây, hoặc dùng rèm che. Nếu không thể tránh, hãy dùng phim chống nắng cho kính.

## Xử lý vết xước

- Vết xước nhẹ: Dùng sáp ong bôi lên vết xước, đánh bằng khăn mềm
- Vết xước sâu: Dùng bút sửa chữa gỗ cùng màu, sau đó đánh vecanh lại
- Vết trầy lớn: Nên gọi thợ chuyên nghiệp để xử lý

## Bảo trì định kỳ

Mỗi 6-12 tháng nên đánh vecanh lại bề mặt gỗ để bảo vệ và duy trì độ bóng. Vệ sinh kỹ trước khi đánh, để bề mặt hoàn toàn khô ráo.

## Kết luận

Nội thất gỗ tự nhiên cần được chăm sóc nhưng sẽ đền đáp bằng vẻ đẹp ngày càng trầm ấm theo năm tháng. Một bộ sofa gỗ tốt có thể đồng hành cùng gia đình 20-30 năm nếu được bảo quản đúng cách.', 'https://images.pexels.com/photos/5644286/pexels-photo-5644286.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true),
  ('phong-cach-thiet-ke-noi-that-victoria', 'Phong cách thiết kế Victoria: Cảm hứng Pháp trong ngôi nhà Việt', 'Khám phá phong cách Victoria - sự giao thoa giữa vẻ đẹp cổ điển Pháp và cảm xúc ấm áp của ngôi nhà Việt, qua bộ sưu tập nội thất Sắc Mộc.', '## Nguồn cảm hứng

Phong cách Victoria lấy cảm hứng từ miền quê nước Pháp, nơi những căn nhà đá ấm cúng được trang trí bằng nội thất gỗ chạm khắc tinh xảo. Tại Sắc Mộc, chúng tôi mang tinh thần đó vào không gian sống Việt Nam, tạo nên sự giao thoa văn hóa độc đáo.

## Đặc trưng thiết kế

### Đường cong mềm mại
Nội thất Victoria chuộng đường cong uyển chuyển thay vì góc cạnh góc cạnh. Lưng tựa sofa, chân bàn, đầu giường đều có độ cong tinh tế.

### Chạm khắc thủ công
Mỗi chi tiết chạm khắc đều được thực hiện thủ công bởi nghệ nhân lành nghề. Hoa văn lấy cảm hứng từ thiên nhiên: lá, hoa, cánh chim.

### Tông màu ấm
Bộ sưu tập Victoria sử dụng tông màu ấm: kem, be, nâu nhạt, vàng mật. Màu gỗ sồi tự nhiên là nền tảng, kết hợp với vải bọc vải nhung, linen.

## Không gian gợi ý

- **Phòng khách**: Sofa Victoria 3 chỗ + bàn nước Côte Noire + armchair không tay
- **Phòng ngủ**: Giường Victoria 1m8 + tủ đầu giường Côte Noire + bàn trang điểm Victoria
- **Phòng ăn**: Bàn ăn Victoria 6 chỗ + ghế ăn Victoria

## Kết luận

Phong cách Victoria không chỉ là thẩm mỹ mà còn là triết lý sống: trân trọng vẻ đẹp truyền thống, kết hợp với công năng hiện đại. Bộ sưu tập Victoria của Sắc Mộc là lời mời gọi bạn trải nghiệm.', 'https://images.pexels.com/photos/38127108/pexels-photo-38127108.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true)
ON CONFLICT (slug) DO NOTHING;

-- ============ PROMOTIONS ============
INSERT INTO promotions (title, description, image_url, discount_text, active) VALUES
  ('Giảm giá đặc biệt mùa hè', 'Giảm đến 15% cho tất cả sản phẩm sofa và armchair trong bộ sưu tập Victoria. Cơ hội sở hữu nội thất cao cấp với giá ưu đãi.', 'https://images.pexels.com/photos/6580396/pexels-photo-6580396.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Giảm đến 15%', true),
  ('Ưu đãi bộ phòng ngủ', 'Mua giường + tủ đầu giường + bàn trang điểm cùng bộ, giảm ngay 2.000.000đ. Áp dụng cho bộ sưu tập Victoria và Côte Noire.', 'https://images.pexels.com/photos/8135289/pexels-photo-8135289.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Giảm 2.000.000đ', true)
ON CONFLICT DO NOTHING;
