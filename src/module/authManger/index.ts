import jwt from "jsonwebtoken";
import { User } from "../../db/models/Users";
import { Account } from "../../db/models/Account";
import bcrypt from "bcrypt"
import { emailSchema, passwordSchema } from "../../validationSchemas/userValidation"

export default class AuthManager {
    constructor() { }

    async signup({ email, password }) {
        try {
            const isValidEmail = emailSchema.safeParse(email);
            const isValidPassword = passwordSchema.safeParse(password);

            if (!isValidEmail.success) {
                return isValidEmail.error
            }

            if (!isValidPassword.success) {
                return isValidPassword.error;
            }

            // check existing user
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return { error: `User with ${email} already exist.` }
            }

            // hash the password
            const saltRound = 10;
            const hashedPassword = await bcrypt.hash(password, saltRound);

            // create new user
            const newUser = await User.create({
                email,
                password: hashedPassword
            });

            await Account.create({
                userId: newUser._id,
                balance: 0
            })

            return {
                message: "User created successfully!",
                userId: newUser._id
            }

        } catch (error) {
            console.error(`Error in signup: ${error}`)
            return {
                error: "Failed to create a user."
            }
        }
    }

    async login({ email, password }) {
        try {
            // get user from DB
            const user = await User.findOne({ email });
            console.log({ user })
            if (user) {
                // if user exist with similar email compare password
                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (isPasswordValid) {
                    const JWT_SECRET = process.env.JWT_SECRET || "theGodOfCricket";
                    // generate jwt token
                    const token = jwt.sign(
                        { userId: user._id, email: user.email },
                        JWT_SECRET,
                        { expiresIn: "24h" }
                    )

                    return {
                        token,
                        message: "User logged in successfully!",
                    }

                } else {
                    return {
                        message: "Invalid email and password!"
                    }
                }

            } else {
                return {
                    message: "Invalid email and password!"
                }
            }
        } catch (error) {
            console.error(`Error in login: ${error}`)
            return {
                message: "Failed to login user!"
            }
        }
    }
}