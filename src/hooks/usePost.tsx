import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";

export default function usePost<T, R>(url: string, data: T, posted: boolean, options: AxiosRequestConfig = {}) {
  const hasPostedRef = useRef(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [response, setResponse] = useState<AxiosResponse<R> | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    if (posted && !hasPostedRef.current) {
      hasPostedRef.current = true;
      setIsPosting(true);
      setError(null);

      axios.post<R>(url, data, options)
        .then((res: AxiosResponse<R>) => setResponse(res))
        .catch((err: AxiosError) => setError(err))
        .finally(() => setIsPosting(false));
    }
  }, [url, data, posted, options]);

  return { isPosting, response, error };
}
