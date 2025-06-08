import useSWR,{mutate,SWRConfiguration} from 'swr';
import {ApiError} from '@api-types/errors';

type ServiceMethod<Result,Input = void> = (input:Input) => Promise<Result>;

export function createSWRService<Result,Input = void>(
  key:string,
  method: ServiceMethod<Result, Input>,
  config?:SWRConfiguration
){
  return {
    useQuery:(input?:Input,options?:SWRConfiguration)=>{
      const fullKey = input ? `${key}-${JSON.stringify(input)}`:key;
      return useSWR<Result,ApiError>(fullKey,()=>method(input!),{
        ...config,
        ...options
      });
    },

    mutate:(input?:Input,data?:Result)=>{
      const fullKey = input ? `${key}-${JSON.stringify(input)}`:key;
      return mutate(fullKey,data);
    },
    prefetch:async(input?:Input)=>{
      const fullKey = input? `${key}-${JSON.stringify(input)}`:key;
      const data = await method(input!);
      mutate(fullKey,data,false);
    }
  };
}