import { useState, useEffect, useRef } from 'react';
import SplashScreen from './components/SplashScreen';
import Invitation from './components/Invitation';
import ParticleBackground from './components/ParticleBackground';
import CinematicRings from './components/CinematicRings';

function App() {
  const [isOpened, setIsOpened] = useState(false);
  const spotlightRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (spotlightRef.current) {
        // Creates a soft, glowing spotlight that follows the cursor
        spotlightRef.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(255,255,255,0.08), transparent 40%)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="app-container">
      {/* Global Interactive Spotlight overlay */}
      <div 
        ref={spotlightRef} 
        style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'screen'
        }} 
      />
      
      {!isOpened ? (
        <SplashScreen onOpen={() => setIsOpened(true)} />
      ) : (
        <>
          <ParticleBackground />
          <Invitation />
          <CinematicRings />
        </>
      )}
    </div>
  );
}

export default App;
