export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;

  category: 
    | "tech"
    | "hackathon"
    | "workshop"
    | "esports"
    | "cultural"
    | "seminar"
    | "competition"
    | "other";

  poster?: string;

  status: "pending" | "approved" | "rejected";

  // Engagement
  likes?: string[];        // array of userIds
  interested?: string[];   // array of userIds

  // Populated club info
  club?: {
    _id: string;
    name: string;
    logo?: string;
  };

  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };

  // Optional extra fields
  clubName?: string;
  clubLogo?: string;

  location?: string;
  maxAttendees?: number;
  attendees?: string[];
}
