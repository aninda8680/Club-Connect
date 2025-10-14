import { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface GradualBlurProps {
  children: React.ReactNode;
  className?: string;
}

const GradualBlur = ({ children, className = '' }: GradualBlurProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { top, height } = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far through the section we've scrolled (0 to 1)
      const scrollProgress = Math.min(Math.max((windowHeight - top) / (windowHeight + height), 0), 1);
      
      // Apply blur based on scroll position
      const blurAmount = scrollProgress * 5; // Max 5px blur
      const opacity = Math.max(1 - scrollProgress * 0.3, 0.7); // Min 0.7 opacity
      
      container.style.setProperty('--blur-amount', `${blurAmount}px`);
      container.style.setProperty('--opacity', opacity.toString());
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <StyledContainer ref={containerRef} className={className}>
      <div className="blur-content">
        {children}
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  position: relative;
  
  .blur-content {
    filter: blur(var(--blur-amount, 0px));
    opacity: var(--opacity, 1);
    transition: filter 0.2s ease-out, opacity 0.2s ease-out;
  }
`;

export default GradualBlur;