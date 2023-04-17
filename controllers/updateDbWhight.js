import asyncHandler from "../middleware/errorHandler.js";
import User from "../models/authRoutes.js";
import sendTokenResponse from "../utils/sendTokenResponse.js";
export const getaAllUsers = asyncHandler(async (req, res, next) => {
  const findAllUsers = await User.find();
  res.status(200).json({
    success: true,
    data: findAllUsers,
  });
});




export const getSpecificUser = asyncHandler(async (req, res) => {
  const specificUser = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: specificUser,
  });
});

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const checkRegister = asyncHandler(async (req, res, next) => {
  const { username, email, password, role, height, weight, gender,lastWeightAddedDate,setGoal } = req.body;

  const user = await User.create({
    username,
    email,
    password,
    role,
    height,
    weight,
    gender,
    lastWeightAddedDate,
    setGoal
  
  });

  // Send token to client
  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    // Important to return the same error message so no one can know the reason for login failure
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Send token to client
  sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: true, // if you are using HTTPS
    sameSite: "strict", // to prevent CSRF (Cross-Site Request Forgery) attacks
    /*
         CSRF is a type of web security vulnerability that allows an attacker to perform unwanted actions on behalf of an authenticated user. The attack occurs when a malicious website or script makes a request to a legitimate website where the user is already authenticated.
      */
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get current logged in user
// @route   POST /api/v1/auth/current-user
// @access  Private
export const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const UpdateTheWeightFoodIntake = asyncHandler(async (req, res) => {
  const UpadteUserById = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!UpadteUserById) {
    return next(
      new Error(
        `UpadteUserById that end with '${req.params.id.slice(-6)}' not found`
      )
    );
  }
  res.status(200).json({
    success: true,
    data: UpadteUserById,
  });
});

export const addWeight=asyncHandler(async (req, res)=> {
  try {
    const user = await User.findById(req.user.id);

    // Check if the user has already added their weight today
    const today = new Date();
    const lastWeightAddedDate = new Date(user.lastWeightAddedDate);
    const isSameDay = today.toDateString() === lastWeightAddedDate.toDateString();

    if (isSameDay && user.hasAddedWeightToday) {
      return res.status(400).json({ success: false, message: "You have already added your weight for today" });
    }

    // Update the user's weight records with the new weight entry
    user.weightRecords.push({ weight: req.body.weight });
    user.hasAddedWeightToday = true;
    user.lastWeightAddedDate = today;

    // Save the updated user record
    await user.save();

    res.status(200).json({ success: true, message: "Weight added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
})
