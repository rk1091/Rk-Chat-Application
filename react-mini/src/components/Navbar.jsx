import React from "react";
import Add from "../img/add.jpeg";
const Navbar = () => {
  return (
    <div className="navbar">
      <span className="logo">Rk's Chat</span>
      <div className="user">
        <img src={Add} alt="" />
        <span>John</span>
        {/* <button onClick={()=> {SignOut()}}>Logout</button> */}
      </div>
    </div>
  );
};

export default Navbar;
