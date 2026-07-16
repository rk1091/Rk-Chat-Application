import React, { useContext, useEffect, useState } from "react";
import Message from "./Message";
import { AuthContext } from "../contextAPI/AuthContext";
import { ChatContext } from "../contextAPI/ChatContext";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (docSnap) => {
      if (docSnap.exists()) {
        const msgs = docSnap.data().messages;
        setMessages(msgs);

        const updated = msgs.map((m) =>
          m.senderId !== currentUser.uid ? { ...m, seen: true } : m
        );
        updateDoc(doc(db, "chats", data.chatId), { messages: updated });
      }
    });
    return () => unSub();
  }, [data.chatId, currentUser.uid]);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;