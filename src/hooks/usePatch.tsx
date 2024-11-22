import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useState } from "react";

export default function usePatch<T, R>(url: string, data: T, options: AxiosRequestConfig = {}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [response, setResponse] = useState<AxiosResponse<R> | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);

  const sendRequest = async () => {
    setResponse(null);
    setError(null);
    setIsUpdating(true);

    try {
      const res = await axios.patch<R>(url, data, options);
      setResponse(res);
    } catch (err) {
      setError(err as AxiosError);
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, response, error, sendRequest };
}
