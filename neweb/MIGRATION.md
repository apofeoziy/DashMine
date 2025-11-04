# Миграция с старого веб-фреймворка на новый

## Обзор

Функциональность из старого веб-приложения (`/web`) была перенесена в новый Next.js фреймворк (`/neweb`). Новый фреймворк использует современные технологии:

- **Next.js 16** - React фреймворк с SSR
- **TypeScript** - типизация для надежности кода
- **Tailwind CSS** - современные стили
- **Radix UI** - доступные UI компоненты

## Структура нового проекта

```
neweb/
├── app/                    # Next.js страницы и роутинг
│   ├── console/           # Страница консоли сервера
│   ├── files/             # Страница файлового менеджера
│   ├── plugins/           # Страница плагинов
│   └── ...
├── components/            # React компоненты
│   ├── ui/               # Базовые UI компоненты (Radix UI)
│   ├── console-content.tsx
│   ├── file-manager.tsx
│   ├── server-header.tsx
│   └── ...
├── hooks/                 # React хуки
│   ├── use-server.ts     # Хук для работы с сервером
│   ├── use-server-log.ts # Хук для логов
│   ├── use-hardware.ts   # Хук для мониторинга
│   └── use-file-manager.ts
├── lib/                   # Утилиты и API клиенты
│   ├── api-client.ts     # Базовый HTTP клиент
│   ├── servers-api.ts    # API для работы с серверами
│   ├── file-manager-api.ts
│   ├── hardware-api.ts
│   ├── plugins-api.ts
│   └── utils-extended.ts # Утилиты форматирования
└── contexts/              # React контексты
    └── server-context.tsx
```

## Соответствие старых и новых модулей

### JavaScript классы → TypeScript API классы

| Старый класс (web/js/classes/) | Новый модуль (neweb/lib/) |
|--------------------------------|---------------------------|
| `KubekRequests.js` | `api-client.ts` |
| `KubekServers.js` | `servers-api.ts` |
| `KubekFileManager.js` | `file-manager-api.ts` |
| `KubekHardware.js` | `hardware-api.ts` |
| `KubekPlugins.js` | `plugins-api.ts` |
| `KubekUtils.js` | `utils-extended.ts` |

### Утилиты

| Старая функция | Новая функция |
|----------------|---------------|
| `KubekUtils.humanizeFileSize()` | `humanizeFileSize()` |
| `KubekUtils.pathExt()` | `pathExt()` |
| `KubekUtils.pathFilename()` | `pathFilename()` |
| `KubekUtils.getProgressGradientColor()` | `getProgressGradientColor()` |

### Страницы

| Старая страница (web/pages/) | Новая страница (neweb/app/) |
|------------------------------|----------------------------|
| `console.html/js/css` | `console/page.tsx` |
| `fileManager.html/js/css` | `files/page.tsx` |
| `plugins.html/js/css` | `plugins/page.tsx` |
| `kubekSettings.html/js/css` | `kubek-settings/page.tsx` |

## Основные изменения

### 1. API клиент

**Было (jQuery AJAX):**
```javascript
KubekRequests.get("/servers", (servers) => {
    console.log(servers);
});
```

**Стало (async/await):**
```typescript
const servers = await ServersApi.getServersList();
console.log(servers);
```

### 2. React хуки вместо глобальных переменных

**Было:**
```javascript
let selectedServer = "";
KubekServers.getServerInfo(selectedServer, (info) => {
    // обработка
});
```

**Стало:**
```typescript
const { serverInfo, loading } = useServer(serverName);
// serverInfo обновляется автоматически
```

### 3. Компоненты вместо jQuery манипуляций

**Было:**
```javascript
$("#content").html("<div>...</div>");
```

**Стало:**
```tsx
<ConsoleContent serverName={serverName} />
```

## Новые возможности

### Автоматическое обновление данных

Хуки автоматически обновляют данные с заданным интервалом:

```typescript
// Логи обновляются каждую секунду
const { logEntries } = useServerLog(serverName, 1000);

// Метрики обновляются каждые 2 секунды
const { usage } = useHardware(serverName, 2000);
```

### Типизация TypeScript

Все данные имеют строгие типы:

```typescript
interface ServerInfo {
  name: string
  status: 'running' | 'stopped' | 'starting' | 'stopping'
  players?: {
    online: number
    max: number
  }
}
```

### Современный UI с Tailwind CSS

```tsx
<Card className="lg:col-span-2 flex flex-col">
  <div className="border-b border-border px-6 py-4">
    <h2 className="text-lg font-semibold">Консоль</h2>
  </div>
</Card>
```

## Примеры использования

### Работа с консолью

```typescript
import { useServerLog } from '@/hooks/use-server-log'
import { useServer } from '@/hooks/use-server'

function Console({ serverName }) {
  const { logEntries } = useServerLog(serverName)
  const { sendCommand } = useServer(serverName)
  
  const handleCommand = async (cmd: string) => {
    await sendCommand(cmd)
  }
  
  return (
    <div>
      {logEntries.map((log, i) => (
        <div key={i}>{log.text}</div>
      ))}
    </div>
  )
}
```

### Работа с файлами

```typescript
import { useFileManager } from '@/hooks/use-file-manager'

function FileManager({ serverName }) {
  const {
    files,
    currentPath,
    openFolder,
    deleteFile,
    downloadFile
  } = useFileManager(serverName)
  
  return (
    <div>
      {files.map(file => (
        <div onClick={() => file.type === 'directory' && openFolder(file.name)}>
          {file.name}
        </div>
      ))}
    </div>
  )
}
```

### Мониторинг ресурсов

```typescript
import { useHardware } from '@/hooks/use-hardware'
import { humanizeFileSize } from '@/lib/utils-extended'

function Monitor({ serverName }) {
  const { usage } = useHardware(serverName)
  
  return (
    <div>
      <div>CPU: {usage?.cpu}%</div>
      <div>RAM: {humanizeFileSize(usage?.ram.used)} / {humanizeFileSize(usage?.ram.total)}</div>
    </div>
  )
}
```

## Установка и запуск

1. Установите зависимости:
```bash
cd neweb
pnpm install
# или npm install
```

2. Запустите dev сервер:
```bash
pnpm dev
# или npm run dev
```

3. Откройте http://localhost:3000

## API Endpoints

Новый фреймворк использует те же API endpoints, что и старый:

- `GET /api/servers` - список серверов
- `GET /api/servers/:server/info` - информация о сервере
- `GET /api/servers/:server/log` - логи сервера
- `GET /api/servers/:server/send?cmd=...` - отправить команду
- `GET /api/fileManager/read?server=...&path=...` - список файлов
- `GET /api/hardware/usage` - использование ресурсов

## Что еще нужно сделать

- [ ] Добавить редактор файлов с подсветкой синтаксиса
- [ ] Реализовать систему уведомлений (toasts/alerts)
- [ ] Добавить поддержку темной/светлой темы
- [ ] Интегрировать страницу настроек
- [ ] Добавить систему задач (background tasks)
- [ ] Реализовать систему обновлений

## Поддержка

Если возникают вопросы по миграции, проверьте:
1. Соответствие API endpoints
2. Правильность передачи параметров сервера
3. TypeScript типы в консоли браузера

## Производительность

Новый фреймворк оптимизирован:
- Автоматическая очистка интервалов при размонтировании компонентов
- React Server Components для быстрой загрузки
- Оптимизация изображений и шрифтов
- Code splitting из коробки
