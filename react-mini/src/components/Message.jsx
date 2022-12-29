import React from "react";
import Add from "../img/add.jpeg";
const Message = () => {
  return (
    <div className="message owner">
      <div className="messageInfo">
        <img src={Add} alt="" />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>hello</p>
        <img src={Add} alt="" />
      </div>
    </div>
  );
};

export default Message;
