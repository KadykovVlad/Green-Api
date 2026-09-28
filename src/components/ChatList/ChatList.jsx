import { useState } from 'react'
import Avatar from '../Avatar/Avatar'
import { formatTime, normalizePhone } from '../../utils/format'
import styles from './ChatList.module.css'

/**
 * Левая колонка: создание чата по номеру + список чатов.
 */
function ChatList({ chats, activeChatId, onSelectChat, onCreateChat, onLogout }) {
  const [phone, setPhone] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const normalized = normalizePhone(phone)
    // Минимальная проверка длины, формат номера проверит сам API
    if (normalized.length < 10) return
    onCreateChat(normalized)
    setPhone('')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Чаты</h2>
        <button
          className="icon-button"
          onClick={onLogout}
          aria-label="Выйти"
          title="Выйти"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
        </button>
      </div>

      <form className={styles.newChat} onSubmit={handleSubmit}>
        <label htmlFor="phone" className="visually-hidden">
          Номер телефона получателя
        </label>
        <input
          id="phone"
          className={`field ${styles.phoneInput}`}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Номер, например 79991234567"
        />
        <button
          className="icon-button icon-button--primary"
          type="submit"
          aria-label="Создать чат"
          disabled={normalizePhone(phone).length < 10}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        </button>
      </form>

      <ul className={styles.list}>
        {chats.length === 0 && (
          <li className={styles.empty}>Введите номер получателя, чтобы начать чат</li>
        )}

        {chats.map((chat) => {
          const last = chat.messages.at(-1)
          return (
            <li key={chat.id}>
              <button
                className={`${styles.item} ${chat.id === activeChatId ? styles.active : ''}`}
                onClick={() => onSelectChat(chat.id)}
              >
                <Avatar id={chat.id} name={chat.name} size={48} />
                <div className={styles.info}>
                  <div className={styles.row}>
                    <span className={styles.name}>{chat.name}</span>
                    {last && <span className={styles.time}>{formatTime(last.time)}</span>}
                  </div>
                  <span className={styles.preview}>
                    {last ? `${last.out ? 'Вы: ' : ''}${last.text}` : 'Нет сообщений'}
                  </span>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default ChatList
