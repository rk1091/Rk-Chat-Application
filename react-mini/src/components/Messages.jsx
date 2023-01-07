import React, { useContext } from "react";
import Message from "./Message";
import { ChatContext } from "../contextAPI/ChatContext";
const Messages = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className="messages">
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      {/* <Message />
      <Message />
      <Message />
      <Message /> */}
    </div>
  );
};

export default Messages;
