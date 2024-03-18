import React, { useState,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {UserContext} from "../Context/userContext.js"
import axios from "axios";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  // const[date,setDate]=useState();
  const[error,setError]=useState("");
  const navigate=useNavigate();
  const {SetcurrentUser}=useContext(UserContext);
  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };
  const loginUSer=async(e)=>{
    e.preventDefault();
    setError("");
    try {
      const response=await axios.post(`${process.env.REACT_APP_ASSETS_URL}/api/users/login`,userData)
      const user=await response.data;
      SetcurrentUser(user);
      navigate('/')
    } catch (err) {
      setError(err.response.data.message)
    }
  }
  return (
    <section className="register">
      <div className="container-width">
        <h2>Sign In</h2>
        <form className="form form-login" onSubmit={loginUSer}>
        {error && <p className="form-error-mesage">{error}</p>}
          <input
            type="text"
            placeholder="Enter Your Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
            autoFocus
          />
          <button type="submit" className="">
            Login
          </button>
        </form>
        <small>
          Don't have An account ?{" "}
          <Link to={`/register`} className="text-primary font-semibold">
            Sign Up
          </Link>
        </small>
      </div>
    </section>
  );
};

export default Login;
