const Post = require("../Models/postModel");
const User = require("../Models/userModel");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");
const HttpError = require("../Models/errorModel");

// ------------------------CREATE A POST
// POST : api/posts/
// PROTECTED
const createPost = async (req, res, next) => {
  try {
    let { title, category, description } = req.body;
    if (!title || !category || !description||!req.files) {
      return next(new HttpError("Fill all the Details and Choose Thumbnail", 422));
    }
    const { thumbnail } = req.files;
    //    check the files Size
    if (thumbnail.size > 2000000) {
      return next(new HttpError("Thumbnail size should be less than 2mb", 422));
    }

    let filename = await thumbnail.name;
    let splittedName = await filename.split(".");
    let newFilename =
      (await splittedName[0]) +
      uuid() +
      "." +
      splittedName[splittedName.length - 1];
    thumbnail.mv(
      path.join(__dirname, "..", "/uploads", newFilename),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        } else {
          const newPost = await Post.create({
            title,
            category,
            description,
            thumbnail: newFilename,
            creator: req.user.id,
          });
          if (!newPost) {
            return next(
              new HttpError("Something Went Wrong.Please try again!", 422)
            );
          }
          // find user and increase the posts count in user database
          const currentUser = await User.findById(req.user.id);
          const userPostCount = currentUser.posts + 1;
          await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
          res.status(201).json(newPost);
        }
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ------------------------GET POSTS FROM USERS
// POST : api/posts/
// UNPROTECTED
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ------------------------GET SINGLE POST FROM USER
// POST : api/posts/:id
const getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post Not Found.", 404));
    }
    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ------------------------GET POSTS BY CATEGORY
// GET : api/posts/categories/:category
const getCatPosts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const categoryPosts = await Post.find({ category }).sort({ createdAt: -1 });
    //  if(!categoryPosts){
    //     return next(new HttpError("Category Post Not Found.",404))
    //  }
    res.status(200).json(categoryPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ------------------------GET USER POSTS
// GET : api/posts/users/:id
// UNPROTECTED
const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ------------------------EDIT POST
// POST : api/posts/:id
// PROTECTED
const editPost = async (req, res, next) => {
  try {
    let filename;
    let newFilename;
    let updatedPost;
    const postId = req.params.id;
    let {title, description, category} = req.body;
    if (!title || !category|| description.length < 12 ) {
      return next(new HttpError("fill all the Details", 422));
    }
    
    if (!req.files) {
      updatedPost = await Post.findByIdAndUpdate(postId, {title,category,description},{new:true});
    } else {
      // get old post from database
      const oldPost = await Post.findById(postId);
      // delete old thumbanil from uploads
      fs.unlink(
        path.join(__dirname, "..", "uploads", oldPost.thumbnail),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        }
      );

      // upload new thumbnail
      const { thumbnail } =  req.files;
      if (thumbnail.size > 2000000) {
        return next(new HttpError("Thumbnail Should be lessthan 2mb", 422));
      }
      filename= thumbnail.name;
      let splittedName= filename.split('.');
      newFilename=splittedName[0]+uuid()+'.'+splittedName[splittedName.length-1];
      thumbnail.mv(path.join(__dirname,'..','uploads',newFilename),async(err)=>{
        if(err){
          return next(new HttpError(err))
        }
      })
      updatedPost=await Post.findByIdAndUpdate(postId,{title,category,description,thumbnail:newFilename},{new:true})
    }
    if(!updatedPost){
      return next(new HttpError("Something Went Wrong.Please Try again"))
    }
    res.status(200).json(updatedPost)
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ------------------------DELETE POST
// POST : api/posts/:id
// PROTECTED
const deletePost = async (req, res, next) => {
try {
  const postId=req.params.id
  if(!postId){
    return next(new HttpError("Post is unavailable",400))
  }
  const post=await Post.findById(postId);
  const filename=post?.thumbnail;
  // delete thumbnai using fs way
  fs.unlink(path.join(__dirname,'..','uploads',filename),async(err)=>{
     if(err){
      return next(new HttpError(err))
     }
     else{
      await Post.findByIdAndDelete(postId)
      // find user and reduce the cost
      const currentUser=await User.findById(req.user.id);
      const userPostsCount=currentUser?.posts-1;
      await User.findByIdAndUpdate(req.user.id,{posts:userPostsCount})

     }
  })

res.json(`Post ${postId} deleted  Successfully`)
} catch (error) {
  return next(new HttpError(error));
}
};

module.exports = {
  getCatPosts,
  getPost,
  getPosts,
  getUserPosts,
  deletePost,
  editPost,
  createPost,
};
