// With the Help of Promises
export const asyncHandler = (request) => {
  return (req, res, next) => {
    Promise.resolve(request(req, res, next)).catch(next);
  };
};

// With the help of Try-Catch
// export const asyncHandler = (requestHandler) => async (req, res, next) => {
//   try {
//     await requestHandler(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       message: error.message,
//       success: false,
//     });
//   }
// };
