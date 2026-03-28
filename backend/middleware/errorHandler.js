export default (err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;

  // In production, never leak internal error messages for 5xx errors
  const message =
    process.env.NODE_ENV === 'production' && status >= 500
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error';

  res.status(status).json({ message });
};
