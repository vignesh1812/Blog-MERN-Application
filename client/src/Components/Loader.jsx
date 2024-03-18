import React from "react";
import spinner from "../images/Spinner-2.gif";

const Loader = () => {
  return (
    <div className="loader bg-white fixed top-0 left-0 w-screen h-screen grid place-items-center">
      <div className="loader-image w-12 h-12">
        <img src={spinner} alt="" />
      </div>
    </div>
  );
};

export default Loader;
