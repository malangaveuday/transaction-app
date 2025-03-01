import { Router, Request } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { Account } from "../../db/models/Account";
import { User } from "../../db/models/Users";
import mongoose from "mongoose";


const accountRoute = Router();

accountRoute.get("/balance", authMiddleware, async (req, res) => {
    try {
        const userId = req.user?._id;

        const userAccountInfo = await Account.findOne({
            userId
        })

        if (userAccountInfo) {
            res.send({
                balance: userAccountInfo?.balance
            })
        } else {
            res.status(400).send({
                message: "Does not have account information for this user."
            })
        }
    } catch (error) {
        console.error(`Error in get balalnce: ${error}`)
        res.status(500).send({
            message: "At this moment we can not fetch balalnce",
        })
    }

});

accountRoute.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction()
        const { to, amount } = req.body;
        const userId = req.user?._id;

        const currentUserAccount = await Account.findOne({ userId }).session(session);

        if (currentUserAccount) {
            const currentBalance = currentUserAccount.balance;
            if (currentBalance >= amount) {
                await Account.updateOne({ userId }, { $inc: { balance: -amount } }).session(session);
                await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
                await session.commitTransaction();
                res.send({
                    message: "Money transfer successfully!"
                })
            } else {
                await session.abortTransaction()
                res.status(400).send({
                    message: "You does not have sufficient amnount."
                })
            }
        } else {
            await session.abortTransaction()
            res.status(400).send({
                message: "Does not have account information for this user."
            })
        }

    } catch (error) {
        await session.abortTransaction()
        console.error(`Error in transfer amount: ${error}`)
        res.status(500).send({
            message: "At this moment we can not transfer amount.",
        })
    }
})

export default accountRoute;