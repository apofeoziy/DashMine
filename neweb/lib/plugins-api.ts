/**
 * API для работы с плагинами
 */

import { ApiClient } from './api-client'

export interface Plugin {
  name: string
  version: string
  description?: string
  enabled: boolean
  file: string
}

export class PluginsApi {
  /**
   * Получить список плагинов сервера
   */
  static async getPlugins(server: string): Promise<string[]> {
    return ApiClient.get<string[]>(`/plugins/${server}`)
  }

  /**
   * Загрузить новый плагин
   */
  static async uploadPlugin(
    server: string,
    formData: FormData
  ): Promise<void> {
    await ApiClient.post(`/plugins/${server}`, formData)
  }

  /**
   * Удалить плагин
   */
  static async deletePlugin(server: string, pluginFile: string): Promise<void> {
    await ApiClient.delete(
      `/plugins/${server}?plugin=${encodeURIComponent(pluginFile)}`
    )
  }

  /**
   * Включить/выключить плагин
   */
  static async togglePlugin(
    server: string,
    pluginName: string,
    enabled: boolean
  ): Promise<void> {
    await ApiClient.post(`/plugins/toggle?server=${server}`, {
      plugin: pluginName,
      enabled,
    })
  }
}
