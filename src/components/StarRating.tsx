interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'lg'
}

export default function StarRating({ value, onChange, size = 'sm' }: StarRatingProps) {
  const interactive = Boolean(onChange)

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(star)}
            aria-label={`${star} bintang`}
            className={`${size === 'lg' ? 'text-2xl' : 'text-base'} leading-none ${
              active ? 'text-amber-500' : 'text-slate-300'
            } ${interactive ? 'transition-colors hover:text-amber-400' : 'cursor-default'}`}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}
