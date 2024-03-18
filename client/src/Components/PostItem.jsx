import React from "react";
import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

const PostItem = ({
  thumbnail,
  authorId,
  category,
  postID,
  createdAt,
  description,
  title,
}) => {
  const ShortDesc =
    description.length > 140
      ? description.substring(0, 140) + "..."
      : description;
  const shorTitle = title.length > 30 ? title.substring(0, 30) + "..." : title;
  return (
    <article className="post">
      <div className="post-thumbnail">
        <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`} alt={title} />
      </div>
      <div className="post-content">
        <Link to={`/posts/${postID}`}>
          <h3 className="font-semibold">{shorTitle}</h3>
        </Link>
        <p className="text-sm" dangerouslySetInnerHTML={{__html:ShortDesc}}></p>
        <div className="post-footer">
          <PostAuthor createdAt={createdAt} authorId={authorId} />
          <Link to={`/posts/categories/${category}`} className="blog-button text-sm">
            {category}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
