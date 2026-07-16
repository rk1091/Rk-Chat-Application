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
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { increment } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [audio, setAudio] = useState(null);
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);


  function readable(file){
    // fileName= file.name.slice(0,10);
    const size =file.size;
    const fileName = file.name.slice(0, 10) + '...' + file.name.split('.').pop();
    const fileSize =
      size < 1024
        ? `${size} B`
        : size < 1024 * 1024
        ? `${(size / 1024).toFixed(2)} KB`
        : `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return {fileName, fileSize};
  }
  async function handleSend() {
    // console.log(img);
    // console.log("a",audio);
    if (!text && !img && !audio) return;
    const newMessage = {
      id: uuid(),
      text,
      senderId: currentUser.uid,
      date: Timestamp.now(),
    };

    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = await uploadBytes(storageRef, img);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      newMessage.img = downloadURL;
    }
    if (audio) { //non img file for now
      const storageRef = ref(storage, uuid());
      const uploadTask = await uploadBytes(storageRef, audio);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      console.log(downloadURL);

      newMessage.audio = downloadURL;
    }
    //sends msg in chat view
    await updateDoc(doc(db, "chats", data.chatId), 
    {
      
      
      messages: arrayUnion(newMessage),
    });

    console.log(
      "jsdabfshd"+"hfbhdfvb"
    );
    //sends msg in main db log of both sender and reciever
    const updates = {
      [data.chatId + ".lastMessage"]: { text },
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

    //reset all inputs
    setText("");
    setImg(null);
    setAudio(null);
  }


  return (
    
    <div className="input">
      <input
        type="text"
        placeholder="Type something...."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
      <input
          type="file"
          style={{ display: "none" }}
          id="audiofile"
          onChange={(e) => {
            const readableText= readable(e.target.files[0]);
            const readableName= readableText.fileName;
            const readableSize= readableText.fileSize;
            // setText(e.target.files[0].name)
            setText( `${readableName} ${readableSize}`);
            setAudio(e.target.files[0])
            console.log(e.target.files);}            
          }
        />
        <label htmlFor="audiofile">
          <img src={Attach} alt="" />
        </label>
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) =>{
            console.log("gere",e.target.files);          
            setImg(e.target.files[0])
          } }
        />
        <label htmlFor="file">
          {/* whats label htmlfor for? -> links to id of input  */}
          <img src={Img} alt="" />
          {/* use . for div's classnames in css files for normal elemenst just names!! like img button but .send  */}
        </label>
        {/* create another func checkifaudio to check and handle audio msg exe else pass to flow to func handleSend */}
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
