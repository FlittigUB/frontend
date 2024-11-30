import BeaverHero from '@/components/common/BeaverHero';
import FAQComponent from '@/components/FAQComponent';

export default function FAQPage() {
  return (
    <div className={'bg-background'}>
      <BeaverHero
        title={'Ofte stilte spørsmål'}
        subtitle={'For deg som ikke har alle svarene'}
      />
      <FAQComponent />
    </div>
  );
}
