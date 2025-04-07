# Инструкция по развертыванию проекта

## Подготовка проекта для продакшена

1. Соберите проект:
```bash
npm run build
```

После сборки в директории `dist` будут сгенерированы статические файлы.

## Настройка Docker

1. Отредактируйте файл `nginx/nginx.conf`, заменив `server_name _` на `server_name your-domain.com`.

## Запуск проекта в продакшене

```bash
# Запустите контейнеры
docker-compose up -d
```

## Обновление проекта

1. Остановите контейнеры:
```bash
docker-compose down
```

2. Соберите новую версию проекта:
```bash
npm run build
```

3. Запустите контейнеры снова:
```bash
docker-compose up -d
```

## Проверка статуса и логов

```bash
# Проверка статуса контейнеров
docker-compose ps

# Просмотр логов Nginx
docker-compose logs nginx
``` 