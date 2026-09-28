import { useState } from 'react'
import createClient, { getDefaultApiUrl } from '../../api/greenApi'
import styles from './LoginForm.module.css'

/**
 * Экран входа: idInstance + apiTokenInstance из ЛК GREEN-API.
 * Перед входом проверяем, что инстанс существует и авторизован в MAX.
 */
function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ idInstance: '', apiTokenInstance: '', apiUrl: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value.trim() })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { stateInstance } = await createClient(form).getStateInstance()
      if (stateInstance === 'authorized') {
        onLogin(form)
      } else {
        setError(`Инстанс не авторизован (статус: ${stateInstance})`)
      }
    } catch {
      setError(
        'Не удалось подключиться. Проверьте idInstance, apiTokenInstance и API URL'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Вход в MAX</h1>
          <p className={styles.subtitle}>Данные инстанса из личного кабинета GREEN-API</p>
        </div>

        <label className={styles.label}>
          idInstance
          <input
            className="field"
            name="idInstance"
            value={form.idInstance}
            onChange={handleChange}
            inputMode="numeric"
            placeholder="3100123456"
            required
          />
        </label>

        <label className={styles.label}>
          apiTokenInstance
          <input
            className="field"
            name="apiTokenInstance"
            type="password"
            value={form.apiTokenInstance}
            onChange={handleChange}
            required
          />
        </label>

        <label className={styles.label}>
          API URL (необязательно)
          <input
            className="field"
            name="apiUrl"
            value={form.apiUrl}
            onChange={handleChange}
            placeholder={
              form.idInstance ? getDefaultApiUrl(form.idInstance) : 'https://…'
            }
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? 'Проверяем…' : 'Войти'}
        </button>
      </form>
    </div>
  )
}

export default LoginForm
