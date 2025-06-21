import { Router } from "express";
import { changeCurrentPassword,
    getCurrentUser,
    getTypingResults,
    loginUser,
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    storeTypingResults, 
    updateAccountDetails,  } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/save-result").post(verifyJWT, storeTypingResults)
router.route("/get-result").post(verifyJWT, getTypingResults)


export default router