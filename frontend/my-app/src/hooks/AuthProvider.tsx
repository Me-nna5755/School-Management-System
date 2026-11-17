import { createContext, useState, useEffect, useContext } from "react";
import { api } from "@/lib/api";
import type { academicYear, user } from "@/types";

interface AuthContextType {
  user: user | null;
  setUser: React.Dispatch<React.SetStateAction<user | null>>;
  loading: boolean;
  year: academicYear | null;
  yearLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  year: null,
  yearLoading: false,
});

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<user | null>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState<academicYear | null>(null);
  const [yearLoading, setYearLoading] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await api.get("/user/profile");
        setUser(data.user);
      } catch (error) {
        console.log("Authentication Error:", error);
        setUser(null);
        setYear(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchCurrentYear = async () => {
      if (!user || (user.role !== "admin" && user.role !== "teacher")) {
        setYear(null);
        setYearLoading(false);
        return;
      }

      try {
        setYearLoading(true);

        const { data } = await api.get(
          "/academic-years/getCurrentAdemicYear"
        );

        if (!cancelled) {
          setYear(data);
        }
      } catch (error) {
        console.log("Academic Year Error:", error);

        if (!cancelled) {
          setYear(null);
        }
      } finally {
        if (!cancelled) {
          setYearLoading(false);
        }
      }
    };

    fetchCurrentYear();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        year,
        yearLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
