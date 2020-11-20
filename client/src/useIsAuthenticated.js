import { useEffect, useState } from "react";
import api from "./api";

const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkIsAuthenticated = async () => {
      try {
        await api.isAuthenticated();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkIsAuthenticated();
  }, []);

  return {
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
  };
};

export default useIsAuthenticated;
