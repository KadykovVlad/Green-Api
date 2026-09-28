# MAX Chat — GREEN-API

Тестовое задание «Фронтенд разработчик React»: веб-чат для отправки и получения текстовых сообщений в MAX через [GREEN-API](https://green-api.com/max). Интерфейс сделан по мотивам [web.max.ru](https://web.max.ru/).

**Демо:** https://kadykovvlad.github.io/Green-Api/

## Возможности

- Вход по `idInstance` и `apiTokenInstance` (перед входом проверяется, что инстанс авторизован)
- Создание чата по номеру телефона получателя
- Отправка текста — [SendMessage](https://green-api.com/v3/docs/api/sending/SendMessage/)
- Получение входящих — [HTTP API](https://green-api.com/v3/docs/api/receiving/technology-http-api/) (`ReceiveNotification` + `DeleteNotification`, long polling)
- Чаты и данные входа сохраняются в `localStorage`, чтобы не терялись при перезагрузке

## Запуск локально

Нужен Node.js 18+.

```bash
git clone https://github.com/KadykovVlad/Green-Api.git
cd Green-Api
npm install
npm run dev
```

Открыть http://localhost:5173.

Сборка: `npm run build` (результат в `dist/`).

## Подготовка инстанса

1. В [личном кабинете GREEN-API](https://console.green-api.com/) создать инстанс MAX и авторизовать его по QR-коду.
2. Входящие уведомления получаются через HTTP API. В настройках инстанса (кнопка «Изменить» в ЛК) поле `webhookUrl` должно быть **пустым**, а «Получать уведомления о входящих сообщениях и файлах» (`incomingWebhook`) — **включено**. У нового инстанса все уведомления выключены, и без этого входящие не попадут в очередь.
3. Если хост API в кабинете отличается от `https://XXXX.api.greenapi.com` (XXXX — первые 4 цифры `idInstance`), укажите его в поле «API URL» на экране входа.

## Структура

```
src/
  api/greenApi.js         — запросы к GREEN-API
  hooks/useNotifications  — цикл получения уведомлений
  hooks/useLocalStorage   — состояние с сохранением в localStorage
  components/             — LoginForm, ChatList, ChatWindow, MessageBubble, MessageInput, Avatar
  utils/format.js         — форматирование номера, времени, инициалов
```

## Стек

React 18, Vite, axios, CSS Modules.
