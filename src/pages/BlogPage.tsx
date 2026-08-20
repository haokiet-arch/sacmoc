import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { BlogPost } from '@/types';
import { formatDateLong } from '@/lib/utils';
import { PageHeader } from '@/components/PageHeader';

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts((data as BlogPost[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <PageHeader
        title="Tin tức & Tư vấn"
        subtitle="Góc chia sẻ về nội thất gỗ tự nhiên, xu hướng thiết kế và cách chăm sóc không gian sống"
        breadcrumbs={[{ label: 'Trang chủ', to: '/' }, { label: 'Tin tức' }]}
      />

      <section className="section-padding bg-stone-50">
        <div className="container-app">
          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[3/2] bg-stone-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} to={`/tin-tuc/${post.slug}`} className="group block">
                  <div className="aspect-[3/2] overflow-hidden bg-stone-100">
                    <img
                      src={post.image_url ?? ''}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="pt-4">
                    <p className="text-xs text-stone-400">{formatDateLong(post.created_at)}</p>
                    <h3 className="mt-2 font-serif text-xl font-medium text-wood-800 group-hover:text-wood-700">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-500 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data }) => {
        setPost(data as BlogPost | null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="container-app py-24">
        <div className="mx-auto max-w-3xl">
          <div className="h-8 w-3/4 bg-stone-200" />
          <div className="mt-4 h-4 w-1/2 bg-stone-200" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-app py-24 text-center">
        <p className="text-stone-500">Không tìm thấy bài viết.</p>
        <Link to="/tin-tuc" className="mt-4 inline-block btn-primary">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <img
          src={post.image_url ?? ''}
          alt={post.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-wood-900/50" />
        <div className="container-app relative flex h-full items-end pb-12">
          <div className="max-w-3xl">
            <p className="text-xs text-wood-200">{formatDateLong(post.created_at)}</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-wood-50">{post.title}</h1>
          </div>
        </div>
      </div>

      <article className="container-app py-12">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/tin-tuc"
            className="mb-6 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-wood-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>

          {post.excerpt && (
            <p className="text-lg leading-relaxed text-stone-600 italic">{post.excerpt}</p>
          )}

          <div className="mt-8 space-y-4 text-base leading-relaxed text-stone-700 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-wood-800 [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-wood-700 [&_li]:ml-6 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1">
            {post.content?.split('\n').map((line, i) => {
              if (line.startsWith('## ')) {
                return <h2 key={i}>{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={i}>{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('- ')) {
                return <li key={i}>{line.replace('- ', '')}</li>;
              }
              if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
                return <li key={i} className="ml-6 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
              }
              if (line.trim() === '') {
                return <div key={i} className="h-4" />;
              }
              return <p key={i}>{line}</p>;
            })}
          </div>
        </div>
      </article>
    </div>
  );
}
