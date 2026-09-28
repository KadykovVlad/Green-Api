import { useState } from 'react'
import styles from './MessageInput.module.css'

function MessageInput({ onSend }) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const message = text.trim()
    if (!message || sending) return

    setSending(true)
    setError('')
    try {
      await onSend(message)
      setText('')
    } catch {
      // Текст не очищаем, чтобы можно было отправить повторно
      setError('Не удалось отправить сообщение')
    } finally {
      setSending(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.row}>
        <label htmlFor="message" className="visually-hidden">
          Сообщение
        </label>
        <input
          id="message"
          className={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Сообщение"
          maxLength={4000}
          autoComplete="off"
          autoFocus
        />
        <button
          className={`icon-button icon-button--primary ${styles.send}`}
          type="submit"
          aria-label="Отправить"
          disabled={!text.trim() || sending}
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
            <path d="M22 2L11 13" />
            <path d="M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </form>
  )
}

export default MessageInput
