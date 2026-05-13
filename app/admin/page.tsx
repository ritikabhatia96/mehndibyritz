'use client'

import { useState, useEffect, FormEvent } from 'react'
import Link from 'next/link'

interface AdminUser {
  id: string
  username: string
  display_name: string
  role: 'admin' | 'customer'
  created_at: string
  upload_count: number
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

  // Create user form
  const [newDisplayName, setNewDisplayName] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState<'customer' | 'admin'>('customer')
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState('')
  const [creating, setCreating] = useState(false)

  // Reset password state per user id
  const [resetPasswords, setResetPasswords] = useState<Record<string, string>>({})
  const [resetSuccess, setResetSuccess] = useState<Record<string, string>>({})
  const [resetError, setResetError] = useState<Record<string, string>>({})
  const [resetting, setResetting] = useState<Record<string, boolean>>({})

  // Delete confirm state
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateUser(e: FormEvent) {
    e.preventDefault()
    setCreateError('')
    setCreateSuccess('')
    setCreating(true)

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          display_name: newDisplayName,
          password: newPassword,
          role: newRole,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setCreateError(data.error || 'Failed to create account.')
      } else {
        setCreateSuccess(`Account created for ${newDisplayName} (@${newUsername}).`)
        setNewDisplayName('')
        setNewUsername('')
        setNewPassword('')
        setNewRole('customer')
        await loadUsers()
        setTimeout(() => setCreateSuccess(''), 5000)
      }
    } catch {
      setCreateError('Network error. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  async function handleResetPassword(userId: string) {
    const newPw = resetPasswords[userId]
    if (!newPw || newPw.length < 8) {
      setResetError((prev) => ({ ...prev, [userId]: 'Password must be at least 8 characters.' }))
      return
    }

    setResetting((prev) => ({ ...prev, [userId]: true }))
    setResetError((prev) => ({ ...prev, [userId]: '' }))
    setResetSuccess((prev) => ({ ...prev, [userId]: '' }))

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPw }),
      })

      if (res.ok) {
        setResetSuccess((prev) => ({ ...prev, [userId]: 'Password reset successfully.' }))
        setResetPasswords((prev) => ({ ...prev, [userId]: '' }))
        setTimeout(() => setResetSuccess((prev) => ({ ...prev, [userId]: '' })), 4000)
      } else {
        const data = await res.json()
        setResetError((prev) => ({ ...prev, [userId]: data.error || 'Failed to reset password.' }))
      }
    } catch {
      setResetError((prev) => ({ ...prev, [userId]: 'Network error.' }))
    } finally {
      setResetting((prev) => ({ ...prev, [userId]: false }))
    }
  }

  async function handleDeleteUser(userId: string) {
    setDeleting(userId)
    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' })
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId))
        setDeleteConfirm(null)
      }
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Nav */}
      <nav className="bg-cream-50 border-b border-sage-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="font-script text-3xl text-henna-500 tracking-wide">
              Mehndibyritz
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sage-600 hover:text-sage-500 text-sm font-medium">
                Browse Boards
              </Link>
              <Link href="/my-folder" className="text-sage-600 hover:text-sage-500 text-sm font-medium">
                My Board
              </Link>
              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' })
                  window.location.href = '/login'
                }}
                className="text-sm bg-sage-100 hover:bg-sage-200 text-sage-700 px-4 py-1.5 rounded-full transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Header */}
        <div>
          <span className="inline-block bg-henna-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Admin Panel
          </span>
          <h1 className="font-playfair text-4xl font-bold text-henna-500">Manage Clients</h1>
          <p className="text-sage-400 mt-1 text-sm">
            Create accounts, reset passwords, and manage all clients
          </p>
        </div>

        {/* Add Client form */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage-100 p-6">
          <h2 className="font-playfair text-2xl font-semibold text-henna-500 mb-5">Add Client</h2>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-sage-600 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  required
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent bg-cream-50 text-gray-800 placeholder-sage-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-600 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                  required
                  placeholder="e.g. priya"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent bg-cream-50 text-gray-800 placeholder-sage-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-600 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent bg-cream-50 text-gray-800 placeholder-sage-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-600 mb-1.5">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'customer' | 'admin')}
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent bg-cream-50 text-gray-800 text-sm"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {createError && (
              <div className="bg-blush-50 border border-blush-200 text-blush-500 text-sm rounded-xl px-4 py-3">
                {createError}
              </div>
            )}
            {createSuccess && (
              <div className="bg-sage-50 border border-sage-200 text-sage-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {createSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2.5 bg-sage-500 hover:bg-sage-600 disabled:bg-sage-300 text-white font-semibold rounded-xl transition-colors shadow-sm text-sm flex items-center gap-2"
            >
              {creating ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        {/* All Clients table */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-sage-100">
            <h2 className="font-playfair text-2xl font-semibold text-henna-500">All Clients</h2>
            <p className="text-sage-400 text-sm mt-0.5">{users.length} accounts total</p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-sage-300 border-t-sage-500 rounded-full animate-spin mx-auto" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-sage-400">No clients yet.</div>
          ) : (
            <div className="divide-y divide-sage-50">
              {users.map((u) => (
                <div key={u.id} className="p-5">
                  {/* User info row */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800">{u.display_name}</span>
                        <span className="text-sage-400 text-sm">@{u.username}</span>
                        {u.role === 'admin' && (
                          <span className="text-xs bg-henna-500 text-white px-2 py-0.5 rounded-full font-medium">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-sage-400">
                          {u.upload_count} {u.upload_count === 1 ? 'upload' : 'uploads'}
                        </span>
                        <span className="text-xs text-sage-300">
                          Joined {new Date(u.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Delete button */}
                    {deleteConfirm === u.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blush-500">Are you sure?</span>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={deleting === u.id}
                          className="text-xs bg-blush-500 hover:bg-blush-400 text-white px-3 py-1.5 rounded-lg font-medium disabled:opacity-50"
                        >
                          {deleting === u.id ? 'Deleting...' : 'Yes, delete'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs text-sage-500 hover:text-sage-600 px-2 py-1.5"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(u.id)}
                        className="text-xs text-blush-400 hover:text-blush-500 border border-blush-200 hover:border-blush-300 px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {/* Reset password inline form */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <input
                      type="password"
                      value={resetPasswords[u.id] || ''}
                      onChange={(e) =>
                        setResetPasswords((prev) => ({ ...prev, [u.id]: e.target.value }))
                      }
                      placeholder="New password (min. 8 chars)"
                      className="flex-1 min-w-0 max-w-xs px-3 py-1.5 text-sm rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-300 bg-cream-50 text-gray-700 placeholder-sage-300"
                    />
                    <button
                      onClick={() => handleResetPassword(u.id)}
                      disabled={resetting[u.id]}
                      className="text-xs bg-sage-100 hover:bg-sage-200 text-sage-700 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {resetting[u.id] ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                  {resetError[u.id] && (
                    <p className="text-xs text-blush-500 mt-1">{resetError[u.id]}</p>
                  )}
                  {resetSuccess[u.id] && (
                    <p className="text-xs text-sage-500 mt-1">{resetSuccess[u.id]}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Setup note */}
        <div className="bg-cream-200 border border-henna-500/20 rounded-2xl p-5">
          <h3 className="font-semibold text-henna-500 text-sm mb-1">First-time Setup Note</h3>
          <p className="text-henna-600 text-xs leading-relaxed">
            To create the first admin account, run a SQL query directly in the Supabase SQL Editor.
            See <code className="bg-white/60 px-1 py-0.5 rounded text-xs">SETUP.md</code> for the exact command.
            After that, you can create additional accounts from this panel.
          </p>
        </div>
      </main>
    </div>
  )
}
