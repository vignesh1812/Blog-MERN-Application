const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const uid = require("uuid");
const jwt = require("jsonwebtoken");
const HttpError = require("../Models/errorModel");
const User = require("../Models/userModel");
// ------------------------REGISTER NEW USER--------------------------
// POST:api/users/register
// UNPROTECTED

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;
    if (!name || !email || !password || !password2) {
      return next(new HttpError("Fill all the Details", 422));
    }

    const newEmail =await email.toLowerCase();
    const emailExist = await User.findOne({ email: newEmail });
    if (emailExist) {
      return next(new HttpError("Email already Exists", 422));
    }
    if (password.trim().length < 6) {
      return next(
        new HttpError("Password should be at least 6 characters.", 422)
      );
    }

    if (password != password2) {
      return next(new HttpError("Password do not Match.", 422));
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashedPass,
    });
    res.status(201).json(`New user ${newUser.email} registered`);
  } catch (error) {
    return next(new HttpError("User registration failed.", 422));
  }
};

// ------------------------LOGIN A REGISTER USER--------------------------
// POST:api/users/login
// UNPROTECTED

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("Fill all the Details", 422));
    }
    const newEmail =await email.toLowerCase();
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new HttpError("Invalid Email.", 422));
    }

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return next(new HttpError("Invalid Password.", 422));
    }

    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ token, id, name });
  } catch (error) {
    return next(new HttpError("Login failed.Please Check Your Login Details"));
  }
};

// ------------------------GET USER PROFILE--------------------------
// GET:api/users/:id
// PROTECTED

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return next(new HttpError("User not found.", 422));
    }
    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ------------------------Change USER Avator (Profile Picture)--------------------------
// POST:api/users/change-avator
// PROTECTED

const changeAvator = async (req, res, next) => {
  try {
    if (!req.files.avator) {
      return next(new HttpError("Please choose an image", 422));
    }
    // find user from database
    const user = await User.findById(req.user.id);
    if (user.avator) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avator), (err) => {
        if (err) {
          return next(new HttpError(err));
        }
      });
    }

    const { avator } = req.files;
    //check files
    if (avator.size > 500000) {
      return next(new HttpError("Profile picture Should be less than 500kb"));
    }

    let filename;
    filename = avator.name;
    const splittedName = filename.split(".");
    let newFilename =
      splittedName[0] + uid.v4() + "." + splittedName[splittedName.length - 1];
    avator.mv(
      path.join(__dirname, "..", "uploads", newFilename),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        }

        const updateAvator = await User.findByIdAndUpdate(
          req.user.id,
          { avator: newFilename },
          { new: true }
        );
        if (!updateAvator) {
          return next(new HttpError("Avator couldn't be changed", 422));
        }
        res.status(200).json(updateAvator);
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ------------------------EDIT USER DETAILS (from profile)--------------------------
// POST:api/users/edit-user
// PROTECTED

const editUser = async (req, res, next) => {
  try {
    const { name, email, newPassword, currentPassword, confirmNewPassword } =
      req.body;
    if (!name || !email | !newPassword || !currentPassword ||!confirmNewPassword) {
      return next(new HttpError("Fill all the details"));
    }
    // get users from database
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User not found."));
    }
    
   const newEmail=await email.toLowerCase()



    //    confirm if the new email id already exist
    const emailExist = await User.findOne({ email:newEmail });
    // we want to update other details with/without changing email

    if (emailExist && emailExist._id != req.user.id) {
      return next(new HttpError("Email already Exists",422));
    }

    // compare current password to db password
    const validateUserPassword =await bcrypt.compare(currentPassword, user.password);
    if (!validateUserPassword) {
      return next(new HttpError("Invalid current password", 422));
    }

    // compare newpassword validation
    if ((newPassword.trim()).length < 6) {
      return next(new HttpError("Password should be at least 6 characters.",422));
    }
    // compare newpassword and confirmNewpassword
    if(newPassword!==confirmNewPassword){
        return next(new HttpError("New Password do not Match",422)) 
    }

    // hash new password
    const salt=await bcrypt.genSalt(10);
    const hash=await bcrypt.hash(newPassword,salt)
    
    // update user info in database

    const newInfo=await User.findByIdAndUpdate(req.user.id,{name,email:newEmail,password:hash,},{new:true})
    res.status(200).json(newInfo)
  } catch (error) {
    return next(new HttpError(error))
  }
};

// ------------------------GET AUTHORS--------------------------
// GET:api/users/authors
// PROTECTED

const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find().select("-password");
    res.json(authors);
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAuthors,
  getUser,
  editUser,
  changeAvator,
};
