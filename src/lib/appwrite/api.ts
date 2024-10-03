import { INewUser } from "@/types/index";
import { ID } from "appwrite";
import { SigninValidation } from "../validation/index";
import { account, appwriteConfig, avatars, databases} from "./config";

export async function CreateUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        );

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            email: newAccount.email,
            name: newAccount.name,
            username: user.username,
            imageUrl: avatarUrl
        })

        return newUser
    } catch (error: unknown) {
        console.error("Error creating user account:", error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string,
    email: string,
    name: string,
    imageUrl?: URL,
    username?: string
  }) {
    try {
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        user,
      )
      return newUser;
    } catch (error) {
    }
  }

  export async function signInAccount(values: z.infer<typeof SigninValidation>) {
    try {
      const currentSession = await account.getSession('current').catch(() => null);
      if (currentSession) {
          return currentSession;
      }
        const session = await account.createEmailPasswordSession(values.email, values.password);
        
        return session;
    } catch (error: any) {
        return undefined;
    }
}

// ============================== GET ACCOUNT
export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      console.log(error);
    }
}

// ============================== GET USER
export async function getCurrentUser() {
    try {
        const user = await getAccount();
        return user;
      } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
      }
}

// 

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
    
  }
}