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



// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const checkRegister = asyncHandler(async (req, res, next) => {
    const { username, email, password, role } = req.body;

    const user = await User.create({
      username,
      email,
      password,
      role
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
      return next(new ErrorResponse('Please provide an email and password', 400));
    }
  
    // Check for user
    const user = await User.findOne({ email }).select('+password');
  
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
  
    // Check if password matches
    const isMatch = await user.matchPassword(password);
  
    if (!isMatch) {
      // Important to return the same error message so no one can know the reason for login failure
      return next(new ErrorResponse('Invalid credentials', 401));
    }
  
    // Send token to client
    sendTokenResponse(user, 200, res);
});


// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', null, {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: true, // if you are using HTTPS
      sameSite: 'strict' // to prevent CSRF (Cross-Site Request Forgery) attacks
      /*
         CSRF is a type of web security vulnerability that allows an attacker to perform unwanted actions on behalf of an authenticated user. The attack occurs when a malicious website or script makes a request to a legitimate website where the user is already authenticated.
      */
    });
  
    res.status(200).json({
      success: true,
      data: {}
    });
  });
  
  // @desc    Get current logged in user
// @route   POST /api/v1/auth/current-user
// @access  Private
export const getCurrentUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      data: user
    });
  })



  export const UpdateTheWeightFoodIntake = asyncHandler(async (req, res) => {
    const UpadteUserById = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  
    if (!UpadteUserById) {
      return next(
        new Error(`UpadteUserById that end with '${req.params.id.slice(-6)}' not found`)
      );
    }
  
    res.status(200).json({
      success: true,
      data: UpadteUserById,
    });
   
  });
  
  
  

  // @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
// export const forgotPassword = asyncHandler(async (req, res, next) => {
//     const user = await User.findOne({ email: req.body.email });
  
//     if (!user) {
//       return next(new ErrorResponse('There is no user with that email', 404));
//     }
  
//     // Get reset token
//     const resetToken = user.getResetPasswordToken();
  
//     await user.save({ validateBeforeSave: false });
  
//     // Create reset url  
//     const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;
  
//     const message = `You are receiving this email because you (or someone else) has requested the reset of a password. If you did not make this request, please ignore this email. Otherwise, please make a PUT request to: \n\n ${resetUrl}`;
  
//     try {
//       await sendEmail({
//         email: user.email,
//         subject: 'Password reset token',
//         message
//       });
  
//       res.status(200).json({
//         success: true,
//         data: `Email sent successfully to ${user.email}`
//       });
//     } catch (error) {
//       console.log(error);
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpire = undefined;
  
//       await user.save({ validateBeforeSave: false });
  
//       return next(new ErrorResponse('Email could not be sent', 500));
//     }
  
//     res.status(200).json({
//       success: true,
//       data: user
//     });
//   });
  
//   // @desc    Reset password
//   // @route   PUT /api/v1/auth/reset-password/:resettoken
//   // @access  Public
//   export const resetPassword = asyncHandler(async (req, res, next) => {
//     // Get hashed token
//     const resetPasswordToken = crypto
//       .createHash('sha256')
//       .update(req.params.resettoken)
//       .digest('hex');
  
//     const user = await User.findOne({
//       resetPasswordToken,
//       resetPasswordExpire: { $gt: Date.now() }
//     });
  
//     if (!user) {
//       return next(new ErrorResponse('Invalid token', 400));
//     }
  
//     // Set new password
//     user.password = req.body.password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save();
  
//     sendTokenResponse(user, 200, res);
//   });
  // @desc    Update user password
// @route   PUT /api/v1/auth/update-password
// // @access  Private
// export const updatePassword = asyncHandler(async (req, res, next) => {
//     const user = await User.findById(req.user.id);
  
//     if (!user) {
//       return next(new ErrorResponse('Invalid token', 400));
//     }
  
//     // Check current password
//     if (!(await user.matchPassword(req.body.currentPassword))) {
//       return next(new ErrorResponse('Password is incorrect', 401));
//     }
  
//     user.password = req.body.newPassword;
  
//     await user.save();
  
//     sendTokenResponse(user, 200, res);
//   });