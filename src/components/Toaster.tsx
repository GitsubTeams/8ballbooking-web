import { useToastStore } from '@/stores/toast'

const styles: Record<string, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  info: 'border-slate-200 bg-white text-slate-800',
}

export default function Toaster() {
  const toasts = useToastStore((state) => state.toasts)
  const remove = useToastStore((state) => state.remove)

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => remove(item.id)}
          className={`rounded-md border px-4 py-3 text-left text-sm shadow-sm ${
            styles[item.type] ?? styles.info
          }`}
        >
          {item.message}
        </button>
      ))}
    </div>
  )
}
