import { Router } from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
  setProfilePicture,
  //   updateUserProfile,
  //   updateUsernameAndPassword,
  deleteProfilePicture,
} from "../controllers/user.Controllers.js";

import { upload } from "../middlewares/multer.Middleware.js";
import { verifyJWT } from "../middlewares/auth.Middleware.js";

const router = Router();

router.route("/register").post(registerUser);              // TESTED

router.route("/login").post(loginUser);                    // TESTED
router.route("/logout").post(verifyJWT, logoutUser);      // TESTED

router.route("/refresh-token").post(refreshAccessToken);

router.route("/current-user").get(verifyJWT, getCurrentUser); 

router.route("/profile-picture/:userId").post(            //TESTED
  verifyJWT,
  upload.fields([
    {
      name: "profilePicture",
      maxCount: 1,
    },
  ]),
  setProfilePicture
);
router
  .route("/profile-picture/delete/:userId")
  .delete(verifyJWT, deleteProfilePicture);               //TESTED
// router.route("/update").patch(verifyJWT, updateUsernameAndPassword);
// router.route("/update-user-profile").patch(verifyJWT, updateUserProfile);
export default router;
