import axios, { AxiosInstance, AxiosResponse } from "axios";

let apiUrl: string;

// Chạy client
if (typeof window !== "undefined") {
  const host = window.location.hostname;
  const protocol = window.location.protocol;
  apiUrl = `${protocol}//${host}/api`;
} else {
  apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
}

const API_BASE_URL = apiUrl;

class ApiLogin {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.token =
      typeof window !== "undefined"
        ? localStorage.getItem("auth_token")
        : null;

    this.axiosInstance = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
    });

    this.axiosInstance.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  removeToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  private async handleRequest<T>(
    request: Promise<AxiosResponse<T>>
  ): Promise<T> {
    try {
      const response = await request;
      return response.data;
    } catch (error: any) {
      console.error("API request failed:", error);
      throw error.response?.data || error;
    }
  }

  get<T>(endpoint: string, params?: Record<string, any>) {
    return this.handleRequest<T>(
      this.axiosInstance.get<T>(endpoint, { params })
    );
  }

  post<T>(endpoint: string, data?: any) {
    return this.handleRequest<T>(
      this.axiosInstance.post<T>(endpoint, data)
    );
  }

  put<T>(endpoint: string, data?: any) {
    return this.handleRequest<T>(
      this.axiosInstance.put<T>(endpoint, data)
    );
  }

  patch<T>(endpoint: string, data?: any) {
    return this.handleRequest<T>(
      this.axiosInstance.patch<T>(endpoint, data)
    );
  }

  delete<T>(endpoint: string) {
    return this.handleRequest<T>(
      this.axiosInstance.delete<T>(endpoint)
    );
  }

  async upload<T>(endpoint: string, formData: FormData) {
    const res = (await this.handleRequest<T>(
      this.axiosInstance.post<T>(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    )) as any;
    return res;
  }

  async uploadPatch<T>(endpoint: string, formData: FormData) {
    const res = (await this.handleRequest<T>(
      this.axiosInstance.patch<T>(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    )) as any;
    return res;
  }

  async uploadPut<T>(endpoint: string, formData: FormData) {
    const res = (await this.handleRequest<T>(
      this.axiosInstance.put<T>(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    )) as any;
    return res;
  }
}

export const apiLogin = new ApiLogin(API_BASE_URL);
