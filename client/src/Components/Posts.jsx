import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import axios from "axios";
import Loader from "./Loader";
const Posts = () => {
  const [Posts, SetPosts] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  useEffect(() => {
    const fetchPost = async () => {
      setisLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_ASSETS_URL}/api/posts`);
        SetPosts(response?.data);
      } catch (error) {
        console.log(error);
      }
      setisLoading(false);
    };
    fetchPost();
  }, []);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="posts grid place-content-center">
      {Posts.length > 0 ? (
        <div className="container-width post-container">
          {Posts.map(
            ({
              thumbnail,
              creator,
              category,
              _id: id,
              createdAt,
              description,
              title,
            }) => (
              <PostItem
                key={id}
                thumbnail={thumbnail}
                category={category}
                title={title}
                createdAt={createdAt}
                description={description}
                authorId={creator}
                postID={id}
              />
            )
          )}
        </div>
      ) : (
        <h1 className="text-center pt-20">{`{No Posts Found}`}</h1>
      )}
    </section>
  );
};

export default Posts;
