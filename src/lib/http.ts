import type { AxiosRequestConfig, AxiosError } from "axios";
import { api } from "./api";

export type HttpError<T = any> = AxiosError<T> & { status?: number };
export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface GetParams<P extends QueryParams = QueryParams> {
  url: string;
  params?: P;
  config?: AxiosRequestConfig;
}
export interface BodyParams<B = any> {
  url: string;
  data: B;
  config?: AxiosRequestConfig;
}
export interface ParamsOnly<P extends QueryParams = QueryParams> {
  url: string;
  params: P;
  config?: AxiosRequestConfig;
}

/* ---------- GET ---------- */
export const getRequest = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const res = await api.get<T>(url, config);
    return res.data;
  } catch (err) {
    throw err as HttpError;
  }
};

export const getRequestParams = async <
  T = any,
  P extends QueryParams = QueryParams
>({
  url,
  params,
  config,
}: GetParams<P>): Promise<T> => {
  try {
    const res = await api.get<T>(url, { params, ...(config || {}) });
    return res.data;
  } catch (err) {
    throw err as HttpError;
  }
};

/* ---------- POST/PUT/PATCH (JSON) ---------- */
export const postRequest = async <T = any, B = any>({
  url,
  data,
  config,
}: BodyParams<B>): Promise<T> => {
  try {
    const res = await api.post<T>(url, data, { ...(config || {}) });
    return res.data;
  } catch (err) {
    throw err as HttpError;
  }
};
export const postRequestParams = async <
  T = any,
  P extends QueryParams = QueryParams
>({
  url,
  params,
  config,
}: ParamsOnly<P>): Promise<T> => {
  try {
    const res = await api.post<T>(url, null, { params, ...(config || {}) });
    return res.data;
  } catch (err) {
    throw err as HttpError;
  }
};
export const putRequest = async <T = any, B = any>({
  url,
  data,
  config,
}: BodyParams<B>): Promise<T> => {
  try {
    const res = await api.put<T>(url, data, { ...(config || {}) });
    return res.data;
  } catch (err) {
    throw err as HttpError;
  }
};
export const putRequestParams = async <
  T = any,
  P extends QueryParams = QueryParams
>({
  url,
  params,
  config,
}: ParamsOnly<P>): Promise<T> => {
  try {
    const res = await api.put<T>(url, null, { params, ...(config || {}) });
    return res.data;
  } catch (err) {
    throw err as HttpError;
  }
};
export const patchRequest = async <T = any, B = any>({
  url,
  data,
  config,
}: BodyParams<B>): Promise<T> => {
  try {
    const res = await api.patch<T>(url, data, { ...(config || {}) });
    return res.data;
  } catch (err) {
    throw err as HttpError;
  }
};

/* ---------- DELETE ---------- */
export const deleteRequest = async <T = any>({
  url,
  config,
}: {
  url: string;
  config?: AxiosRequestConfig;
}): Promise<T> => {
  try {
    const res = await api.delete<T>(url, config);
    return res.data;
  } catch (err) {
    throw err as HttpError;
  }
};
export const deleteRequestParams = async <
  T = any,
  P extends QueryParams = QueryParams
>({
  url,
  params,
  config,
}: ParamsOnly<P>): Promise<T> => {
  try {
    const res = await api.delete<T>(url, { params, ...(config || {}) });
    return res.data;
  } catch (err) {
    throw err as HttpError;
  }
};
export const deleteMany = async <T = any, B = any>({
  url,
  data,
  config,
}: BodyParams<B>): Promise<T> => {
  try {
    const res = await api.delete<T>(url, { data, ...(config || {}) });
    return res.data;
  } catch (err) {
    throw err as HttpError;
  }
};
