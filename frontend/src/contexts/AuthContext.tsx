import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "@/config/localstorage.config.ts";
import { ILoginRequest, IUser, UserData } from "@/data-types/user.types.ts";
import api from "@/config/axios.config.ts";
import createToast from "@/config/toast.config.ts";

interface AuthContextProps {
  currentUser: IUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (credentials: ILoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = getLocalStorage();
    if (userData) {
      setCurrentUser(userData.user);
      setAccessToken(userData.token);
    }
  }, []);

  const login = async (credentials: ILoginRequest) => {
    try {
      setLoading(true);
      const response: any = await api.post("/auth/login", credentials);
      setLoading(false);

      if (response?.data?.success) {
        const valuesToSave: UserData = {
          user: response.data.result.user,
          token: response.data.result.token,
        };
        setCurrentUser(response.data?.result.user);
        setAccessToken(response.data?.result.token);
        setLocalStorage(valuesToSave);

        navigate("/");
      } else {
        createToast(
          response.body.message || "Login failed. Please try again.",
          "error",
        );
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";

      createToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setCurrentUser(null);
    removeLocalStorage();
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, accessToken, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
