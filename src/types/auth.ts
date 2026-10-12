export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  roles: string[]
  created_at: string
}

export interface AuthSession {
  user: User
  token: string
  token_type: string
}

export interface LoginPayload {
  email: string
  password: string
  device_name?: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
  device_name?: string
}

export interface UpdateProfilePayload {
  name?: string
  email?: string
}
