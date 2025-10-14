// src/utils/getBaseUrl.ts
export const getBaseUrl = () => {
  const isLocal = window.location.hostname === "localhost";
  return isLocal
    ? "http://localhost:5000"
    : "https://club-connect-p2o2.onrender.com";
};
