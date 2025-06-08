import type { SWRConfiguration } from 'swr';

export const swrConfig:SWRConfiguration = {
  revalidateOnFocus:false,
  refreshInterval:30_000,
  shouldRetryOnError:false,
  fetcher:async (resource:string)=>{
    const res = await fetch(resource);
    if(!res.ok)throw new Error('Error loading');
    return res.json();
  }
};