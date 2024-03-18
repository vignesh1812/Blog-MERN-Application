import React, { useEffect, useContext,useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { UserContext } from "../Context/userContext";
import axios from "axios";
import Loader from "../Components/Loader";

const DeletePost = ({ postId: id }) => {
  const navigate = useNavigate();
  const[IsLoading,setIsLoading]=useState(false);
  const location = useLocation();
  console.log(location);
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);
  
  const removePost = async () => {
    setIsLoading(true)
    try {
      const response = await axios.delete(`${process.env.REACT_APP_ASSETS_URL}/api/posts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        if(location.pathname===`/myposts/${currentUser?.id}`){
          navigate(0)
        }else{
          navigate('/')
        }
      }
    } catch (error) {
      console.log("Couldn't delete The post");
    }
    setIsLoading(false)
  };
  if(IsLoading){
    return <Loader/>
  }
  return (
    <Link
      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-black transition-colors duration-300"
      onClick={() => removePost(id)}
    >
      Delete
    </Link>
  );
};

export default DeletePost;
