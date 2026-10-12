export interface AppNotification {
  id: number
  type: string
  title: string
  body: string
  data: Record<string, unknown> | null
  read_at: string | null
  created_at: string
}
