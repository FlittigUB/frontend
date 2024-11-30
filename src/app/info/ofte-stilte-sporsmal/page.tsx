import BeaverHero from '@/components/common/BeaverHero';
import FAQComponent from '@/components/FAQComponent';
import NavbarLayout from '@/components/NavbarLayout';

export default function FAQPage() {
  return (
    <NavbarLayout>
      <div className={'bg-background'}>
        <BeaverHero
          title={'Ofte stilte spørsmål'}
          subtitle={'For deg som ikke har alle svarene'}
        />
        <FAQComponent />
      </div>
    </NavbarLayout>
  );
}
