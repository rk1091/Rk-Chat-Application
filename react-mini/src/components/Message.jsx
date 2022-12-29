import React from "react";
import Add from "../img/add.jpeg";
const Message = () => {
  return (
    <div className="message">
      <div className="messageInfo">
        <img src={Add} alt="" />
        <span>just now</span>
      </div>
      <div className="messageContent"></div>
      <p>hello</p>
      <img src={Add} alt="" />
    </div>
  );
};

export default Message;
