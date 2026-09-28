import axios from 'axios'

// Хост берём из ЛК; если не указан — собираем по первым 4 цифрам idInstance
export const getDefaultApiUrl = (idInstance) =>
  `https://${String(idInstance).slice(0, 4)}.api.green-api.com`

const createClient = ({ apiUrl, idInstance, apiTokenInstance }) => {
  const base = `${apiUrl || getDefaultApiUrl(idInstance)}/waInstance${idInstance}`
  const url = (method, suffix = '') => `${base}/${method}/${apiTokenInstance}${suffix}`

  return {
    getStateInstance: () => axios.get(url('getStateInstance')).then((r) => r.data),

    sendMessage: (chatId, message) =>
      axios.post(url('sendMessage'), { chatId, message }).then((r) => r.data),

    // Long polling: сервер держит запрос до receiveTimeout сек., если очередь пуста — вернёт null
    receiveNotification: (signal) =>
      axios
        .get(url('receiveNotification'), { params: { receiveTimeout: 20 }, signal })
        .then((r) => r.data),

    deleteNotification: (receiptId) =>
      axios.delete(url('deleteNotification', `/${receiptId}`)).then((r) => r.data),
  }
}

export default createClient
