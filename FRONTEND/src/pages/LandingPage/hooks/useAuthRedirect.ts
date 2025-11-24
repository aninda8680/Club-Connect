import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      switch (role) {
        case "admin":
          navigate("/adminpanel", { replace: true });
          break;
        case "coordinator":
          navigate("/coordinatorpanel", { replace: true });
          break;
        case "leader":
          navigate("/leaderpanel", { replace: true });
          break;
        case "member":
          navigate("/memberpanel", { replace: true });
          break;
        default:
          navigate("/publicpanel", { replace: true });
      }
    }
  }, [navigate]);
}
