import { formatTime } from '../../utils/format'
import styles from './MessageBubble.module.css'

function MessageBubble({ message }) {
  return (
    <div className={`${styles.bubble} ${message.out ? styles.out : styles.in}`}>
      <span className={styles.text}>{message.text}</span>
      <time className={styles.time}>{formatTime(message.time)}</time>
    </div>
  )
}

export default MessageBubble
