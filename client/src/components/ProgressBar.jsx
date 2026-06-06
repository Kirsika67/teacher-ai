export default function ProgressBar({ value = 0, className = '' }) {
  const color = value < 50 ? 'bg-[#E24B4A]' : value < 70 ? 'bg-[#EF9F27]' : 'bg-[#639922]'
  return (
    <div className={`h-1.5 bg-gray-100 rounded-full overflow-hidden ${className}`}>
      <div className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}
