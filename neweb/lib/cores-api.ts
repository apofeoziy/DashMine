/**
 * API для работы с ядрами серверов
 */

import { ApiClient } from './api-client'

export interface ServerCore {
  name: string
  displayName: string
  versions?: string[]
}

export interface CoresList {
  [key: string]: {
    name: string
    url?: string
  }
}

export class CoresApi {
  /**
   * Получить список всех доступных ядер
   */
  static async getCoresList(): Promise<CoresList> {
    return ApiClient.get<CoresList>('/cores')
  }

  /**
   * Получить список версий конкретного ядра
   */
  static async getCoreVersions(core: string): Promise<string[]> {
    return ApiClient.get<string[]>(`/cores/${core}`)
  }

  /**
   * Получить URL для скачивания конкретной версии ядра
   */
  static async getCoreVersionUrl(
    core: string,
    version: string
  ): Promise<string> {
    return ApiClient.get<string>(`/cores/${core}/${version}`)
  }

  /**
   * Загрузить собственное ядро на сервер
   */
  static async uploadCore(server: string, formData: FormData): Promise<void> {
    await ApiClient.post(`/cores/${server}`, formData)
  }
}
