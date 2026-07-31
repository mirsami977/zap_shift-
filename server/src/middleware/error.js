export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err?.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.fromEntries(
        Object.entries(err.errors).map(([field, detail]) => [field, detail.message])
      ),
    });
  }
  if (err?.code === 11000) {
    return res.status(409).json({ message: "Duplicate value", keys: Object.keys(err.keyValue) });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
