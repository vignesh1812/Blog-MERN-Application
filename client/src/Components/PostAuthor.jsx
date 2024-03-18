import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
import axios from 'axios'
import ReacTimeAgo from 'react-time-ago'
// import JsTimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json' 
import ru from 'javascript-time-ago/locale/ru.json' 
import TimeAgo, { locale } from 'javascript-time-ago'
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);


const PostAuthor = ({createdAt,authorId}) => {
  const[author,setAuthor]=useState([]);
  useEffect( ()=>{
 const getAuthor=async()=>{
  try {
    const response=await axios.get(`${process.env.REACT_APP_ASSETS_URL}/api/users/${authorId}`)
    setAuthor(response?.data)
  } catch (error) {
    console.log(error);
  }  
 }
 getAuthor();
  },[])
  return (
   <a href={`/posts/users/${authorId}`} className='post-author'>
   <div className="post__author-avator">
    <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${author.avator?author.avator:"Noavator.png"}`} alt="avator" />
    </div>  
    <div className="post-author-details">
        <small className='block font-semibold'>{author?.name}</small>
        <small><ReacTimeAgo date={new Date(createdAt)} locale='en-US'/></small>
        {/* <small>Jsut now</small> */}
    </div>

   </a>
  )
}

export default PostAuthor