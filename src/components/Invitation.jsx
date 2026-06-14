import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Clock, MapPin } from 'lucide-react';
import AnimatedQRCode from './AnimatedQRCode';

gsap.registerPlugin(ScrollTrigger);

export default function Invitation() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Initial fade in for the whole container
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: 'power2.inOut' });

    // 3D Bento ScrollTrigger animations
    const bentoBoxes = gsap.utils.toArray('.reveal-bento');
    bentoBoxes.forEach((box) => {
      gsap.fromTo(box,
        { 
          opacity: 0, 
          y: 80, 
          rotationX: 15, 
          rotationY: 5, 
          scale: 0.9, 
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: box,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Phase 2: Magnetic Liquid Glass Hover Physics
      const xTilt = gsap.quickTo(box, "rotationY", { duration: 0.5, ease: "power3" });
      const yTilt = gsap.quickTo(box, "rotationX", { duration: 0.5, ease: "power3" });
      
      const children = box.children;
      const xShift = gsap.quickTo(children, "x", { duration: 0.6, ease: "power3" });
      const yShift = gsap.quickTo(children, "y", { duration: 0.6, ease: "power3" });

      box.addEventListener('mousemove', (e) => {
        const rect = box.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Update CSS variables for Reactive Surface Lighting
        const xPosPx = e.clientX - rect.left;
        const yPosPx = e.clientY - rect.top;
        box.style.setProperty('--mouse-x', `${xPosPx}px`);
        box.style.setProperty('--mouse-y', `${yPosPx}px`);

        const xPos = (e.clientX - centerX) / (rect.width / 2);
        const yPos = (e.clientY - centerY) / (rect.height / 2);
        
        xTilt(xPos * 8); 
        yTilt(-yPos * 8);
        xShift(-xPos * 15); 
        yShift(-yPos * 15);
      });
      
      box.addEventListener('mouseleave', () => {
        xTilt(0);
        yTilt(0);
        xShift(0);
        yShift(0);
      });
    });

    // Phase 3: Ink Reveal Effect for Names
    gsap.utils.toArray('.ink-reveal').forEach((el) => {
      gsap.fromTo(el,
        { clipPath: 'polygon(-20% -20%, -20% -20%, -20% 120%, -20% 120%)' },
        {
          clipPath: 'polygon(-20% -20%, 120% -20%, 120% 120%, -20% 120%)',
          duration: 1.8,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Phase 3: Rolling Slot-Machine Effect for Details
    gsap.utils.toArray('.roll-text').forEach((el) => {
      gsap.fromTo(el,
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top 95%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

  }, { scope: containerRef });

  return (
    <div className="invitation-wrapper" ref={containerRef}>
      
      {/* Decorative Lavender Accents */}
      <div className="royal-border top-left"></div>
      <div className="royal-border top-right"></div>
      <div className="royal-border bottom-left"></div>
      <div className="royal-border bottom-right"></div>

      <section className="section" style={{ padding: '2rem 1rem' }}>
        <div className="bento-container">
          
          {/* Groom's Parent Box */}
          <div className="bento-box bento-header reveal-bento">
            <h3 className="font-inter text-royal-blue" style={{ fontSize: '1.4rem', fontWeight: 500, marginBottom: '0.5rem' }}>Mrs. Geetha V</h3>
            <p className="text-royal-blue" style={{ opacity: 0.9 }}>W/O late Mr. G venu</p>
            <p className="text-royal-blue" style={{ fontSize: '1rem', opacity: 0.8 }}>"Avni" Tc 48/905/1, Aramada, Thrikannapuram</p>
            
            <p className="font-inter text-royal-blue" style={{ marginTop: '2rem', fontSize: '1.2rem', lineHeight: '1.6' }}>
              Warmly invites you and your family<br />
              to the wedding reception of my son
            </p>
          </div>
          
          {/* Couple Box */}
          <div className="bento-box bento-couple reveal-bento">
            <div className="couple-names font-script text-royal-blue" style={{ fontSize: '6rem', margin: 0, lineHeight: 1 }}>
              <div className="ink-reveal" style={{ display: 'inline-block', padding: '0 20px' }}>Anoop</div>
              <div className="font-script text-royal-blue" style={{ fontSize: '3rem', margin: '-10px 0', opacity: 0.9 }}>with</div>
              <div className="ink-reveal" style={{ display: 'inline-block', padding: '0 20px' }}>Roshni</div>
            </div>
          </div>
          
          {/* Bride's Parents Box */}
          <div className="bento-box bento-bride-parents reveal-bento">
            <p className="font-inter text-royal-blue" style={{ fontSize: '1.1rem' }}>D/o Mr. Rameev T &amp; Mrs. Bindhu P</p>
            <p className="text-royal-blue" style={{ fontSize: '1rem', opacity: 0.8 }}>"Ever Green" Mandapathinkadavu, Kattakada</p>
          </div>

          {/* Event Details Box */}
          <div className="bento-box bento-details reveal-bento">
            <div className="details-list" style={{ marginTop: 0 }}>
              <div className="detail-row">
                <Calendar className="detail-icon" size={28} />
                <div style={{ overflow: 'hidden' }}>
                  <p className="font-inter text-royal-blue roll-text" style={{ fontSize: '1.1rem', margin: 0 }}>Wednesday, 8th July 2026</p>
                </div>
              </div>
              
              <div className="diamond-divider"><span></span>◇<span></span></div>

              <div className="detail-row">
                <Clock className="detail-icon" size={28} />
                <div style={{ overflow: 'hidden' }}>
                  <p className="font-inter text-royal-blue roll-text" style={{ fontSize: '1.1rem', margin: 0 }}>Between 5:00 pm to 9:00 pm</p>
                </div>
              </div>

              <div className="diamond-divider"><span></span>◇<span></span></div>

              <div className="detail-row">
                <MapPin className="detail-icon" size={28} />
                <div style={{ overflow: 'hidden' }}>
                  <p className="font-inter text-royal-blue roll-text" style={{ fontSize: '1.1rem', margin: 0 }}>Al Saj Convention Centre, Nemom</p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Box */}
          <div className="bento-box bento-qr reveal-bento">
            <AnimatedQRCode url="https://maps.google.com/?q=Al+Saj+Convention+Centre,+Nemom" />
          </div>

          {/* Footer Box */}
          <div className="bento-box bento-footer reveal-bento" style={{ padding: '3rem 2rem' }}>
            <p className="text-royal-blue" style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>With love and regards:<br/>Abhilash, Anu, Arjun &amp; Avni</p>
            <p className="text-royal-blue" style={{ fontSize: '1.1rem', marginTop: '1rem' }}>Ph: 7012506090</p>
            
            <p className="font-primary text-royal-blue" style={{ fontSize: '1.4rem', marginTop: '2rem', fontWeight: 600, letterSpacing: '1px' }}>
              Presents in blessings only
            </p>
          </div>

        </div>
        
        {/* Dedicated Rings Climax Space (Outside Bento Boxes) */}
        <div style={{ height: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 10 }}>
           <h1 className="font-script text-royal-blue" style={{ fontSize: '8rem', margin: 0, textShadow: '0 10px 30px rgba(255,255,255,0.8)' }}>A & R</h1>
           <p className="font-primary text-royal-blue" style={{ letterSpacing: '4px', fontSize: '1.2rem', marginTop: '1rem', fontWeight: 600 }}>08 . 07 . 2026</p>
        </div>
        
      </section>
    </div>
  );
}
