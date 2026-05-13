'use client'

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react'
import Link from 'next/link'
import ImageCard from '@/components/ImageCard'
import ImageLightbox from '@/components/ImageLightbox'
import NavBar from '@/components/NavBar'
import type { Upload } from '@/types'

interface SessionUser {
  id: string
  username: string
  displayName: string
  role: 'admin' | 'customer'
}

export default function MyFolderPage() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [uploads, setUploads] = useState<Upload[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [comment, setComment] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch('/api/auth/me')
        if (!meRes.ok) return

        const meData = await meRes.json()
        setUser(meData)

        const folderResponse = await fetch(`/api/folders/${meData.username}`)
        if (folderResponse.ok) {
          const folderData = await folderResponse.json()
          setUploads(folderData.uploads || [])
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  function handleFileChange(file: File) {
    setSelectedFile(file)
    setUploadError('')
    setUploadSuccess(false)

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  function onFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFileChange(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file)
    }
  }

  function clearSelection() {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleUpload(e: FormEvent) {
    e.preventDefault()
    if (!selectedFile) {
      setUploadError('Please select an image to upload.')
      return
    }

    setUploading(true)
    setUploadError('')
    setUploadSuccess(false)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('comment', comment)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setUploadError(data.error || 'Upload failed. Please try again.')
      } else {
        setUploadSuccess(true)
        setComment('')
        clearSelection()
        // Add new upload to top of list
        setUploads((prev) => [data.upload, ...prev])

        setTimeout(() => setUploadSuccess(false), 4000)
      }
    } catch {
      setUploadError('Network error. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-sage-300 border-t-sage-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sage-400">Loading your board...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {user && (
        <NavBar
          username={user.username}
          displayName={user.displayName}
          role={user.role}
        />
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-playfair text-4xl font-bold text-henna-500 mb-1">
            My Board
          </h1>
          <p className="text-sage-400 text-sm">Share your mehndi inspo pictures here</p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-sage-200" />
          <span className="text-henna-500 font-semibold text-lg">Your Uploads</span>
          <div className="flex-1 h-px bg-sage-200" />
        </div>

        {/* Uploads grid */}
        {uploads.length === 0 ? (
          <div className="text-center py-16">
            {/* Henna flower SVG */}
            <div className="flex justify-center mb-4 opacity-30">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <g key={i} transform={`rotate(${angle} 40 40)`}>
                    <ellipse cx="40" cy="18" rx="7" ry="18" fill="#8B4513" />
                  </g>
                ))}
                <circle cx="40" cy="40" r="10" fill="#638c59" />
                <circle cx="40" cy="40" r="5" fill="#fdf8f0" />
              </svg>
            </div>
            <p className="text-sage-400 font-medium text-lg mb-1">No uploads yet</p>
            <p className="text-sage-300 text-sm">Share your first inspiration photo below!</p>
          </div>
        ) : (
          <>
            <p className="text-sage-400 text-sm mb-5">
              {uploads.length} {uploads.length === 1 ? 'photo' : 'photos'} uploaded
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploads.map((upload) => (
                <ImageCard
                  key={upload.id}
                  upload={upload}
                  onImageClick={setSelectedUpload}
                />
              ))}
            </div>
          </>
        )}

        {/* Upload section */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage-100 p-6 mt-10">
          <p className="text-xl font-semibold text-henna-500 mb-5">
            Upload Inspiration Photo
          </p>

          <form onSubmit={handleUpload} className="space-y-5">
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-sage-400 bg-sage-50'
                  : selectedFile
                  ? 'border-sage-300 bg-sage-50'
                  : 'border-sage-200 hover:border-sage-300 hover:bg-cream-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileInputChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-xl object-contain shadow-sm"
                  />
                  <p className="text-sm text-sage-500 font-medium">{selectedFile?.name}</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); clearSelection() }}
                    className="text-xs text-blush-500 hover:text-blush-600 underline"
                  >
                    Remove and choose another
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <svg className="w-12 h-12 text-sage-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sage-500 font-medium">
                      {isDragging ? 'Drop your photo here!' : 'Upload Inspiration Photo'}
                    </p>
                    <p className="text-sage-400 text-sm mt-1">
                      Drag & drop or <span className="text-sage-500 font-medium underline">click to browse</span>
                    </p>
                    <p className="text-sage-300 text-xs mt-1">JPEG, PNG, WebP, GIF up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Comment textarea */}
            <div>
              <label className="block text-sm font-medium text-sage-600 mb-1.5">
                Add a note for Ritz
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent bg-cream-50 text-gray-800 placeholder-sage-300 resize-none transition-shadow text-sm"
              />
            </div>

            {/* Error / success messages */}
            {uploadError && (
              <div className="bg-blush-50 border border-blush-200 text-blush-500 text-sm rounded-xl px-4 py-3">
                {uploadError}
              </div>
            )}
            {uploadSuccess && (
              <div className="bg-sage-50 border border-sage-200 text-sage-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Photo uploaded successfully!
              </div>
            )}

            {/* Upload button */}
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="w-full py-3 px-6 bg-sage-500 hover:bg-sage-600 disabled:bg-sage-300 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Photo
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <ImageLightbox
        upload={selectedUpload}
        onClose={() => setSelectedUpload(null)}
        onDelete={(id) => setUploads((prev) => prev.filter((u) => u.id !== id))}
      />
    </div>
  )
}
