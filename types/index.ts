export interface User {
  id: string
  username: string
  display_name: string
  role: 'admin' | 'customer'
  created_at: string
}

export interface Upload {
  id: string
  user_id: string
  image_path: string
  comment: string | null
  created_at: string
  image_url?: string
}

export interface SessionPayload {
  id: string
  username: string
  displayName: string
  role: 'admin' | 'customer'
  iat?: number
  exp?: number
}

export interface CustomerBoard {
  id: string
  username: string
  display_name: string
  upload_count: number
  latest_image_path: string | null
}
