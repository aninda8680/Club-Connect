// src/components/ClubCard.tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ClubCardProps = {
  _id: string;
  name: string;
  description: string;
  coordinator?: string;
  logo?: string;
  onView?: (id: string) => void;
  isHovered?: boolean;
};

export default function ClubCard({ 
  _id, 
  name, 
  description, 
  coordinator, 
  logo, 
  onView, 
  isHovered = false 
}: ClubCardProps) {
  return (
    <Card 
      className={`
        w-full max-w-sm rounded-2xl p-6 transition-all duration-500 ease-in-out transform
        bg-gradient-to-br from-[#0D0E20] to-[#2D1C7F] 
        border border-[#2D1C7F]/30
        hover:border-[#7546E8] hover:scale-105 hover:shadow-2xl
        hover:shadow-[#7546E8]/20
        ${isHovered ? 'scale-105 border-[#7546E8] shadow-2xl shadow-[#7546E8]/20' : ''}
      `}
    >
      <CardHeader className="flex flex-col items-center gap-4 pb-4">
        {logo ? (
          <div className="relative">
            <img 
              src={logo} 
              alt={name} 
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#7546E8]/50" 
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#7546E8]/20 to-transparent"></div>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7546E8] to-[#C8B3F6] flex items-center justify-center text-2xl font-bold text-[#0D0E20] ring-2 ring-[#B0A9E5]/50">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <CardTitle className="text-xl font-semibold text-[#C8B3F6] text-center leading-tight">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-[#B0A9E5] leading-relaxed line-clamp-3">
          {description}
        </p>
        {coordinator && (
          <div className="bg-[#2D1C7F]/40 rounded-lg p-3 border border-[#7546E8]/20">
            <p className="text-xs text-[#B0A9E5]/80 mb-1">
              Coordinator
            </p>
            <p className="text-sm font-medium text-[#C8B3F6]">
              {coordinator}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          className="w-full bg-gradient-to-r from-[#7546E8] to-[#C8B3F6] hover:from-[#C8B3F6] hover:to-[#7546E8] text-[#0D0E20] font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#7546E8]/30 border-none"
          onClick={() => onView && onView(_id)}
        >
          <span className="flex items-center gap-2">
            View Club
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </span>
        </Button>
      </CardFooter>
      
      {/* Subtle animated border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#7546E8]/0 via-[#7546E8]/20 to-[#C8B3F6]/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </Card>
  );
}