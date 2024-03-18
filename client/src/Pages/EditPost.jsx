import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../Context/userContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const EditPost = () => {
  const {id}=useParams()
  const [title, SetTitle] = useState("");
  const [description, Setdescription] = useState("");
  const [thumbnail, SetThumbnail] = useState("");
  const [category, Setcategory] = useState("");
  const [error,setError]=useState('')
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  // ReactQuill Editor Modules
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  // ReactQuill Editor Formats
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "dist",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const POST_CATEGORIES = [
    "Agriculture",
    "Business",
    "Education",
    "Entertainment",
    "Art",
    "Investment",
    "Uncategorized",
    "Weather",
  ];
 
useEffect(()=>{
  const getPost=async()=>{
    try {
      const response= await axios.get(`${process.env.REACT_APP_ASSETS_URL}/api/posts/${id}`)
      SetTitle(response.data.title)
      Setdescription(response.data.description)
      Setcategory(response.data.category)
    } catch (err) {
      console.log(err);
    }
  }
  getPost();
},[])

const editPost=async(e)=>{
  e.preventDefault()
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("description", description);
  formData.append("thumbnail", thumbnail);

  try {
    const response = await axios
      .patch(`${process.env.REACT_APP_ASSETS_URL}/api/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true 
      })
    if (response.status === 200) {
      return navigate("/");
    }
  } catch (err) {
    setError(err.response.data.message);
  }
}
  return (
    <section className="create-post">
      <div className="container-width">
        <h2>Edit Post</h2>
        <form action="" className="form create-post-form" onSubmit={editPost}>
          {error&&<p className="form-error-mesage">{error}</p>}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => SetTitle(e.target.value)}
            autoFocus
          />
          <select
            name="category"
            id=""
            value={category}
            onChange={(e) => Setcategory(e.target.value)}
          >
            {POST_CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <ReactQuill
            modules={modules}
            formats={formats}
            value={description}
            onChange={Setdescription}
          />
          <input
            type="file"
            accept="png.jpg,jpeg"
            onChange={(e) => SetThumbnail(e.target.files[0])}
          />
          <button
            type="submit"
            className="px-3 py-1 rounded-md bg-priamry text-white"
          >
            Update
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
