import { Link } from 'react-router-dom';
import { TreePine, Heart, Award, Users } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';

export function AboutPage() {
  return (
    <div>
      <PageHeader
        title="Về Sắc Mộc"
        subtitle="Mộc mạc bản thể, Sắc sảo đường nét - câu chuyện của một thương hiệu nội thất gỗ tự nhiên"
        breadcrumbs={[{ label: 'Trang chủ', to: '/' }, { label: 'Giới thiệu' }]}
      />

      <section className="section-padding bg-stone-50">
        <div className="container-app">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="heading-eyebrow">Câu chuyện của chúng tôi</p>
              <h2 className="mt-4 font-serif text-4xl font-semibold text-wood-800">
                Từ xưởng mộc truyền thống
              </h2>
              <p className="mt-6 text-base leading-relaxed text-stone-600">
                Sắc Mộc ra đời từ tình yêu dành cho vẻ đẹp nguyên bản của gỗ tự nhiên. Chúng tôi
                bắt đầu từ một xưởng mộc nhỏ, nơi những người thợ lành nghề chế tác từng món đồ
                bằng tay, với sự tỉ mỉ và tâm huyết truyền từ đời này sang đời khác.
              </p>
              <p className="mt-4 text-base leading-relaxed text-stone-600">
                Chúng tôi tin rằng nội thất không chỉ là vật dụng, mà là người bạn đồng hành
                cùng gia đình qua nhiều năm tháng. Mỗi thớ gỗ, mỗi đường vân đều mang trong mình
                một câu chuyện của thiên nhiên mà không vật liệu nhân tạo nào có thể thay thế.
              </p>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/7539830/pexels-photo-7539830.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Xưởng mộc Sắc Mộc"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-app">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: TreePine, title: 'Gỗ tự nhiên 100%', desc: 'Nguyên liệu tuyển chọn từ các nguồn gỗ bền vững, có chứng chỉ rõ ràng.' },
              { icon: Heart, title: 'Chế tác thủ công', desc: 'Mỗi sản phẩm được làm thủ công bởi nghệ nhân lành nghề, không sản xuất hàng loạt.' },
              { icon: Award, title: 'Bảo hành 5 năm', desc: 'Cam kết bảo hành dài hạn, hỗ trợ bảo trì và đánh vecanh định kỳ.' },
              { icon: Users, title: 'Tận tâm phục vụ', desc: 'Đội ngũ tư vấn chuyên nghiệp, hỗ trợ từ khâu chọn đến khâu bảo quản.' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center bg-wood-50">
                  <item.icon className="h-8 w-8 text-wood-600" />
                </div>
                <h3 className="mt-4 text-sm font-medium text-stone-800">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-stone-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-wood-800 py-24">
        <div className="container-app text-center">
          <p className="heading-eyebrow text-accent-300">Triết lý Sắc Mộc</p>
          <blockquote className="mx-auto mt-6 max-w-3xl font-serif text-3xl font-medium leading-relaxed text-wood-50 md:text-4xl">
            "Mộc mạc bản thể, Sắc sảo đường nét - chúng tôi giữ trọn vẻ đẹp nguyên bản
            của gỗ, và tinh chế từng đường nét để tạo nên nội thất xứng đáng với tổ ấm của bạn."
          </blockquote>
          <p className="mt-6 text-sm text-wood-200">— Sắc Mộc</p>
        </div>
      </section>

      <section className="section-padding bg-stone-50">
        <div className="container-app text-center">
          <h2 className="font-serif text-3xl font-semibold text-wood-800">
            Khám phá bộ sưu tập
          </h2>
          <p className="mt-3 text-sm text-stone-500">
            Mỗi sản phẩm là một tác phẩm, mỗi không gian là một câu chuyện
          </p>
          <Link to="/cua-hang" className="mt-6 inline-block btn-primary">
            Xem sản phẩm
          </Link>
        </div>
      </section>
    </div>
  );
}
