import React, { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';

type Segment = {
  href: string;
  name: string;
};

const BackButton: React.FC = () => {
  const router = useRouter();
  const pathName = usePathname();

  // Generate segment hrefs with labels
  const segmentHrefs = useMemo<Segment[]>(() => {
    const pathSegments = pathName.split('/').filter((segment) => segment);
    return pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const name = decodeURIComponent(segment)
        .replace(/-/g, ' ')
        .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize first letter
      return { href, name };
    });
  }, [pathName]);

  const handleButtonClick = () => {
    if (segmentHrefs.length > 1) {
      router.push(segmentHrefs[segmentHrefs.length - 2].href);
    } else {
      router.push('/portal'); // Fallback if no previous segments
    }
  };

  // Hide the button for specific paths
  if (pathName === '/portal/arbeidsgiver' || pathName === '/portal/arbeidstaker') {
    return null;
  }

  return (
    <div className="flex flex-row mb-2">
      <button
        className="flex flex-row items-center space-x-1 text-blue-600 hover:text-blue-700 transition duration-200"
        onClick={handleButtonClick}
        aria-label="Tilbake"
      >
        <IoIosArrowBack className="text-lg" />
        <span>
          {segmentHrefs.length > 1 &&
          segmentHrefs[segmentHrefs.length - 2].name.length <= 20
            ? segmentHrefs[segmentHrefs.length - 2].name
            : 'Tilbake'}
        </span>
      </button>
    </div>
  );
};

export default BackButton;
