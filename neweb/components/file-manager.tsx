"use client"

import { useEffect, useState } from "react"
import { FolderOpen, FileText, Plus, RefreshCw, FolderUp, Download, Upload, Trash2, Edit } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFileManager } from "@/hooks/use-file-manager"
import { humanizeFileSize, formatDate, isEditableFile } from "@/lib/utils-extended"
import { useToast } from "@/hooks/use-toast"

interface FileManagerProps {
  serverName?: string
}

export function FileManager({ serverName = "default" }: FileManagerProps) {
  const {
    currentPath,
    files,
    loading,
    fetchDirectory,
    navigateUp,
    openFolder,
    deleteFile,
    downloadFile,
    refresh,
  } = useFileManager(serverName)

  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  useEffect(() => {
    fetchDirectory('/')
  }, [fetchDirectory])

  const handleFileClick = (fileName: string, fileType: string) => {
    if (fileType === 'directory') {
      openFolder(fileName)
    } else if (isEditableFile(fileName)) {
      // TODO: Открыть редактор файлов
      toast({
        title: "Редактирование файлов",
        description: `Функция редактирования ${fileName} будет добавлена`,
      })
    }
  }

  const handleDelete = async (filePath: string, fileName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить ${fileName}?`)) return

    try {
      const success = await deleteFile(filePath)
      if (success) {
        toast({
          title: "Успешно",
          description: `${fileName} удалён`,
        })
      } else {
        toast({
          title: "Ошибка",
          description: `Не удалось удалить ${fileName}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: `Произошла ошибка при удалении`,
        variant: "destructive",
      })
    }
  }

  const getBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(p => p)
    return [
      { name: serverName, path: '/' },
      ...parts.map((part, index) => ({
        name: part,
        path: '/' + parts.slice(0, index + 1).join('/') + '/'
      }))
    ]
  }

  return (
    <div className="p-6">
      <Card>
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Файловый менеджер</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-xl bg-transparent"
                title="Создать папку"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-xl bg-transparent"
                onClick={refresh}
                disabled={loading}
                title="Обновить"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-xl bg-transparent"
                onClick={navigateUp}
                disabled={currentPath === '/'}
                title="Вверх"
              >
                <FolderUp className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-xl bg-transparent"
                title="Загрузить файл"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <span>/</span>
            {getBreadcrumbs().map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                <button
                  onClick={() => fetchDirectory(crumb.path)}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.name}
                </button>
                {index < getBreadcrumbs().length - 1 && <span>/</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6">
          {loading && files.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Загрузка файлов...
            </div>
          ) : files.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Папка пуста
            </div>
          ) : (
            <div className="space-y-1">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-muted group"
                  onDoubleClick={() => handleFileClick(file.name, file.type)}
                >
                  <div className="flex items-center gap-3">
                    {file.type === "directory" ? (
                      <FolderOpen className="h-5 w-5 text-blue-500" />
                    ) : (
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(file.modify)}
                    </span>
                    <span className="text-sm text-muted-foreground w-20 text-right">
                      {humanizeFileSize(file.size)}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {file.type === 'file' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => downloadFile(file.path)}
                          title="Скачать"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(file.path, file.name)}
                        title="Удалить"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
