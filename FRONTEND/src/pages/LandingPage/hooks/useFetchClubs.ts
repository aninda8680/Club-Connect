import { useEffect, useState } from "react";
import api from "@/api";
import type { Club, ClubCounts } from "../types/club";
import { toast } from "react-hot-toast";

export default function useFetchClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [clubCounts, setClubCounts] = useState<Map<string, ClubCounts>>(new Map());

  const fetchClubs = async (): Promise<Club[]> => {
    try {
      const response = await api.get("/clubs");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error fetching clubs");
      return [];
    }
  };

  const fetchClubCounts = (clubsData: Club[]) => {
    const countsMap = new Map<string, ClubCounts>();
    clubsData.forEach(club => {
      countsMap.set(club._id, { memberCount: club.members.length });
    });
    return countsMap;
  };

  useEffect(() => {
    const load = async () => {
      const data = await fetchClubs();
      setClubs(data);
      setClubCounts(fetchClubCounts(data));
    };

    load();
  }, []);

  return { clubs, clubCounts };
}
