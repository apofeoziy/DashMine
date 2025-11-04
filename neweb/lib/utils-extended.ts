/**
 * Расширенные утилиты для работы с файлами, датами и форматированием
 * Аналог KubekUtils из старого фреймворка
 */

/**
 * Форматирует размер файла в человекочитаемый формат
 */
export function humanizeFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'Kb', 'Mb', 'Gb', 'Tb']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Получает расширение файла из пути
 */
export function pathExt(path: string): string {
  const parts = path.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
}

/**
 * Получает имя файла из пути
 */
export function pathFilename(path: string): string {
  const parts = path.split('/')
  return parts[parts.length - 1]
}

/**
 * Получает цвет градиента для прогресс-бара на основе значения
 */
export function getProgressGradientColor(value: number): string {
  if (value < 50) {
    return 'var(--chart-3)' // Зеленый
  } else if (value < 75) {
    return '#ff9800' // Оранжевый
  } else {
    return 'var(--destructive)' // Красный
  }
}

/**
 * Определяет язык подсветки синтаксиса по расширению файла
 */
export function getLanguageByExtension(ext: string): string {
  const languageMap: Record<string, string> = {
    txt: 'plaintext',
    log: 'plaintext',
    yml: 'yaml',
    yaml: 'yaml',
    xml: 'xml',
    css: 'css',
    js: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    jsx: 'javascript',
    json: 'json',
    properties: 'ini',
    cfg: 'ini',
    conf: 'ini',
    config: 'ini',
    sh: 'bash',
    bat: 'batch',
    md: 'markdown',
    html: 'html',
  }

  return languageMap[ext.toLowerCase()] || 'plaintext'
}

/**
 * Проверяет, является ли файл редактируемым
 */
export function isEditableFile(filename: string): boolean {
  const editableExtensions = [
    'txt',
    'log',
    'yml',
    'yaml',
    'xml',
    'cfg',
    'conf',
    'config',
    'json',
    'properties',
    'sh',
    'bat',
    'md',
    'js',
    'ts',
    'tsx',
    'jsx',
    'css',
    'html',
  ]

  const ext = pathExt(filename)
  return editableExtensions.includes(ext)
}

/**
 * Разбивает текст на чанки для загрузки
 */
export function splitIntoChunks(text: string, chunkSize = 500): string[] {
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize))
  }
  return chunks
}

/**
 * Форматирует дату в формат DD.MM.YYYY HH:mm:ss
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`
}
