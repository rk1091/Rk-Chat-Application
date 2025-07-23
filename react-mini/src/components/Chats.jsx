import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../contextAPI/AuthContext";
import { ChatContext } from "../contextAPI/ChatContext";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  // console.log(Object.entries(chats));

  const handleSelect = async (userInfo) => {
    dispatch({ type: "CHANGE_USER", payload: userInfo });
    console.log("currentUser.uid", currentUser.uid);
    console.log("userInfo.uid", userInfo.uid);
    
    
    const chatId =
    currentUser.uid > userInfo.uid
      ? currentUser.uid + userInfo.uid
      : userInfo.uid + currentUser.uid;

  // Reset unread count for current user
  await updateDoc(doc(db, "userChats", currentUser.uid), {
    [chatId + ".unreadCount"]: 0,
  });
  };

  const chatEntries = chats && typeof chats === "object" ? Object.entries(chats) : [];
  return (
    <div className="chats">
      {chatEntries.length>0 ? ( 
        Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            className="userChat"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}>
            <img src={chat[1].userInfo.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage?.text}</p>
            </div>

            {chat[1].unreadCount > 0 && (
          <div className="unreadBadge">{chat[1].unreadCount}</div>
        )}
          </div>
        ))
      ): (
        <p className="emptyChatsMessage">No chats found</p>
      )}
    </div>
  );
};

export default Chats;
