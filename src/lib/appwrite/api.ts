import { INewUser } from "@/types/index";
import { ID } from "appwrite";
import { account} from "./config";

export async function CreateUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        )
        return newAccount
    } catch (error: unknown) {
        console.error("Error creating user account:", error);
        return error;
    }
}