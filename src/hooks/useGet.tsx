import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { useState } from "react";

export default function useGet<R>(url: string, options: AxiosRequestConfig = {}) {
  const [isGetting, setIsGetting] = useState(false);
  const [response, setResponse] = useState<AxiosResponse<R> | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);

  const sendRequest = async () => {
    setResponse(null);
    setError(null);
    setIsGetting(true);

    try {
      const res = await axios.get<R>(url, options);
      setResponse(res);
    } catch (err) {
      setError(err as AxiosError);
    } finally {
      setIsGetting(false);
    }
  };

  return { isGetting, response, error, sendRequest };
}
