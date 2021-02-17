const handleError = (error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  console.log("Error Handler log:", error.message);

  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
};

module.exports = handleError;
