import api from '@api/api';
import { createSWRService } from './swrService';
import {mutate} from 'swr';
import { Route } from '@api-types/route';
import { Role } from '@renderer/api/apiTypes/role';

export interface RoleRequest{
  id:number;
  name:string;
  routes:Array<Route>;
  description:string;
}

export interface CreateRoleRequest{
  role_name:string;
  routeIds:Array<number>;
}

export const RoleService = {
  createRole:async (role:CreateRoleRequest):Promise<Role>=>{
    const response = await api.post<Role>('/roles/new',role);
    return response.data;
  },

  getRoles:async():Promise<Array<Role>>=>{
    const response = await api.get<Array<Role>>('/roles');
    return response.data;
  },

  getRoleById:async(id:number):Promise<Role>=>{
    const response = await api.get<Role>(`roles/${id}`);
    return response.data;
  },

  
};
