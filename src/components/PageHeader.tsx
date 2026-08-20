import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  image?: string;
}

export function PageHeader({ title, subtitle, breadcrumbs, image }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-wood-800">
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-wood-900/50" />
        </div>
      )}
      <div className="container-app relative py-16 md:py-24">
        {breadcrumbs && (
          <nav className="mb-4 flex items-center gap-2 text-xs text-wood-200">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {crumb.to ? (
                  <Link to={crumb.to} className="transition-colors hover:text-wood-50">
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <span className="text-wood-400">/</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-serif text-4xl font-semibold text-wood-50 md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-base text-wood-200">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
