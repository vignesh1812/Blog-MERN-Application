import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../Components/Loader";
const Authors = () => {
  const [authorPosts, setAuthorPosts] = useState([]);
  const[IsLoading,SetIsloading]=useState(false);
  useEffect(()=>{
    const getAuthors=async()=>{
      SetIsloading(true);
      
      try {
        const response=await axios.get(`${process.env.REACT_APP_ASSETS_URL}/api/users/`)
        setAuthorPosts(response?.data);
      } catch (error) {
        console.log(error);
      }
      SetIsloading(false)
    }
    getAuthors();
  },[])
  if(IsLoading){
    return <Loader/>
  }
  return (
    <section className="authors overflow-x-hidden">
      {authorPosts.length > 0 ? (
        <div className="container-width author-container">
          {authorPosts.map(({ _id:id, avator, posts, name }) => {
            return (
              <Link key={id} to={`/posts/users/${id}`} className="author">
                <div className="author-avator">
                  <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avator?avator:"Noavator.png"}`} alt={name} />
                </div>
                <div className="author-info">
                  <p>{name} </p>
                  <small>{posts} Posts</small>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <h1 className="text-center pt-20">{`{No Authors/Users Found}`}</h1>
      )}
    </section>
  );
};

export default Authors;
