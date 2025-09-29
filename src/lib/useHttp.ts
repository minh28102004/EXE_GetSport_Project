import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AxiosRequestConfig } from "axios";
import {
  getRequest,
  getRequestParams,
  postRequest,
  postRequestParams,
  putRequest,
  putRequestParams,
  patchRequest,
  deleteRequest,
  deleteRequestParams,
  deleteMany,
} from "./http";
import type { HttpError, QueryParams } from "./http";

function useSafeState<T>(initial: T) {
  const mounted = useRef(true);
  const [state, setState] = useState<T>(initial);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    []
  );
  const safeSet = useCallback((v: T) => {
    if (mounted.current) setState(v);
  }, []);
  return [state, safeSet] as const;
}

/* --- GET auto-fetch --- */
export function useGet<T = any, P extends QueryParams = QueryParams>(
  url: string,
  opts?: {
    params?: P;
    enabled?: boolean;
    config?: AxiosRequestConfig;
    deps?: any[];
  }
) {
  const { params, enabled = true, config, deps = [] } = opts || {};
  const [data, setData] = useSafeState<T | undefined>(undefined);
  const [error, setError] = useSafeState<HttpError | null>(null);
  const [loading, setLoading] = useSafeState<boolean>(!!enabled);

  const fetcher = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = params
        ? await getRequestParams<T, P>({ url, params, config })
        : await getRequest<T>(url, config);
      setData(res);
    } catch (e) {
      setError(e as HttpError);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(params), JSON.stringify(config)]);

  useEffect(() => {
    if (enabled) fetcher(); /* eslint-disable-next-line */
  }, [enabled, fetcher, ...deps]);

  return { data, error, loading, refetch: fetcher };
}

/* --- Mutation factory --- */
export function useMutation<T = any>(fn: (...args: any[]) => Promise<T>) {
  const [data, setData] = useSafeState<T | undefined>(undefined);
  const [error, setError] = useSafeState<HttpError | null>(null);
  const [loading, setLoading] = useSafeState<boolean>(false);

  const mutate = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fn(...args);
        setData(res);
        return res;
      } catch (e) {
        setError(e as HttpError);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  return { data, error, loading, mutate };
}

export function useHttp() {
  const post = useMutation(
    <T = any, B = any>(args: {
      url: string;
      data: B;
      config?: AxiosRequestConfig;
    }) => postRequest<T, B>(args)
  );
  const postParams = useMutation(
    <T = any, P extends QueryParams = QueryParams>(args: {
      url: string;
      params: P;
      config?: AxiosRequestConfig;
    }) => postRequestParams<T, P>(args)
  );
  const put = useMutation(
    <T = any, B = any>(args: {
      url: string;
      data: B;
      config?: AxiosRequestConfig;
    }) => putRequest<T, B>(args)
  );
  const putParams = useMutation(
    <T = any, P extends QueryParams = QueryParams>(args: {
      url: string;
      params: P;
      config?: AxiosRequestConfig;
    }) => putRequestParams<T, P>(args)
  );
  const patch = useMutation(
    <T = any, B = any>(args: {
      url: string;
      data: B;
      config?: AxiosRequestConfig;
    }) => patchRequest<T, B>(args)
  );
  const del = useMutation(
    <T = any>(args: { url: string; config?: AxiosRequestConfig }) =>
      deleteRequest<T>(args)
  );
  const delParams = useMutation(
    <T = any, P extends QueryParams = QueryParams>(args: {
      url: string;
      params: P;
      config?: AxiosRequestConfig;
    }) => deleteRequestParams<T, P>(args)
  );
  const delMany = useMutation(
    <T = any, B = any>(args: {
      url: string;
      data: B;
      config?: AxiosRequestConfig;
    }) => deleteMany<T, B>(args)
  );

  return useMemo(
    () => ({
      post,
      postParams,
      put,
      putParams,
      patch,
      del,
      delParams,
      delMany,
    }),
    [post, postParams, put, putParams, patch, del, delParams, delMany]
  );
}
