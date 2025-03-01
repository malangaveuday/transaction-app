import { Router, Request } from "express";
import isEmpty from "lodash/isEmpty";
import { authMiddleware } from "../../middleware/authMiddleware";
import { userDetailsSchema } from "../../validationSchemas/userValidation";;
import { User } from "../../db/models/Users"

const userRoute = Router();

userRoute.put("/", authMiddleware, async (req, res) => {
    try {
        const userDetails = req.body;
        const validatedUserDetails = userDetailsSchema.safeParse(userDetails);
        console.log("validatedUserDetails", validatedUserDetails)
        if (validatedUserDetails.success) {
            const { data: user } = validatedUserDetails;
            const updatedUser = await User.findOneAndUpdate({ _id: req.user?._id }, {
                $set: {
                    ...user
                }
            }, { new: true }).select("-__v -password");

            res.send({
                message: "User details updated successfully",
                user: updatedUser
            })
        } else {
            res.send({
                message: "Please provide valid user information",
                error: validatedUserDetails.error
            })
        }
    } catch (error) {
        console.error(`user details failed: ${error}`)
        res.send({
            message: "user details update failed!",
            error,
        })
    }
});

userRoute.get("/contacts", authMiddleware, async (req, res) => {
    try {
        const userQuery = req.query;

        let contacts;

        if (isEmpty(userQuery) || userQuery.filterBy) {
            contacts = await User.find().select("-__v -password");
        } else {
            const { filterBy } = userQuery;
            contacts = await User.find({
                $or: [{
                    firstname: { $regex: String(filterBy), $options: "i" }
                }, {
                    lastname: { $regex: String(filterBy), $options: "i" }
                }]
            }).select("-__v -password");
        }

        res.send({
            users: contacts
        })
    } catch (error) {
        console.error(`Unable to fetch user contact: ${error}`)
        res.send({
            message: "Unable to fetch user contact",
            error
        })
    }
})


export default userRoute;