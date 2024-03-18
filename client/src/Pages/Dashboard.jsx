import { useState, useContext, useEffect } from "react";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../Context/userContext";
import axios from "axios";
import Loader from "../Components/Loader";
import DeletePost from "./DeletePost";

const Dashboard = () => {
  const [Posts, setPosts] = useState([]);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_ASSETS_URL}/api/posts/users/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchPost();
  }, []);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="dashboard ">
      {Posts.length >0? (
        <div className="dashboard-container">
          {Posts.map(({ title, _id:id, thumbnail }) => {
            const shorTitle =
              title.length > 30 ? title.substring(0, 30) + "..." : title;
            return (
              <article key={id} className="dashboard-posts">
                <div className="dashboard-post-info">
                  <div className="dashboard-post-thumbnail">
                    <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`} alt={title} />
                  </div>
                  <h5>{shorTitle}</h5>
                </div>
                <div className="dashboard-post-buttons">
                  <Link
                    to={`/posts/${id}`}
                    className="bg-white px-2 py-1  rounded-md hover:bg-gray-900 hover:text-white transition-colors duration-200"
                  >
                    View
                  </Link>
                  <Link
                    to={`/posts/${id}/edit`}
                    className="bg-primary text-white px-2 py-1 rounded-md hover:bg-gray-900 transition-colors duration-200"
                  >
                    Edit
                  </Link>
                  <DeletePost postId={id}/>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <h1 className="text-center pt-20">{`{you have no Posts Yet}`}</h1>
      )}
    </section>
  );
};

export default Dashboard;
