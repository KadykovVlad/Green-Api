import { useEffect, useRef } from 'react'
import Avatar from '../Avatar/Avatar'
import MessageBubble from '../MessageBubble/MessageBubble'
import MessageInput from '../MessageInput/MessageInput'
import styles from './ChatWindow.module.css'

/**
 * Правая часть: шапка чата, лента сообщений, поле ввода.
 */
function ChatWindow({ chat, onSend }) {
  const bottomRef = useRef(null)

  // Прокручиваем вниз при новом сообщении или смене чата
  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [chat?.id, chat?.messages.length])

  if (!chat) {
    return (
      <main className={`${styles.window} ${styles.placeholder}`}>
        <p className={styles.hint}>Выберите чат или создайте новый</p>
      </main>
    )
  }

  return (
    <main className={styles.window}>
      <header className={styles.header}>
        <Avatar id={chat.id} name={chat.name} size={40} />
        <div className={styles.headerInfo}>
          <span className={styles.name}>{chat.name}</span>
          {chat.name !== `+${chat.id}` && (
            <span className={styles.phone}>+{chat.id}</span>
          )}
        </div>
      </header>

      <div className={styles.messages}>
        {chat.messages.length === 0 && <p className={styles.hint}>Сообщений пока нет</p>}
        {chat.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* key — сбрасываем черновик при переключении чата */}
      <MessageInput key={chat.id} onSend={onSend} />
    </main>
  )
}

export default ChatWindow
