import { useCallback, useMemo, useState } from 'react'
import LoginForm from './components/LoginForm/LoginForm'
import ChatList from './components/ChatList/ChatList'
import ChatWindow from './components/ChatWindow/ChatWindow'
import createClient from './api/greenApi'
import useLocalStorage from './hooks/useLocalStorage'
import useNotifications from './hooks/useNotifications'
import styles from './App.module.css'

function App() {
  const [credentials, setCredentials] = useLocalStorage('credentials', null)

  if (!credentials) {
    return <LoginForm onLogin={setCredentials} />
  }

  // key — чтобы при смене инстанса состояние чатов сбрасывалось
  return (
    <Messenger
      key={credentials.idInstance}
      credentials={credentials}
      onLogout={() => setCredentials(null)}
    />
  )
}

/**
 * Чат: { id, chatId, name, messages: [{ id, text, out, time }] }
 * id — номер телефона, chatId — то, что уходит в sendMessage
 */
function Messenger({ credentials, onLogout }) {
  const api = useMemo(() => createClient(credentials), [credentials])
  const [chats, setChats] = useLocalStorage(`chats_${credentials.idInstance}`, [])
  const [activeChatId, setActiveChatId] = useState(null)

  const activeChat = chats.find((chat) => chat.id === activeChatId)

  // Добавляет сообщение в чат (создаёт чат, если его нет) и поднимает чат наверх
  const addMessage = useCallback(
    (chatInfo, message) => {
      setChats((prev) => {
        const chat = prev.find((c) => c.id === chatInfo.id) ?? {
          ...chatInfo,
          messages: [],
        }
        if (chat.messages.some((m) => m.id === message.id)) return prev

        const updated = { ...chat, messages: [...chat.messages, message] }
        return [updated, ...prev.filter((c) => c.id !== chat.id)]
      })
    },
    [setChats]
  )

  const handleCreateChat = (phone) => {
    if (!chats.some((c) => c.id === phone)) {
      setChats((prev) => [
        { id: phone, chatId: `${phone}@c.us`, name: `+${phone}`, messages: [] },
        ...prev,
      ])
    }
    setActiveChatId(phone)
  }

  const handleSend = async (text) => {
    const { idMessage } = await api.sendMessage(activeChat.chatId, text)
    addMessage(activeChat, { id: idMessage, text, out: true, time: Date.now() })
  }

  // Нам нужны только входящие текстовые сообщения из личных чатов
  useNotifications(api, (body) => {
    if (body?.typeWebhook !== 'incomingMessageReceived') return

    const { senderData, messageData, idMessage, timestamp } = body
    if (senderData.chatType === 'group') return

    const text =
      messageData.textMessageData?.textMessage ??
      messageData.extendedTextMessageData?.text
    if (!text) return

    // В MAX chatId — внутренний id пользователя, поэтому сопоставляем чат по номеру
    const phone = senderData.senderPhoneNumber && String(senderData.senderPhoneNumber)
    addMessage(
      {
        id: phone ?? senderData.chatId,
        chatId: phone ? `${phone}@c.us` : senderData.chatId,
        name: senderData.senderContactName || senderData.senderName || `+${phone}`,
      },
      { id: idMessage, text, out: false, time: timestamp * 1000 }
    )
  })

  return (
    <div className={styles.layout}>
      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onCreateChat={handleCreateChat}
        onLogout={onLogout}
      />
      <ChatWindow chat={activeChat} onSend={handleSend} />
    </div>
  )
}

export default App
