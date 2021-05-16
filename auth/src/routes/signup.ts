import express, { Request, Response } from "express";
import { body } from "express-validator";

import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@ncorg/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 5, max: 20 })
      .withMessage("password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email In Use");
    }

    const user = User.build({ email, password });
    await user.save();
    // Generate json web token
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );
    //store in session object
    req.session = { jwt: userJwt };
    res.status(201).send(user);
  }
);
router.get("/api/users/signup", (req, res) => {
  res.send("Hi");
});

export { router as signupRouter };
