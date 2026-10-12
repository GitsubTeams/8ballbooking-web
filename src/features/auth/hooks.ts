import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import * as authApi from '@/features/auth/api'
import { getErrorMessage } from '@/lib/errors'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/stores/toast'
import type { LoginPayload, RegisterPayload, UpdateProfilePayload } from '@/types/auth'

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (session) => {
      setSession(session.token, session.user)
      toast.success('Berhasil masuk.')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (session) => {
      setSession(session.token, session.user)
      toast.success('Akun berhasil dibuat.')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useMe(enabled = true) {
  const token = useAuthStore((state) => state.token)
  const setUser = useAuthStore((state) => state.setUser)

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const user = await authApi.fetchMe()
      setUser(user)
      return user
    },
    enabled: enabled && Boolean(token),
  })
}

export function useUpdateProfile() {
  const setUser = useAuthStore((state) => state.setUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => authApi.updateProfile(payload),
    onSuccess: (user) => {
      setUser(user)
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      toast.success('Profil tersimpan.')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (payload: {
      current_password: string
      password: string
      password_confirmation: string
    }) => authApi.updatePassword(payload),
    onSuccess: () => toast.success('Password berhasil diubah.'),
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useLogout() {
  const clear = useAuthStore((state) => state.clear)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clear()
      queryClient.clear()
      navigate('/login')
    },
  })
}
