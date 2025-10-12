import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.jwtSecret,
    {
      expiresIn: "30d",
    }
  );
};
