import asyncHandler from '.././middleware/errorHandler.js';
import User from '../models/authRoutes.js';

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res, next) => {
    const findAllUsers = await User.find();
    res.status(200).json({
      success: true,
      data: findAllUsers,
    });
  });
// @desc    Get a single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`No user found with id of ${req.params.id}`, 404)
    );
  }

  res
    .status(200)
    .json({
      success: true,
      data: user
    });
});

// @desc    Create a user
// @route   POST /api/v1/users
// @access  Private/Admin
export const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res
    .status(201)
    .json({
      success: true,
      data: user
    });
});

// @desc    Update a user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`No user found with id of ${req.params.id}`, 404)
    );
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res
    .status(200)
    .json({
      success: true,
      data: user
    });
});

// @desc    Update a user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`No user found with id of ${req.params.id}`, 404)
    );
  }

  await User.findByIdAndDelete(req.params.id);

  res
    .status(200)
    .json({
      success: true,
      data: {}
    });
});