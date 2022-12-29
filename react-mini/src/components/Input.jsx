import React from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
const Input = () => {
  return (
    <div className="input">
      <input type="text" placeholder="Type something...." />
      <div className="send">
        <img src={Attach} alt="" />
        <input type="file" style={{ display: "none" }} id="file" />
        <label htmlFor="file">
          {/* whats label htmlfor for? opens up files?  */}
          <img src={Img} alt="" />
          {/* use . for div's classnames in css files for normal elemenst just names!! like img button but .send  */}
        </label>
        <button>Send</button>
      </div>
    </div>
  );
};

export default Input;
