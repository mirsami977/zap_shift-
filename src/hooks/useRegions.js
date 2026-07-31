import { useEffect, useState } from "react";
import { api } from "../api/client";

export const useRegions = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/warehouses/regions")
      .then(({ data }) => setRegions(data))
      .catch(() => setRegions([]))
      .finally(() => setLoading(false));
  }, []);

  return { regions, loading };
};
