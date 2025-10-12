import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ScrollFadeWrapperProps {
  children: React.ReactNode;
  fadeStart?: number;
  fadeDistance?: number;
  fadeTo?: number;
  className?: string;
}

export default function ScrollFadeWrapper({ 
  children, 
  fadeStart = 80,
  fadeDistance = 120,
  fadeTo = 0.3,
  className = ""
}: ScrollFadeWrapperProps) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      if (scrollY <= fadeStart) {
        setOpacity(1);
      } else if (scrollY >= fadeStart + fadeDistance) {
        setOpacity(fadeTo);
      } else {
        // Linear interpolation between 1 and fadeTo
        const progress = (scrollY - fadeStart) / fadeDistance;
        const newOpacity = 1 - progress * (1 - fadeTo);
        setOpacity(newOpacity);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Set initial opacity
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fadeStart, fadeDistance, fadeTo]);

  return (
    <motion.div
      style={{ opacity }}
      transition={{ duration: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}