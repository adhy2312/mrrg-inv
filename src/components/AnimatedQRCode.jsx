import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import { MapPin } from 'lucide-react';

export default function AnimatedQRCode({ url }) {
  const qrRef = useRef(null);
  const containerRef = useRef(null);

  useGSAP(() => {
    // Add a subtle float animation to the QR code container
    gsap.to(containerRef.current, {
      y: -8,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

    // Make the QR code appear with an elegant, slow fade-in scale
    gsap.from(qrRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
      delay: 1.5 
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="qr-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div ref={qrRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Elegant Double-Frame around QR */}
        <div style={{ 
          padding: '12px', 
          border: '1px solid rgba(212, 175, 55, 0.5)', 
          outline: '1px solid rgba(212, 175, 55, 1)', 
          outlineOffset: '4px',
          background: '#ffffff',
          boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
          marginBottom: '1.8rem'
        }}>
          <QRCodeSVG 
            value={url} 
            size={140} 
            fgColor="#132448" 
            bgColor="#ffffff" 
            level="M" 
          />
        </div>

        {/* Premium Typography & Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <MapPin size={18} color="#d4af37" strokeWidth={1.5} />
          <span className="font-playfair" style={{ fontSize: '1rem', color: '#132448', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase' }}>
            Venue Map
          </span>
        </div>
        <span className="font-primary" style={{ fontSize: '1.2rem', color: '#132448', opacity: 0.8, fontStyle: 'italic' }}>
          Scan code for digital directions
        </span>
      </div>
    </div>
  );
}
