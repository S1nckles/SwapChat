import { ID, Query } from "appwrite";

import { INewPost, INewUser } from "@/types/index";
import { SigninValidation } from "../validation/index";
import { account, appwriteConfig, avatars, databases, storage} from "./config";

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

export async function createPost(post: INewPost) {
  try {
    // Завантаження файлу
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) {
      throw new Error('File upload failed');
    }

    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id); // Видалення файлу у випадку помилки
      throw new Error('Failed to generate file URL');
    }

    const tags = post.tags ? post.tags.replace(/ /g, '').split(',') : [];

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw new Error('Failed to create post');
    }

    return newPost;
  } catch (error) {
    console.error('Error creating post:', error);
  }
}


export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)
    return {status: 'ok'}
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}