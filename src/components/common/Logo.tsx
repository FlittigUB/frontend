// components/Logo.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center flex-col">
        {/* Replace '/logo.png' with the path to your actual logo image */}
        <Image src="/FIB.png" alt="Logo" width={150} height={150} />
    </Link>
  );
};

export default Logo;
