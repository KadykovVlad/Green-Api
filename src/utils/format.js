// Оставляем только цифры: "+7 (999) 123-45-67" -> "79991234567"
export const normalizePhone = (value) => value.replace(/\D/g, '')

export const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

// Инициалы для аватарки, для номера — первые две цифры
export const getInitials = (name) =>
  /^\+?\d/.test(name)
    ? normalizePhone(name).slice(0, 2)
    : name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

const AVATAR_COLORS = ['#7c9cff', '#f59e6b', '#5cc38f', '#c28bf0', '#f07b8c', '#4fb6d6']

export const getAvatarColor = (id) =>
  AVATAR_COLORS[
    [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % AVATAR_COLORS.length
  ]
