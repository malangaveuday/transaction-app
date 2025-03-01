import mongoose from "mongoose";

export const connectDB = async () => {
    const DB_URL = process.env.DATABASE_URL || "mongodb+srv://malangaveuday23:EWbxj95AZl1w8lej@learningmongo.zslzz.mongodb.net/paytm_clone?retryWrites=true&w=majority";
    try {
        if (DB_URL) {
            const DB = await mongoose.connect(DB_URL, {});
            console.info("Connnected sucessfully mongo db version", DB.version);
        } else {
            throw Error("DB_URL not available")
        }
    } catch (error) {
        console.error(`Unable to connect mongo DB due to ${error}`);
    }
}
