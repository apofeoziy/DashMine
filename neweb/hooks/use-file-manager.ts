/**
 * React хук для работы с файловым менеджером
 */

import { useState, useCallback } from 'react'
import { FileManagerApi, FileItem } from '@/lib/file-manager-api'

export function useFileManager(serverName: string) {
  const [currentPath, setCurrentPath] = useState('/')
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const sortFiles = useCallback((items: FileItem[]): FileItem[] => {
    const dirs = items.filter((item) => item.type === 'directory')
    const fileItems = items.filter((item) => item.type === 'file')
    return [...dirs, ...fileItems]
  }, [])

  const fetchDirectory = useCallback(
    async (path: string = currentPath) => {
      if (!serverName) return

      setLoading(true)
      setError(null)

      try {
        const items = await FileManagerApi.readDirectory(serverName, path)
        setFiles(sortFiles(items))
        setCurrentPath(path)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    },
    [serverName, currentPath, sortFiles]
  )

  const navigateToPath = useCallback(
    (path: string) => {
      fetchDirectory(path)
    },
    [fetchDirectory]
  )

  const navigateUp = useCallback(() => {
    const parts = currentPath.split('/').filter((p) => p)
    parts.pop()
    const newPath = parts.length > 0 ? `/${parts.join('/')}/` : '/'
    fetchDirectory(newPath)
  }, [currentPath, fetchDirectory])

  const openFolder = useCallback(
    (folderName: string) => {
      const newPath = currentPath + folderName + '/'
      fetchDirectory(newPath)
    },
    [currentPath, fetchDirectory]
  )

  const deleteFile = useCallback(
    async (path: string) => {
      try {
        const success = await FileManagerApi.deleteFile(serverName, path)
        if (success) {
          await fetchDirectory()
        }
        return success
      } catch (err) {
        setError(err as Error)
        return false
      }
    },
    [serverName, fetchDirectory]
  )

  const renameFile = useCallback(
    async (path: string, newName: string) => {
      try {
        await FileManagerApi.renameFile(serverName, path, newName)
        await fetchDirectory()
      } catch (err) {
        setError(err as Error)
        throw err
      }
    },
    [serverName, fetchDirectory]
  )

  const createDirectory = useCallback(
    async (name: string) => {
      try {
        await FileManagerApi.createDirectory(serverName, currentPath, name)
        await fetchDirectory()
      } catch (err) {
        setError(err as Error)
        throw err
      }
    },
    [serverName, currentPath, fetchDirectory]
  )

  const uploadFile = useCallback(
    async (formData: FormData) => {
      try {
        await FileManagerApi.uploadFile(serverName, currentPath, formData)
        await fetchDirectory()
      } catch (err) {
        setError(err as Error)
        throw err
      }
    },
    [serverName, currentPath, fetchDirectory]
  )

  const downloadFile = useCallback(
    (path: string) => {
      FileManagerApi.downloadFile(serverName, path)
    },
    [serverName]
  )

  return {
    currentPath,
    files,
    loading,
    error,
    fetchDirectory,
    navigateToPath,
    navigateUp,
    openFolder,
    deleteFile,
    renameFile,
    createDirectory,
    uploadFile,
    downloadFile,
    refresh: () => fetchDirectory(currentPath),
  }
}
