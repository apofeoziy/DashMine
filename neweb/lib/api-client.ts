/**
 * API клиент для работы с Kubek backend
 * Аналог KubekRequests из старого фреймворка
 */

const API_ENDPOINT = '/api'

export class ApiClient {
  private static async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    apiEndpoint = true
  ): Promise<T> {
    const fullUrl = apiEndpoint ? `${API_ENDPOINT}${url}` : url

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          ...options.headers,
        },
      })

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Forbidden: У вас нет доступа к этому ресурсу')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Проверяем content-type ответа
      const contentType = response.headers.get('content-type')
      
      // Если ответ пустой (204 No Content или пустое тело)
      const text = await response.text()
      if (!text || text.length === 0) {
        return '' as T
      }

      // Если это JSON, парсим как JSON
      if (contentType?.includes('application/json')) {
        return JSON.parse(text)
      }
      
      // Иначе возвращаем как текст
      return text as T
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  static async get<T>(url: string, apiEndpoint = true): Promise<T> {
    return this.makeRequest<T>(url, { method: 'GET' }, apiEndpoint)
  }

  static async post<T>(
    url: string,
    data?: any,
    apiEndpoint = true
  ): Promise<T> {
    const isFormData = data instanceof FormData

    return this.makeRequest<T>(
      url,
      {
        method: 'POST',
        headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
        body: isFormData ? data : JSON.stringify(data),
      },
      apiEndpoint
    )
  }

  static async put<T>(url: string, data?: any, apiEndpoint = true): Promise<T> {
    return this.makeRequest<T>(
      url,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
      apiEndpoint
    )
  }

  static async delete<T>(
    url: string,
    data?: any,
    apiEndpoint = true
  ): Promise<T> {
    return this.makeRequest<T>(
      url,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined,
      },
      apiEndpoint
    )
  }
}
