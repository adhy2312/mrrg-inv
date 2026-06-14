import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';

function DustBurst({ active }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!active) return;
    const particles = containerRef.current.children;
    gsap.fromTo(particles, 
      { x: 160, y: 110, scale: 0, opacity: 1 },
      {
        x: () => 160 + (Math.random() - 0.5) * 400,
        y: () => 110 + (Math.random() - 0.2) * 300, // burst mostly downwards/outwards
        scale: () => Math.random() * 3 + 0.5,
        opacity: 0,
        duration: () => Math.random() * 1.5 + 0.5,
        ease: "power2.out",
        stagger: 0.005
      }
    );
  }, [active]);

  return (
    <g ref={containerRef}>
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} r="2.5" fill="#ffd700" opacity="0" filter="url(#drop-shadow)" />
      ))}
    </g>
  );
}

export default function SplashScreen({ onOpen }) {
  const containerRef = useRef(null);
  const cardWrapperRef = useRef(null);
  const flapRef = useRef(null);
  const threadLeftRef = useRef(null);
  const threadRightRef = useRef(null);
  const threadWrap1Ref = useRef(null);
  const threadWrap2Ref = useRef(null);
  const knotRef = useRef(null);
  const textRef = useRef(null);
  
  const premiumCardRef = useRef(null);
  const envelopeFrontRef = useRef(null);
  const envelopeBackRef = useRef(null);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasSnapped, setHasSnapped] = useState(false);
  
  const startY = useRef(0);

  useEffect(() => {
    // Initial entrance: fade in container
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: 'power2.inOut' });
    
    // Smooth, premium float animation for the envelope
    gsap.to(cardWrapperRef.current, {
      y: -6,
      rotationX: 2,
      rotationY: -1,
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

    gsap.fromTo(textRef.current, 
      { opacity: 0, y: 10, letterSpacing: '2px' }, 
      { opacity: 0.8, y: 0, letterSpacing: '4px', duration: 1.5, ease: 'power2.out', delay: 1 }
    );
  }, []);

  // Update SVG paths dynamically based on drag
  useEffect(() => {
    if (!threadLeftRef.current || !threadRightRef.current || hasSnapped) return;
    
    // The deeper you pull, the tighter the thread gets
    const tensionL = 115 + dragY * 0.3;
    const tensionR = 105 + dragY * 0.3;
    const knotY = 110 + dragY;

    threadLeftRef.current.setAttribute('d', `M -10,110 Q 75,${tensionL} 160,${knotY}`);
    threadRightRef.current.setAttribute('d', `M 160,${knotY} Q 245,${tensionR} 330,110`);
    knotRef.current.setAttribute('transform', `translate(0, ${dragY})`);
  }, [dragY, hasSnapped]);

  const triggerOpenSequence = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setHasSnapped(true);

    const tl = gsap.timeline();

    // 1. Thread violently snaps
    tl.to(knotRef.current, { scale: 0, opacity: 0, duration: 0.2, ease: 'back.in(1.5)', transformOrigin: 'center center' }, 0);
    
    tl.to(threadLeftRef.current, { strokeDashoffset: 400, opacity: 0, duration: 0.6, ease: 'power3.in' }, 0);
    tl.to(threadRightRef.current, { strokeDashoffset: -400, opacity: 0, duration: 0.6, ease: 'power3.in' }, 0);
    
    tl.to([threadWrap1Ref.current, threadWrap2Ref.current], { opacity: 0, scaleX: 1.1, duration: 0.4, ease: 'power2.out', transformOrigin: 'center' }, 0.1);

    tl.to(textRef.current, { opacity: 0, duration: 0.3 }, 0);

    // 2. Flap opens with a premium slow ease
    tl.to(flapRef.current, {
      rotateX: 180,
      duration: 1.2,
      ease: 'power3.inOut'
    }, 0.4);

    // 3. Premium Extraction Animation
    tl.to([envelopeFrontRef.current, envelopeBackRef.current, flapRef.current], {
      y: 150, // drop further down
      rotationZ: () => (Math.random() - 0.5) * 10, // slight realistic tilt
      opacity: 0,
      duration: 1.6,
      ease: 'power2.in'
    }, 1.2);

    // The beautiful card slides UP and scales into view
    tl.to(premiumCardRef.current, {
      y: -80,
      scale: 1.2,
      duration: 1.6,
      ease: 'power3.out',
      boxShadow: '0 30px 60px rgba(0,0,0,0.3)'
    }, 1.1);

    // 4. Background flash and transition
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: onOpen
    }, 2.5);
  }, [isAnimating, onOpen]);

  // Pointer Event Handlers for Dragging
  const handlePointerDown = (e) => {
    if (isAnimating || hasSnapped) return;
    setIsDragging(true);
    startY.current = e.clientY;
    
    // Change text immediately to provide feedback
    if (textRef.current) {
      textRef.current.innerText = "Pull down to break seal";
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging || isAnimating || hasSnapped) return;
    
    const deltaY = e.clientY - startY.current;
    
    // Only allow pulling down, add resistance
    if (deltaY > 0) {
      // Exponential resistance so it gets harder to pull
      const resistanceY = Math.pow(deltaY, 0.85); 
      setDragY(resistanceY);
      
      // If pulled past threshold, SNAP!
      if (resistanceY > 60) {
        setIsDragging(false);
        triggerOpenSequence();
      }
    }
  };

  const handlePointerUp = () => {
    if (!isDragging || isAnimating || hasSnapped) return;
    setIsDragging(false);
    
    // Snap back if not pulled far enough
    gsap.to({ val: dragY }, {
      val: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
      onUpdate: function() {
        setDragY(this.targets()[0].val);
      }
    });
    
    if (textRef.current) {
      textRef.current.innerText = "Swipe down to break the seal";
    }
  };

  return (
    <div 
      ref={containerRef}
      className="full-screen splash-screen"
      onClick={triggerOpenSequence}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: 'none', cursor: 'pointer' }} // prevent scrolling while dragging
    >
      <div className="card-wrapper" ref={cardWrapperRef}>
        
        {/* Envelope Back */}
        <div className="envelope-back" ref={envelopeBackRef}></div>
        <div className="envelope-inside"></div>
        
        {/* The Premium Card inside the envelope */}
        <div className="premium-card-container">
           <div className="premium-card" ref={premiumCardRef}>
             <div className="premium-card-border"></div>
             <div className="premium-card-text">Invitation</div>
           </div>
        </div>
        
        {/* The top flap that opens */}
        <div className="envelope-flap" ref={flapRef}>
          <svg viewBox="0 0 320 180" className="flap-svg">
            <polygon points="0,0 320,0 160,110" fill="#fcfaf8" stroke="#d4af37" strokeWidth="2" />
            <polygon points="12,6 308,6 160,102" fill="none" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1" />
          </svg>
        </div>

        {/* Envelope Front */}
        <div className="envelope-front" ref={envelopeFrontRef}>
          <svg viewBox="0 0 320 220" className="front-svg">
            <polygon points="0,220 320,220 320,0 160,110 0,0" fill="#f3efeb" stroke="#d4af37" strokeWidth="1.5" />
            <polygon points="0,220 160,110 0,0" fill="#ede8e3" />
            <polygon points="320,220 160,110 320,0" fill="#e8e2dc" />
            <polygon points="10,210 150,115 10,15" fill="none" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="1" />
            <polygon points="310,210 170,115 310,15" fill="none" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="1" />
          </svg>
        </div>
        
        <svg 
          className="thread-container" 
          viewBox="0 0 320 220"
          onPointerDown={handlePointerDown}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <defs>
            <linearGradient id="threadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b8860b" />
              <stop offset="50%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#b8860b" />
            </linearGradient>
            <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
            </filter>
            <radialGradient id="knotGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffe58f" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#997a00" />
            </radialGradient>
          </defs>

          {/* Background Wraps */}
          <path ref={threadWrap1Ref} className="thread-line" d="M -10,85 Q 160,95 330,85" opacity="0.7" strokeWidth="2.5" />
          <path ref={threadWrap2Ref} className="thread-line" d="M -10,135 Q 160,125 330,135" opacity="0.7" strokeWidth="2.5" />

          {/* Golden Dust Burst */}
          <DustBurst active={hasSnapped} />

          {/* Main front threads that unravel */}
          <path 
            ref={threadLeftRef}
            className="thread-line main-thread" 
            d="M -10,110 Q 75,115 160,110" 
            strokeDasharray="400"
            strokeDashoffset="0"
          />
          <path 
            ref={threadRightRef}
            className="thread-line main-thread" 
            d="M 160,110 Q 245,105 330,110" 
            strokeDasharray="400"
            strokeDashoffset="0"
          />
          
          {/* Decorative Knot / Seal */}
          <g 
            ref={knotRef} 
            className="knot-group" 
            filter="url(#drop-shadow)" 
            style={{ transformOrigin: '160px 110px', cursor: 'pointer' }}
            onClick={triggerOpenSequence}
          >
            {/* Extended invisible hit area for easier dragging on mobile */}
            <circle cx="160" cy="110" r="40" fill="transparent" />
            <circle cx="160" cy="110" r="18" fill="url(#knotGrad)" />
            {/* Tassels */}
            <path d="M 155,110 Q 140,140 135,130 Q 150,105 155,110" fill="url(#knotGrad)" />
            <path d="M 165,110 Q 180,140 185,130 Q 170,105 165,110" fill="url(#knotGrad)" />
            <text x="160" y="115" fontFamily="Cinzel" fontSize="11" fill="#fff" textAnchor="middle" fontWeight="bold" style={{textShadow: '0 1px 2px rgba(0,0,0,0.3)', pointerEvents: 'none'}}>R&amp;A</text>
          </g>
        </svg>
      </div>

      <div ref={textRef} className="splash-instruction font-cinzel">
        Tap or Swipe down to break the seal
      </div>
    </div>
  );
}
