declare namespace Express {
    export interface Request {
        user?: { _id: String, email: String }
    }
}