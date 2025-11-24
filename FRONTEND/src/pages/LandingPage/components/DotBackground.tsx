import React from "react";
import DotGrid from "../../../components/DotGrid";

interface Props {
  dotColor?: string;
  dotSize?: number;
  gap?: number;
}

const DotBackground: React.FC<Props> = ({ dotColor, dotSize, gap }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <DotGrid dotColor={dotColor} dotSize={dotSize} gap={gap} />
    </div>
  );
};

export default DotBackground;
