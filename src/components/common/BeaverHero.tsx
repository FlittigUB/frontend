import Image from 'next/image';

interface BeaverHeroProps {
  title: string;
  subtitle?: string;
  backgroundImageSrc?: string;
}

export default function BeaverHero({
                                     title,
                                     subtitle,
                                     backgroundImageSrc = process.env.NEXT_PUBLIC_ASSETS_URL +
                                     'ee98c673-387a-459e-928a-b3af3a2de051.png' || '',
                                   }: BeaverHeroProps) {
  return (
    <header className="relative flex h-[60vh] w-full">
      {/* Background Image */}
      <Image
        src={backgroundImageSrc}
        alt="Flittig UB Background"
        fill
        priority
        objectPosition="center"
        className="absolute inset-0 object-cover object-left md:object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0"></div>

      {/* Content */}
      <div className="z-10 flex flex-1 flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-extrabold text-gray-900 drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-2xl text-gray-800 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
