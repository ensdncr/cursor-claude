'use client'

import { useState, useEffect } from 'react'
import AdminDashboard from './components/AdminDashboard'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Check if already authenticated
    const token = sessionStorage.getItem('admin-token')
    if (token) {
      verifyToken(token)
    } else {
      setChecking(false)
    }
  }, [])

  async function verifyToken(token: string) {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (res.ok) {
        setAuthenticated(true)
      } else {
        sessionStorage.removeItem('admin-token')
      }
    } catch {
      sessionStorage.removeItem('admin-token')
    } finally {
      setChecking(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (res.ok && data.token) {
        sessionStorage.setItem('admin-token', data.token)
        setAuthenticated(true)
      } else {
        setError('Hatalı şifre. Lütfen tekrar deneyin.')
      }
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('admin-token')
    setAuthenticated(false)
    setPassword('')
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-black text-xl">AT</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Paneli</h1>
            <p className="text-gray-400 text-sm mt-1">Aktüel Takip Yönetim Sistemi</p>
          </div>

          <form onSubmit={handleLogin} className="bg-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Şifresi
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-4 bg-red-900/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <AdminDashboard onLogout={handleLogout} />
}
