import { INewPost, INewUser } from '@/types/index';
import CreatePost from '@/_root/pages/CreatePost';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery} from "@tanstack/react-query";
import { createPost, CreateUserAccount, getRecentPosts, signInAccount, signOutAccount } from '../appwrite/api';
import { QUERY_KEYS } from './queryKeys';

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => CreateUserAccount(user),
  });
};
  
export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    }, 
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  })
}