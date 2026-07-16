import React, { useContext, useEffect, useState } from "react";
import Message from "./Message";
import { ChatContext } from "../contextAPI/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
const Messages = () => {
  const [messages, setMessages] = useState([]);
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
}, [data.chatId]);
  // useEffect(() => {
  //   const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
  //     doc.exists() && setMessages(doc.data().messages);
  //   });
  //   return () => {
  //     unSub();
  //   };
  // }, [data.chatId]);
  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
