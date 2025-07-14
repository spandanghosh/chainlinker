import { createContext, useContext, useState } from "react";

// Create UserContext
const UserContext = createContext({
  user: {
    uuid: "",
    twitterId: "",
    walletAddress: "",
  },
  //   setUser: (user: { uuid: string; twitterId: string; walletAddress: string }) => {}
  userLogin: (user: { uuid: string; walletAddress: string }) => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState({
    uuid: "",
    twitterId: "",
    walletAddress: "",
  });

  const userLogin = async (user: { uuid: string; walletAddress: string }) => {
    try {
      const response = await fetch("http://localhost:8000/loginUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      console.log("Data:", data);

      if (response.ok) {
        console.log("Login successful:", data.user);
        setUser(data.user);
        return data.user; // Return user data for further use
      } else {
        console.error("Login failed:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Error logging in:", error);
      return null;
    }
  };

  return (
    <UserContext.Provider value={{ user, userLogin }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the context
export const useUser = () => {
  return useContext(UserContext);
};
