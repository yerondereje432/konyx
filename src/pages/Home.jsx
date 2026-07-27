import Hero from '../components/Hero';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import Packages from '../components/Packages';
import Process from '../components/Process';
import Testimonials from '../components/Testimonials';
import WhyChooseUs from '../components/WhyChooseUs';

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <Services />
      <Gallery />
      <Packages />
      <Process />
      <Testimonials />
    </>
  );
}
