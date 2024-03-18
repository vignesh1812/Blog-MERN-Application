import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import profileAvator from "../images/avatar15.jpg";
import { FaEdit, FaCheck } from "react-icons/fa";
import { UserContext } from "../Context/userContext";
import axios from "axios";
const UserProfile = () => {
  const navigate = useNavigate();
  const [isAvatorTouched, setIsAvatorTouched] = useState(false);
  const [avator, setAvator] = useState("");
  const [name, Setname] = useState("");
  const [email, Setemail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [ConfirmnewPassword, setConfirmNewPassword] = useState("");
  const[error,setError]=useState('')
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const { id } = useParams();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  });

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_ASSETS_URL}/api/users/${id}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      // console.log(response);
      const { email, name, avator } = response.data;
      Setname(name);
      Setemail(email);
      setAvator(avator);
    };
    getUser();
  }, []);

  const changeAvatorHandle = async () => {
    setIsAvatorTouched(false);
    const postData = new FormData();
    postData.append('avator', avator);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_ASSETS_URL}/api/users/change-avator`,
        postData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setAvator(response?.data.avator);
    } catch (error) {
      console.log(error.response.data.message);
      // console.log(postData);

    }
  };
  const HandleUpdateDetials = async (e) => {
    e.preventDefault();
    try {
      const userdata = new FormData();
      userdata.append("name", name);
      userdata.append("email", email);
      userdata.append("currentPassword", currentPassword);
      userdata.append("confirmNewPassword", ConfirmnewPassword);
      userdata.append("newPassword", newPassword);
  
      const response = await axios.patch(
        `${process.env.REACT_APP_ASSETS_URL}/api/users/edit-user`,
        userdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if(response.status===200){
        navigate('/logout')
      }
    } catch (error) {
      setError(error.response.data.message)
    }
  };
  return (
    <section className="profile">
      <div className="container-width profile-container">
        <Link
          to={`/myposts/${currentUser?.id}`}
          className="px-3 py-1 bg-slate-200 rounded-md hover:bg-gray-900 hover:text-white transition-colors duration-200 "
        >
          My Posts
        </Link>
        <div className="profile-details">
          <div className="avator-wrapper">
            <div className="profile-avator">
              <img
                src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avator?avator:'Noavator.png'}`}
                alt=""
              />
            </div>
            {/* Form to update The Avator */}
            <form action="" className="avator-form">
              <input
                type="file"
                name="avator"
                accept="png,jpg,jpeg"
                onChange={(e) => setAvator(e.target.files[0])}
              
                id="avator"
              />
              <label htmlFor="avator" onClick={() => setIsAvatorTouched(true)}>
                <FaEdit />
              </label>
            </form>
            {isAvatorTouched && (
              <button className="profile-avator-button "   onClick={changeAvatorHandle}>
                <FaCheck />
              </button>
            )}
          </div>
          <h1>{currentUser.name}</h1>
          <form
            action=""
            className="form profile-form"
            onSubmit={HandleUpdateDetials}
          >
            {error&&<p className="form-error-mesage">{error}</p>}
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => Setname(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => Setemail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={ConfirmnewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button type="submit" className="">
              Update Details
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
