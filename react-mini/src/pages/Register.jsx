import React from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Add from "../img/addAvatar.png";
import { auth, db, storage } from "../firebase";
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

//why what did he do? getstorage del storage auth ke saath?
// wtf is going on?

const Register = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    if (!file) {
      alert("pls put an img u idiot!");
      return;
    }
    // console.log(email, password);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // console.log(res);

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        (error) => {
          // Handle unsuccessful uploads
          setErr(true);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          });
        }
      );
    } catch (err) {
      setErr(true);
      // console.log(err.message.contains("email-already"));
    }
    // createUserWithEmailAndPassword(auth, email, password).then(
    //   (userCredential) => {
    //     // Signed in
    //     const user = userCredential.user;
    //     console.log(user);
    //   }
    // );

    // createUserWithEmailAndPassword(auth, email, password)
    // .then((userCredential) => {
    //   // Signed in
    //   const user = userCredential.user;
    //   console.log(user);
    //   // ...
    // })
    // .catch((error) => {
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   // ..
    // });
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Rk's Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="text" />
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an Avatar</span>
          </label>
          <button>Sign up</button>
          {err && (
            <span>
              Something went wrong,
              <br></br>
              email might already be in use{" "}
            </span>
          )}
        </form>
        <p>Already have an account? Login</p>
      </div>
    </div>
  );
};

export default Register;
