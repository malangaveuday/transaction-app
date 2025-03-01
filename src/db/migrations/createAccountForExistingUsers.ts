import { User } from "../models/Users";
import { Account } from "../models/Account";
import { connectDB } from "../connectDB";

const createAccountForExistingUsers = async () => {
    await connectDB();
    try {
        // all Users
        const allUsers = await User.find();

        // create account entry for each user
        const accountRecords = allUsers.map(user => ({
            userId: user.id,
            balance: Math.floor(Math.random() * 1000) + 1
        }));

        await Account.insertMany(accountRecords);

        console.log("Created all entries");
    } catch (error) {
        console.error(`Error in createAccountForExistingUsers: ${error}`)
    }

}

createAccountForExistingUsers();