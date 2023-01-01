import React, { useContext } from "react";
import Add from "../img/add.jpeg";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../contextAPI/AuthContext";
const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="navbar">
      <span className="logo">Rk's Chat</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button
          onClick={() => {
            signOut(auth);
          }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
