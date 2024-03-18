import React,{useState,useEffect} from 'react'
import PostItem from "../Components/PostItem";
// import {DummyPosts} from '../Data' 
import { useParams } from 'react-router-dom';
import Loader from '../Components/Loader';
import axios from 'axios';


const CategoryPosts = () => {
  const [Posts, SetPosts] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const {category}=useParams(); 
  useEffect(() => {
    const fetchPost = async () => {
      setisLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_ASSETS_URL}/api/posts/categories/${category}`);
        SetPosts(response.data);
      } catch (error) {
        console.log(error);
      }
      setisLoading(false);
    };
    fetchPost();
  }, [category]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="author-posts grid place-content-center">
    {Posts.length?<div className="container-width author-post-container">
     {Posts.map(({ creator, createdAt,category, _id:id, description, title,thumbnail }) => (
        <PostItem key={id} thumbnail={thumbnail} category={category} title={title} description={description} createdAt={createdAt} authorId={creator} postID={id}/>
      ))}
     </div>:<h1 className="text-center pt-20">{`{No Posts Found}`}</h1>}
    </section>
  )
}

export default CategoryPosts