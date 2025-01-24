import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Breadcrumb = {
  href: string;
  label: string;
};

const generateBreadcrumbs = (pathname: string): Breadcrumb[] => {
  const pathSegments = pathname.split('/').filter((segment) => segment);
  return pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    let label = decodeURIComponent(segment).replace(/-/g, ' ');
    if (label.includes(' ')) {
      label = label.split(' ')[0];
    }
    return { href, label };
  });
};

const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();

  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <nav aria-label="breadcrumbs" className="breadcrumbs mt-4 ml-8">
      <ul className="flex items-center text-sm space-x-2">
        <li>
          <Link href="/" className="text-yellow-500 hover:text-yellow-600 font-semibold">
            Forside
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.href}>
            <li className="text-gray-300 mx-1">/</li>
            <li>
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-500 font-medium">{breadcrumb.label}</span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className="text-blue-600 hover:text-blue-700 transition duration-200"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
