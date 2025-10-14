import styled from 'styled-components';

interface DotGridProps {
  className?: string;
  dotColor?: string;
  dotSize?: number;
  gap?: number;
}

const DotGrid = ({
  className = '',
  dotColor = 'rgba(255, 255, 255, 0.2)',
  dotSize = 2,
  gap = 5
}: DotGridProps) => {
  return (
    <StyledDotGrid 
      className={className}
      style={{
        '--dot-color': dotColor,
        '--dot-size': `${dotSize}px`,
        '--dot-gap': `${gap}px`
      } as React.CSSProperties}
    />
  );
};

const StyledDotGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    var(--dot-color) var(--dot-size),
    transparent var(--dot-size)
  );
  background-size: var(--dot-gap) var(--dot-gap);
  mask-image: linear-gradient(to bottom, 
    transparent, 
    black 15%, 
    black 85%, 
    transparent
  );
  opacity: 0.5;
  pointer-events: none;
`;

export default DotGrid;