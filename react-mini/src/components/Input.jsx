import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../contextAPI/AuthContext";
import { ChatContext } from "../contextAPI/ChatContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null); // any non-image attachment (audio, pdf, etc.)
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  function readable(f) {
    const size = f.size;
    const fileName = f.name.length > 14 ? f.name.slice(0, 10) + "..." + f.name.split(".").pop() : f.name;
    const fileSize =
      size < 1024
        ? `${size} B`
        : size < 1024 * 1024
        ? `${(size / 1024).toFixed(2)} KB`
        : `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return { fileName, fileSize };
  }

  async function handleSend() {
    if (!text && !img && !file) return;

    const newMessage = {
      id: uuid(),
      text,
      senderId: currentUser.uid,
      date: Timestamp.now(),
    };

    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = await uploadBytes(storageRef, img);
      newMessage.img = await getDownloadURL(uploadTask.ref);
    }

    if (file) {
      const storageRef = ref(storage, uuid());
      const uploadTask = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      const { fileName, fileSize } = readable(file);
      newMessage.file = {
        url: downloadURL,
        name: fileName,
        size: fileSize,
        type: file.type,
      };
    }

    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion(newMessage),
    });

    const lastMessageText = file ? `📎 ${file.name}` : text;
    const updates = {
      [data.chatId + ".lastMessage"]: { text: lastMessageText },
      [data.chatId + ".date"]: serverTimestamp(),
    };
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      ...updates,
      [data.chatId + ".unreadCount"]: 0,
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      ...updates,
      [data.chatId + ".unreadCount"]: increment(1),
    });

    setText("");
    setImg(null);
    setFile(null);
  }

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something...."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />

      {file && (
        <div className="filePreview">
          📎 {readable(file).fileName} ({readable(file).fileSize})
          <button type="button" onClick={() => setFile(null)}>✕</button>
        </div>
      )}

      <div className="send">
        <input
          type="file"
          accept="audio/*"
          style={{ display: "none" }}
          id="audiofile"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="audiofile">
          <img src={Attach} alt="" />
        </label>

        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;