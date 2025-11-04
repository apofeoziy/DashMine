/**
 * API для работы с файловым менеджером
 * Аналог KubekFileManager из старого фреймворка
 */

import { ApiClient } from './api-client'

export interface FileItem {
  name: string
  path: string
  type: 'file' | 'directory'
  size: number
  modify: string
}

export interface ChunkWriteResponse {
  chunkId: string
}

export class FileManagerApi {
  /**
   * Прочитать содержимое директории
   */
  static async readDirectory(
    server: string,
    path: string
  ): Promise<FileItem[]> {
    return ApiClient.get<FileItem[]>(
      `/fileManager/get?server=${server}&path=${encodeURIComponent(path)}`
    )
  }

  /**
   * Прочитать содержимое файла
   */
  static async readFile(server: string, path: string): Promise<string> {
    return ApiClient.get<string>(
      `/fileManager/get?server=${server}&path=${encodeURIComponent(path)}`
    )
  }

  /**
   * Начать запись файла по частям
   */
  static async startChunkWrite(
    server: string,
    path: string
  ): Promise<ChunkWriteResponse> {
    return ApiClient.get<ChunkWriteResponse>(
      `/fileManager/chunkWrite/start?server=${server}&path=${encodeURIComponent(path)}`
    )
  }

  /**
   * Добавить чанк к записи файла
   */
  static async addChunkWrite(
    server: string,
    chunkId: string,
    data: string
  ): Promise<void> {
    await ApiClient.get<void>(
      `/fileManager/chunkWrite/add?id=${chunkId}&data=${encodeURIComponent(data)}`
    )
  }

  /**
   * Завершить запись файла
   */
  static async endChunkWrite(server: string, chunkId: string): Promise<void> {
    await ApiClient.get<void>(
      `/fileManager/chunkWrite/end?id=${chunkId}`
    )
  }

  /**
   * Переименовать файл или папку
   */
  static async renameFile(
    server: string,
    path: string,
    newName: string
  ): Promise<void> {
    await ApiClient.get<void>(
      `/fileManager/rename?server=${server}&path=${encodeURIComponent(path)}&newName=${encodeURIComponent(newName)}`
    )
  }

  /**
   * Удалить файл или папку
   */
  static async deleteFile(server: string, path: string): Promise<void> {
    await ApiClient.get<void>(
      `/fileManager/delete?server=${server}&path=${encodeURIComponent(path)}`
    )
  }

  /**
   * Создать новую директорию
   */
  static async createDirectory(
    server: string,
    path: string,
    name: string
  ): Promise<void> {
    await ApiClient.get<void>(
      `/fileManager/newDirectory?server=${server}&path=${encodeURIComponent(path)}&name=${encodeURIComponent(name)}`
    )
  }

  /**
   * Загрузить файл на сервер
   */
  static async uploadFile(
    server: string,
    path: string,
    formData: FormData
  ): Promise<void> {
    await ApiClient.post(
      `/fileManager/upload?server=${server}&path=${encodeURIComponent(path)}`,
      formData
    )
  }

  /**
   * Скачать файл с сервера
   */
  static getDownloadUrl(server: string, path: string): string {
    return `/api/fileManager/download?server=${server}&path=${encodeURIComponent(path)}`
  }
}
