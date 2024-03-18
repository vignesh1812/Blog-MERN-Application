import { createContext, useEffect, useState } from "react";
export const UserContext = createContext();
const UserProvider = ({ children }) => {
  const [currentUser, SetcurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  useEffect(()=>{
    localStorage.setItem('user',JSON.stringify(currentUser))
  },[currentUser])
  return (
    <UserContext.Provider value={{currentUser, SetcurrentUser}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider