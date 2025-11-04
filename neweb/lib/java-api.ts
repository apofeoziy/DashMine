/**
 * API для работы с Java версиями
 */

import { ApiClient } from './api-client'

export interface JavaVersion {
  version: string
  path?: string
  type?: 'system' | 'kubek' | 'downloadable'
}

export interface JavaVersions {
  installed: string[]
  kubek: string[]
  downloadable: string[]
}

export class JavaApi {
  /**
   * Получить список системных установленных версий Java
   */
  static async getInstalledJava(): Promise<string[]> {
    return ApiClient.get<string[]>('/java')
  }

  /**
   * Получить список Java версий в Kubek
   */
  static async getKubekJava(): Promise<string[]> {
    return ApiClient.get<string[]>('/java/kubek')
  }

  /**
   * Получить список доступных для скачивания версий Java
   */
  static async getDownloadableJava(): Promise<string[]> {
    return ApiClient.get<string[]>('/java/online')
  }

  /**
   * Получить все версии Java (системные, kubek, доступные для скачивания)
   */
  static async getAllJava(): Promise<JavaVersions> {
    return ApiClient.get<JavaVersions>('/java/all')
  }

  /**
   * Скачать версию Java
   */
  static async downloadJava(version: string): Promise<void> {
    await ApiClient.get(`/java/download/${version}`)
  }
}
