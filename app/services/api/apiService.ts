/**
 * Centralized API Service
 * This service handles all API requests with consistent error handling
 * and allows for request customization
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"

import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"

export interface ApiServiceConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
}

export type ApiResult<T> = { kind: "ok"; data: T } | { kind: "error"; error: GeneralApiProblem }

/**
 * Centralized API Service class
 */
export class ApiService {
  private readonly apisauce: ApisauceInstance

  constructor(config: ApiServiceConfig) {
    this.apisauce = create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        Accept: "application/json",
        ...config.headers,
      },
    })
  }

  /**
   * Set additional headers for all requests
   */
  setHeaders(headers: Record<string, string>): void {
    this.apisauce.setHeaders(headers)
  }

  /**
   * Set a single header
   */
  setHeader(key: string, value: string): void {
    this.apisauce.setHeader(key, value)
  }

  /**
   * Generic GET request
   */
  async get<T>(
    url: string,
    params?: Record<string, string | number>,
    axiosConfig?: Record<string, string | number | boolean>,
  ): Promise<ApiResult<T>> {
    const response: ApiResponse<T> = await this.apisauce.get(url, params, axiosConfig)
    return this.handleResponse(response)
  }

  /**
   * Handle the API response and convert it to our ApiResult type
   */
  private handleResponse<T>(response: ApiResponse<T>): ApiResult<T> {
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { kind: "error", error: problem }
      }
    }

    if (response.data) {
      return { kind: "ok", data: response.data }
    }

    return { kind: "error", error: { kind: "bad-data" } }
  }
}
