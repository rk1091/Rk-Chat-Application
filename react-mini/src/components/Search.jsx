import React from "react";
import { useState } from "react";
import { collection, query, where, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../contextAPI/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.key === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    //check whether group (chats in firestore) exists if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.id
        : user.id + currentUser.uid;
    const res = await getDocs(db, "chats", combinedId);

    if (!res.exists()) {
      //create chat in chats collection
      await setDoc(doc, (db, "chats", combinedId), { messages: [] });
    }

    //create user chats
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      {err && <span>user not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
