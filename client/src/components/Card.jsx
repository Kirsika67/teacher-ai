export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-[10px] border border-black/10 p-5 ${className}`}>
      {children}
    </div>
  )
}
