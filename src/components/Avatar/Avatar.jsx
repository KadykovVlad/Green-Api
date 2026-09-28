import { getAvatarColor, getInitials } from '../../utils/format'

// Круглая аватарка с инициалами — как в MAX, когда нет фото
function Avatar({ id, name, size }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: '50%',
        background: getAvatarColor(id),
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: size * 0.36,
      }}
    >
      {getInitials(name)}
    </div>
  )
}

export default Avatar
