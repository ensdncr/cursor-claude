'use client'

import { useState, useEffect } from 'react'
import UploadSection from './UploadSection'
import CatalogList from './CatalogList'

interface Stats {
  activeCatalogs: number
  totalProducts: number
  expiringThisWeek: number
}

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'catalogs'>('dashboard')
  const [stats, setStats] = useState<Stats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch {
      console.error('Stats fetch error')
    } finally {
      setLoadingStats(false)
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'upload', label: 'Yükle & Çıkar', icon: '📤' },
    { id: 'catalogs', label: 'Kataloglar', icon: '📚' },
  ] as const

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top nav */}
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">AT</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Admin Paneli</p>
              <p className="text-gray-400 text-xs">Aktüel Takip</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1"
          >
            <span>Çıkış</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Dashboard tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Genel Bakış</h2>

            {loadingStats ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-800 rounded-2xl p-6 animate-pulse">
                    <div className="h-4 bg-gray-700 rounded mb-2 w-24" />
                    <div className="h-8 bg-gray-700 rounded w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard
                  icon="📂"
                  label="Aktif Katalog"
                  value={stats?.activeCatalogs ?? 0}
                  color="text-blue-400"
                />
                <StatCard
                  icon="🛒"
                  label="Toplam Ürün"
                  value={stats?.totalProducts ?? 0}
                  color="text-green-400"
                />
                <StatCard
                  icon="⏰"
                  label="Bu Hafta Bitiyor"
                  value={stats?.expiringThisWeek ?? 0}
                  color="text-orange-400"
                />
              </div>
            )}

            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-200 mb-3">Hızlı Erişim</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab('upload')}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm"
                >
                  📤 Yeni Katalog Yükle
                </button>
                <button
                  onClick={() => setActiveTab('catalogs')}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm"
                >
                  📚 Katalogları Görüntüle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload tab */}
        {activeTab === 'upload' && (
          <UploadSection onSuccess={fetchStats} />
        )}

        {/* Catalogs tab */}
        {activeTab === 'catalogs' && (
          <CatalogList onUpdate={fetchStats} />
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <p className="text-gray-400 text-sm mb-1">{icon} {label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value.toLocaleString('tr-TR')}</p>
    </div>
  )
}
