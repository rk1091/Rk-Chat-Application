import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../contextAPI/AuthContext";
import { ChatContext } from "../contextAPI/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const formattedTime = message.date?.toDate
    ? message.date.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>{formattedTime}</span>
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="" />}

        {message.file && message.file.type?.startsWith("audio/") && (
          <audio controls src={message.file.url} className="audioMessage" />
        )}

        {message.file && !message.file.type?.startsWith("audio/") && (
          <a href={message.file.url} target="_blank" rel="noreferrer" className="fileMessage">
            📎 {message.file.name} ({message.file.size})
          </a>
        )}

        {message.senderId === currentUser.uid && message.seen && (
          <span className="seenLabel">Seen</span>
        )}
      </div>
    </div>
  );
};

export default Message;