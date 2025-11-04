/**
 * API для работы с мониторингом железа
 * Аналог KubekHardware из старого фреймворка
 */

import { ApiClient } from './api-client'

export interface HardwareUsage {
  cpu: number
  ram: {
    used: number
    total: number
    percent: number
  }
  disk?: {
    used: number
    total: number
    percent: number
  }
}

export class HardwareApi {
  /**
   * Получить использование ресурсов сервера
   */
  static async getUsage(server?: string): Promise<HardwareUsage> {
    const params = server ? `?server=${server}` : ''
    return ApiClient.get<HardwareUsage>(`/kubek/hardware/usage${params}`)
  }

  /**
   * Получить историю использования ресурсов
   */
  static async getUsageHistory(
    server?: string,
    period = '1h'
  ): Promise<HardwareUsage[]> {
    const url = server
      ? `/kubek/hardware/history?server=${server}&period=${period}`
      : `/kubek/hardware/history?period=${period}`
    return ApiClient.get<HardwareUsage[]>(url)
  }
}
