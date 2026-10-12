import type { AuthSession, LoginPayload, RegisterPayload, UpdateProfilePayload, User } from '@/types/auth'
import { api } from '@/lib/axios'
import type { ApiEnvelope } from '@/types/api'

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const { data } = await api.post<ApiEnvelope<AuthSession>>('/auth/login', payload)
  return data.data
}

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  const { data } = await api.post<ApiEnvelope<AuthSession>>('/auth/register', payload)
  return data.data
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<ApiEnvelope<User>>('/auth/me')
  return data.data
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await api.patch<ApiEnvelope<User>>('/auth/profile', payload)
  return data.data
}

export async function updatePassword(payload: {
  current_password: string
  password: string
  password_confirmation: string
}): Promise<void> {
  await api.put('/auth/password', payload)
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}
