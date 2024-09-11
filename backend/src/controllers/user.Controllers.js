import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.Models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getCookieOptions } from "../utils/getCookieOptions.js";
import { deleteFilesFromCloudinary } from "../utils/deleteFilesFromCloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiErrors(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

// REGISTER USER

const registerUser = asyncHandler(async (req, res) => { 
  const { username, password } = req.body;
  if ([username, password].some((field) => field?.trim() === "")) {
    throw new ApiErrors(400, "All fields are required");
  }
  const existedUser = await User.findOne({ username });
  if (existedUser) {
    throw new ApiErrors(409, "User with username already exists");
  }
  const user = await User.create({
    password,
    username,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiErrors(500, "Something went wrong while registering the user");
  }

  console.log(`USER ${createdUser.username} REGISTERED`);

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  console.log("Login Details");
  console.log(req.body);
  if (!username) {
    throw new ApiErrors(400, "username is required");
  }
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiErrors(404, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiErrors(401, "Invalid user credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = getCookieOptions();
  console.log(`USER ${loggedInUser.username} LOGGED IN`);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

// LOGOUT USER
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = getCookieOptions();
  console.log("USER LOGGED OUT");
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

// SET PROFILE PICTURE
const setProfilePicture = asyncHandler(async (req, res) => {
  const profilePicLocalPath = req.files?.profilePicture[0]?.path;
  if (!profilePicLocalPath) {
    throw new ApiErrors(400, "Profile Picture is required");
  }

  const profilePicture = await uploadOnCloudinary(profilePicLocalPath);

  if (!profilePicture?.url) {
    throw new ApiErrors(
      500,
      "Something went wrong while uploading profile picture"
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePicture: profilePicture.url },
    { new: true, select: "-password -refreshToken" }
  );

  if (!user) {
    throw new ApiErrors(500, "Failed to update profile picture");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile picture updated successfully"));
});

// REMOVE PROFILE PICTURE
const deleteProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiErrors(404, "User not found");
  }

  if (!user.profilePicture) {
    throw new ApiErrors(400, "No profile picture to delete");
  }

  const profilePicURL = user.profilePicture;
  console.log(profilePicURL);
  
 deleteFilesFromCloudinary(profilePicURL);

  user.profilePicture = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Profile picture deleted successfully"));
});

// UPDATE PROFILE NAME AND PASSWORD
// const updatePassword = asyncHandler(async (req, res) => {
//   const { username, password } = req.body;

//   if ([username, password].every((field) => !field?.trim())) {
//     throw new ApiErrors(400, "Nothing to update");
//   }

//   const updateData = {};

//   if (username?.trim()) {
//     const existedUser = await User.findOne({ username });
//     if (existedUser && existedUser._id.toString() !== req.user._id.toString()) {
//       throw new ApiErrors(409, "Username is already taken");
//     }
//     updateData.username = username.trim();
//   }

//   if (password?.trim()) {
//     updateData.password = password.trim();
//   }

//   const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
//     new: true,
//     select: "-password -refreshToken",
//   });

//   if (!updatedUser) {
//     throw new ApiErrors(500, "Failed to update profile");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
// });

// const updateUserProfile = asyncHandler(async (req, res) => {
//   const { bio, location, socialLinks } = req.body;

//   const updateData = {};

//   if (bio?.trim()) {
//     if (bio.length < 1 || bio.length > 100) {
//       throw new ApiErrors(400, "Bio must be between 1 and 100 characters");
//     }
//     updateData.bio = bio.trim();
//   }

//   if (location?.trim()) {
//     updateData.location = location.trim();
//   }

//   if (Array.isArray(socialLinks) && socialLinks.length > 0) {
//     updateData.socialLinks = socialLinks.map((link) => link.trim());
//   }

//   const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
//     new: true,
//     select: "-password -refreshToken",
//   });

//   if (!updatedUser) {
//     throw new ApiErrors(500, "Failed to update profile");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
// });

// REFRESH ACCESS TOKEN

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiErrors(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiErrors(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiErrors(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiErrors(401, error?.message || "Invalid refresh token");
  }
});

// GET CURRENT USER
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
  setProfilePicture,
  //   updateUserProfile,
  //   updateUsernameAndPassword,
  deleteProfilePicture,
};
