export interface Club {
  _id: string;
  name: string;
  description: string;
  category?: string;
  coordinator: {
    _id: string;
    username: string;
    email: string;
  };
  members: string[];
  joinRequests: string[];
  createdAt: string;
}

export interface ClubCounts {
  memberCount: number;
}
