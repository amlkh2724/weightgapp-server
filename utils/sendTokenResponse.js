const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const userInfo = {
    username: user.username,
    email: user.email,
    gender: user.gender,
    height: user.height,
    weight: user.weight,
    role: user.role,
    weightRecords: user.weightRecords,
    weekTracker: user.weekTracker,
    id: user._id
  };
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: userInfo
    });
};

export default sendTokenResponse;
