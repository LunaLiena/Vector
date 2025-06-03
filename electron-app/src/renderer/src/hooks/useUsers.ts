import useSWR from 'swr';
import { UserService } from '@services/userService';

export const useUsers = (options?:{refreshInterval?:number}) =>{
  const { data, error, isLoading, mutate } = useSWR('/api/users',UserService.getAllUsers,options);
  return {
    users: data ?? [],
    isLoading,
    error,
    mutate,
  };
};

export const useUser = (options?:{id:number,refreshInterval?:number})=>{
  const key = options?.id ? `/api/user/${options.id}`:null;
  const {data,error,isLoading,mutate} = useSWR(key,()=>options?.id ? UserService.getUserById(options.id):null,options);
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export const useCurrentUsers = (options?:{refreshInterval?:number})=>{
  const key = '/api/users/me';
  const {data,error,isLoading,mutate} = useSWR(key,UserService.getCurrentUser,options);
  return {
    data,
    error,
    isLoading,
    mutate
  };
};

