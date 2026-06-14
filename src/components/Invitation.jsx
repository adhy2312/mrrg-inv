import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Clock, MapPin, Check } from 'lucide-react';
import AnimatedQRCode from './AnimatedQRCode';

gsap.registerPlugin(ScrollTrigger);

export default function Invitation() {
  const containerRef = useRef(null);
  const dateRef = useRef(null);
  const checkRef = useRef(null);
  const btnRef = useRef(null);
  const [isSaved, setIsSaved] = useState(false);

  // Dynamic Gold Foil Shimmer Logic (Gyroscope & Mouse)
  useEffect(() => {
    const handleOrientation = (e) => {
      const gamma = e.gamma || 0; 
      const beta = e.beta || 0; 

      const foilX = 50 + (gamma / 90) * 50; 
      const foilAngle = 45 + (beta / 90) * 45; 
      
      document.documentElement.style.setProperty('--foil-pos', `${foilX}%`);
      document.documentElement.style.setProperty('--foil-angle', `${foilAngle}deg`);
    };

    const handleMouseMove = (e) => {
      const xPos = e.clientX / window.innerWidth;
      const yPos = e.clientY / window.innerHeight;
      
      document.documentElement.style.setProperty('--foil-pos', `${xPos * 100}%`);
      document.documentElement.style.setProperty('--foil-angle', `${45 + (yPos * 45)}deg`);
    };

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSaveDate = () => {
    if (isSaved) return;
    setIsSaved(true);

    // 1. Generate ICS File
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Anoop&Roshni//Wedding//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Wedding Reception: Anoop & Roshni
DTSTART;TZID=Asia/Kolkata:20260708T170000
DTEND;TZID=Asia/Kolkata:20260708T210000
LOCATION:Al Saj Convention Centre, Nemom
DESCRIPTION:Join us to celebrate the wedding reception of Anoop & Roshni.
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT1440M
ACTION:DISPLAY
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Anoop_Roshni_Wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 2. Animate Date to Checkmark
    const tl = gsap.timeline();
    tl.to(btnRef.current, { y: 20, opacity: 0, duration: 0.4, ease: "power2.in" });
    tl.to(dateRef.current, { scale: 0, opacity: 0, rotation: 180, duration: 0.6, ease: "back.in(1.7)" }, "-=0.2");
    tl.to(checkRef.current, { scale: 1.5, opacity: 1, rotation: 360, duration: 0.6, ease: "back.out(1.7)" });
    
    // 3. Reset after 3 seconds
    tl.to(checkRef.current, { scale: 0, opacity: 0, duration: 0.4, delay: 2.5 });
    tl.to(dateRef.current, { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" });
    tl.to(btnRef.current, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", onComplete: () => setIsSaved(false) });
  };

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

      let boxWidth = 0;
      let boxHeight = 0;
      let boxPageLeft = 0;
      let boxPageTop = 0;

      // Cache layout coordinates on mouse enter to eliminate layout thrashing
      box.addEventListener('mouseenter', () => {
        const rect = box.getBoundingClientRect();
        boxWidth = rect.width;
        boxHeight = rect.height;
        boxPageLeft = rect.left + window.scrollX;
        boxPageTop = rect.top + window.scrollY;
      });

      box.addEventListener('mousemove', (e) => {
        // Only run hover physics on non-touch devices
        if (!window.matchMedia("(pointer: fine)").matches) return;
        if (boxWidth === 0) return; // Guard until mouseenter caches

        // Use document-relative coordinates to prevent layout recalculation triggers
        const xPosPx = e.pageX - boxPageLeft;
        const yPosPx = e.pageY - boxPageTop;
        
        box.style.setProperty('--mouse-x', `${xPosPx}px`);
        box.style.setProperty('--mouse-y', `${yPosPx}px`);

        const centerX = boxWidth / 2;
        const centerY = boxHeight / 2;
        const xPos = (xPosPx - centerX) / centerX;
        const yPos = (yPosPx - centerY) / centerY;
        
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
        
        {/* Majestic Page Heading */}
        <div className="reveal-bento" style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '180px', position: 'relative', zIndex: 10 }}>
          <p className="font-script text-gold" style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', margin: 0, opacity: 0.9 }}>
            Join us to celebrate the
          </p>
          <h2 className="font-cinzel text-royal-blue" style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)', fontWeight: 600, letterSpacing: '8px', textTransform: 'uppercase', margin: '0.5rem 0 0 0', textShadow: '0 2px 15px rgba(255,255,255,0.8)' }}>
            Wedding Reception
          </h2>
          <div className="ornate-divider" style={{ marginTop: '1.5rem', marginBottom: 0, opacity: 0.7 }}></div>
        </div>

        <div className="bento-container" style={{ paddingTop: '0' }}>
          
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
            <div className="couple-names font-script text-royal-blue" style={{ fontSize: 'clamp(3.5rem, 12vw, 6rem)', margin: 0, lineHeight: 1 }}>
              <div className="ink-reveal" style={{ display: 'inline-block', padding: '0 20px' }}>Anoop</div>
              <div className="font-script text-royal-blue" style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', margin: '-10px 0', opacity: 0.9 }}>with</div>
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
        <div style={{ height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 10, padding: '0 1rem' }}>
           <h1 className="font-script gold-foil-text" style={{ fontSize: 'clamp(4.5rem, 18vw, 8rem)', margin: 0 }}>A & R</h1>
           
           {/* Date and Checkmark Container */}
           <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px', marginTop: '1rem' }}>
             <p ref={dateRef} className="font-primary text-royal-blue" style={{ letterSpacing: '4px', fontSize: '1.2rem', margin: 0, fontWeight: 600 }}>08 . 07 . 2026</p>
             <div ref={checkRef} style={{ position: 'absolute', opacity: 0, transform: 'scale(0)' }}>
               <Check color="#132448" size={36} strokeWidth={2.5} />
             </div>
           </div>

           {/* Save Date Button */}
           <button 
             ref={btnRef}
             onClick={handleSaveDate}
             className="save-date-btn font-playfair"
           >
             Save the Date
           </button>
        </div>
        
      </section>
    </div>
  );
}
