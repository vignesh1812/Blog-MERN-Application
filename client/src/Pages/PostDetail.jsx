import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import PostAuthor from "../Components/PostAuthor";
import { UserContext } from "../Context/userContext";
import axios from "axios";
import Loader from "../Components/Loader";
import DeletePost from "./DeletePost";
const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, seterror] = useState(null);
  const [IsLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_ASSETS_URL}/api/posts/${id}`
        );
        setPost(response?.data);
      } catch (error) {
        seterror(error);
      }
      setIsLoading(false);
    };

    getPost();
  }, []);

   if(IsLoading){
    return <Loader/>
   }

  return (
    <section className="post-detail">
      {error&&<p>{error}</p>}
      {post&&<div className="container-width post-detail-container">
        <div className="post-detail-header">
          <PostAuthor  createdAt={post.createdAt} authorId={post.creator}/>
      {currentUser?.id===post.creator&&<div className="post-deatail-buttons">
            <Link
              className="px-3 py-1 bg-primary text-white rounded-md hover:bg-black transition-colors duration-300 "
              to={`/posts/${post?._id}/edit`}
            >
              Edit
            </Link>
          <DeletePost postId={id}/>
          </div>}
        </div>
        <h1 className="font-medium ">{post.title}</h1>
        <div className="post-detail-thumbnail">
          <img className="rounded-md" src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt={post.title} />
        </div>
        <p dangerouslySetInnerHTML={{__html:post.description}}>
        </p>
      </div>}
    </section>
  );
};

export default PostDetail;
