import React, { useContext, useState } from "react";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
// import { IoClose  } from "react-icons/io5";
import { IoMenu, IoClose } from "react-icons/io5";
import { UserContext } from "../Context/userContext";

const Header = () => {
  const [IsNavShowing, setIsNavShowing] = useState(
    window.innerWidth > 778 ? true : false
  );
  const{currentUser}=useContext(UserContext);
  // console.log(window.innerWidth);
  const closeNavHandler = () => {
    if (window.innerWidth < 778) {
      setIsNavShowing(false);
      console.log("it is below md");
    } else {
      setIsNavShowing(true);
      console.log("it is above md");

    }
  };
  return (
    <nav className="nav-bar">
      <div className="nav container-width">
        <Link className="" to='/' onClick={()=>closeNavHandler()}>
          <img className="logo" src={logo} alt="logo" />
        </Link>
       {currentUser?.id&&IsNavShowing  && <ul className="menu-bar ">
          <li>
            <Link to={`/profile/${currentUser?.id}`} className=""  onClick={()=>closeNavHandler()}>
              {currentUser?.name}
            </Link>
          </li>
          <li>
            <Link to="/create" onClick={()=>closeNavHandler()}>CreatePost</Link>
          </li>
          <li>
            <Link to="/authors" onClick={()=>closeNavHandler()}>Authors</Link>
          </li>
          <li>
            <Link to="/logout" className="" onClick={()=>closeNavHandler()}>
              Logout
            </Link>
          </li>
        </ul>}
       {!currentUser?.id&&IsNavShowing  && <ul className="menu-bar ">
          <li>
            <Link to="/authors" onClick={()=>closeNavHandler()}>Authors</Link>
          </li>
          <li>
            <Link to="/login" className="" onClick={()=>closeNavHandler()}>
              Login
            </Link>
          </li>
        </ul>}
        <button className="nav-button" onClick={()=>setIsNavShowing(!IsNavShowing)}>
          {IsNavShowing ? <IoClose /> : <IoMenu />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
