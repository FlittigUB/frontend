// components/Logo.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center flex-col">
        <Image src="/FIB.png" alt="Logo" width={250} height={250} />
    </Link>
  );
};

export default Logo;
