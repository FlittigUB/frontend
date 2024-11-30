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
    <>
      <header className="relative flex h-[50vh] w-full">
        <Image
          src={backgroundImageSrc}
          alt="Flittig UB Logo"
          fill
          priority
          objectPosition="center"
          className="absolute inset-0 object-cover"
        />
        <div className="z-10 flex flex-1 flex-col items-center justify-center">
          <h1 className="text-center text-5xl font-bold text-foreground">
            {title}
          </h1>
          <p className="mt-4 text-center text-lg text-foreground">
            {subtitle || ''}
          </p>
        </div>
      </header>
    </>
  );
}
