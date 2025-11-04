/**
 * API для работы с серверами
 * Аналог KubekServers из старого фреймворка
 */

import { ApiClient } from './api-client'

export interface ServerInfo {
  name: string
  status: 'running' | 'stopped' | 'starting' | 'stopping'
  players?: {
    online: number
    max: number
  }
  version?: string
  [key: string]: any
}

export interface ServerLog {
  log: string
  lines?: Array<{
    type: 'info' | 'error' | 'warning'
    text: string
    time: string
  }>
}

export interface ServerUsage {
  cpu: number
  ram: {
    used: number
    total: number
    percent: number
  }
}

export class ServersApi {
  /**
   * Получить список всех серверов
   */
  static async getServersList(): Promise<string[]> {
    return ApiClient.get<string[]>('/servers')
  }

  /**
   * Получить информацию о сервере
   */
  static async getServerInfo(server: string): Promise<ServerInfo> {
    return ApiClient.get<ServerInfo>(`/servers/${server}/info`)
  }

  /**
   * Проверить существование сервера
   */
  static async isServerExists(server: string): Promise<boolean> {
    const serversList = await this.getServersList()
    return serversList.includes(server)
  }

  /**
   * Получить лог сервера
   */
  static async getServerLog(server: string): Promise<string> {
    try {
      const response = await ApiClient.get<ServerLog>(`/servers/${server}/log`)
      return typeof response === 'string' ? response : response.log || ''
    } catch (error) {
      return ''
    }
  }

  /**
   * Отправить команду на сервер
   */
  static async sendCommand(server: string, cmd: string): Promise<void> {
    await ApiClient.get(`/servers/${server}/send?cmd=${encodeURIComponent(cmd)}`)
  }

  /**
   * Запустить сервер
   */
  static async startServer(server: string): Promise<void> {
    await ApiClient.get(`/servers/${server}/start`)
  }

  /**
   * Перезапустить сервер
   */
  static async restartServer(server: string): Promise<void> {
    await ApiClient.get(`/servers/${server}/restart`)
  }

  /**
   * Остановить сервер
   */
  static async stopServer(server: string): Promise<void> {
    await ApiClient.get(`/servers/${server}/stop`)
  }

  /**
   * Создать новый сервер
   */
  static async createServer(params: {
    server: string
    core: string
    coreVersion: string
    javaVersion: string
    port: string
    startParameters: string
  }): Promise<any> {
    const queryParams = new URLSearchParams({
      server: params.server,
      core: params.core,
      coreVersion: params.coreVersion,
      javaVersion: params.javaVersion,
      port: params.port,
      startParameters: params.startParameters,
    })
    return ApiClient.get(`/servers/new?${queryParams.toString()}`)
  }
}
