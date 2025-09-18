'use client'

import { API_ROUTES } from './constants'

// Types for API responses
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  timestamp: Date
}

// Request interceptor configuration
interface RequestConfig extends RequestInit {
  retry?: number
  timeout?: number
  retryDelay?: number
}

// API Client class with retry logic and error handling
class ChessApiClient {
  private baseUrl: string
  private defaultHeaders: HeadersInit

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  // Main request method with retry logic and circuit breaker
  private async request<T>(
    endpoint: string, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      retry = 3,
      timeout = 10000,
      retryDelay = 1000,
      ...fetchConfig
    } = config

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const requestConfig: RequestInit = {
      ...fetchConfig,
      headers: {
        ...this.defaultHeaders,
        ...fetchConfig.headers,
      },
      signal: controller.signal,
    }

    let lastError: Error | null = null

    // Retry logic
    for (let attempt = 1; attempt <= retry + 1; attempt++) {
      try {
        console.log(`🔄 API Request: ${endpoint} (attempt ${attempt})`)
        
        const response = await fetch(`${this.baseUrl}${endpoint}`, requestConfig)
        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        
        console.log(`✅ API Success: ${endpoint}`, data)
        return {
          success: true,
          data,
          timestamp: new Date(),
        }

      } catch (error) {
        lastError = error as Error
        console.log(`❌ API Error: ${endpoint} (attempt ${attempt})`, error)

        // Don't retry on certain errors
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            break // Timeout - don't retry
          }
          if (error.message.includes('404') || error.message.includes('401')) {
            break // Client errors - don't retry
          }
        }

        // Wait before retry (exponential backoff)
        if (attempt <= retry) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt))
        }
      }
    }

    clearTimeout(timeoutId)

    // Return error response
    return {
      success: false,
      error: {
        code: 'API_ERROR',
        message: lastError?.message || 'Unknown error occurred',
        details: lastError,
      },
      timestamp: new Date(),
    }
  }

  // GET request
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  // POST request
  async post<T>(
    endpoint: string, 
    data?: any, 
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT request
  async put<T>(
    endpoint: string, 
    data?: any, 
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE request
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      'Authorization': `Bearer ${token}`,
    }
  }

  // Remove authentication token
  clearAuthToken() {
    const headers = { ...this.defaultHeaders }
    delete (headers as any)['Authorization']
    this.defaultHeaders = headers
  }
}

// Create API client instance
export const apiClient = new ChessApiClient()

// API method helpers
export const chessApi = {
  // User authentication
  auth: {
    register: (userData: any) => apiClient.post(API_ROUTES.AUTH.REGISTER, userData),
    login: (credentials: any) => apiClient.post(API_ROUTES.AUTH.LOGIN, credentials),
    logout: () => apiClient.post(API_ROUTES.AUTH.LOGOUT),
    getSession: () => apiClient.get(API_ROUTES.AUTH.SESSION),
  },

  // Game management
  games: {
    create: (gameData: any) => apiClient.post(API_ROUTES.GAMES.CREATE, gameData),
    list: (params?: any) => apiClient.get(`${API_ROUTES.GAMES.LIST}${params ? `?${new URLSearchParams(params)}` : ''}`),
    get: (gameId: string) => apiClient.get(API_ROUTES.GAMES.GET(gameId)),
    makeMove: (gameId: string, moveData: any) => apiClient.post(API_ROUTES.GAMES.MOVE(gameId), moveData),
    resign: (gameId: string) => apiClient.post(API_ROUTES.GAMES.RESIGN(gameId)),
    offerDraw: (gameId: string) => apiClient.post(API_ROUTES.GAMES.DRAW(gameId)),
  },

  // User management
  users: {
    getProfile: () => apiClient.get(API_ROUTES.USERS.PROFILE),
    getStats: () => apiClient.get(API_ROUTES.USERS.STATS),
    getFriends: () => apiClient.get(API_ROUTES.USERS.FRIENDS),
  },
}

// Request logging for development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔧 Chess API Client initialized in development mode')
}

export default chessApi
