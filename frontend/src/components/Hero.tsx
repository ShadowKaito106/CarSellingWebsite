import Image from 'next/image';
import CustomButton from './CustomButton';

const Hero = () => {
  return (
    <div className="hero">
      <div className="flex-1 pt-36 padding-x">
        <h1 className="hero__title">
          Find, book, or rent a vehicle — quickly and easily!
        </h1>

        <p className="hero__subtitle">
          Streamline your vehicle rental experience with our effortless booking process.
        </p>

        <CustomButton
          title="Explore Vehicles"
          containerStyles="bg-primary-blue text-white rounded-full mt-10"
          onClick={() => {
            const element = document.getElementById('discover');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>
      <div className="hero__image-container">
        <div className="hero__image">
          <Image
            src="/hero.png"
            alt="hero"
            fill
            className="object-contain object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            priority
            quality={100}
          />
        </div>

        <div className="hero__image-overlay" />
      </div>
    </div>
  );
};

export default Hero; 