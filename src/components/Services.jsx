import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedText from './AnimatedText';

const services = [
  {
    title: 'Wedding Decoration',
    desc: 'Bespoke floral arrangements, stage design, and lighting to make your special day unforgettable.',
    img: '/service-1.jpg'
  },
  {
    title: 'Corporate Events',
    desc: 'Professional styling for galas, product launches, and company milestones that reflect your brand.',
    img: '/service-2.jpg'
  },
  {
    title: 'Birthday & Social',
    desc: 'Themed decor, balloon installations, and custom backdrops for intimate and grand celebrations.',
    img: '/service-3.jpg'
  }
];

const ServiceCard = ({ srv, idx }) => {
  const ref = useRef(null);
  // Create a scroll-linked parallax effect
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Move the image slightly as the user scrolls
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <Link to={`/quote?service=${encodeURIComponent(srv.title)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <motion.div 
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: idx * 0.15 }}
        style={{ cursor: 'none' }} // Replaced by custom cursor
        className="service-card"
      >
        <div style={{ overflow: 'hidden', marginBottom: '1.5rem', borderRadius: '4px', height: '400px', position: 'relative' }}>
          <motion.img 
            src={srv.img} 
            alt={srv.title} 
            style={{ 
              width: '100%', 
              height: '130%', // Taller to allow parallax movement
              objectFit: 'cover',
              y: y,
              transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }} 
            className="service-img"
          />
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>{srv.title}</h3>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>{srv.desc}</p>
      </motion.div>
    </Link>
  );
};

export default function Services() {
  return (
    <section id="services" className="section-padding" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="section-subtitle">What We Do</span>
          <AnimatedText text="Our Signature Services" className="heading-secondary" style={{ overflow: 'hidden' }} />
        </div>

        <div className="grid grid-cols-3" style={{ gap: '3rem' }}>
          {services.map((srv, idx) => (
            <ServiceCard key={idx} srv={srv} idx={idx} />
          ))}
        </div>
      </div>
      <style>{`
        .service-card:hover .service-img {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}
