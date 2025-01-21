import { getUserHeadData } from "@/lib/actions/users/getUsersProfile";
import { expRequired } from "@/lib/LevelManaging";
import { UserHead } from "@/types/userstype";
import { createContext, ReactNode, useEffect, useState } from "react";

type UserContextType = {
  user: UserHead;
  maxExp: number;
  setUser: React.Dispatch<React.SetStateAction<UserHead | null>>
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserHead | null>(null);
  const [maxExp, setMaxExp] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getUserHeadData();
        setUser(result as UserHead);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchMaxExp = async () => {
      if (user && typeof user.level === "number") {
        try {
          const exp = await expRequired(user.level);
          setMaxExp(exp);
        } catch (error) {
          console.error("Failed to calculate max experience:", error);
        }
      }
    };
    fetchMaxExp();
  }, [user]);

  const contextValue: UserContextType = {
    user: user as UserHead,
    maxExp: maxExp as number,
    setUser: setUser
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
