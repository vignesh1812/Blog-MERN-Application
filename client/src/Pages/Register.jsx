import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from 'axios';
const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState();
  const navigate=useNavigate();
  const registerUser =async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response=await axios.post(`${process.env.REACT_APP_ASSETS_URL}/api/users/register`,userData)
      const newUser=await response.data;
      // console.log(newUser);
      if(!newUser){
        setError("Something Went Wrong.Please try again")
      }
      navigate('/login');
    } catch (err) {
     setError(err.response.data.message)   }
  };


  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };
  return (
    <section className="register" onSubmit={registerUser}>
      <div className="container-width">
        <h2>Sign Up</h2>
        <form className="form form-register">
          {error && <p className="bg-red-500 text-white px-3 text-sm text-left  py-2 rounded-md">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            name="name"
            value={userData.name}
            onChange={changeInputHandler}
            autoFocus
          />
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
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={userData.password2}
            onChange={changeInputHandler}
          />
          <button type="submit" className="">
            Register
          </button>
        </form>
        <small>
          Already have An account ?{" "}
          <Link to={`/login`} className="text-primary font-semibold">
            Sign in
          </Link>
        </small>
      </div>
    </section>
  );
};

export default Register;
