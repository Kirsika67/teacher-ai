const variants = {
  red: 'bg-[#FCEBEB] text-[#A32D2D]',
  yellow: 'bg-[#FAEEDA] text-[#854F0B]',
  green: 'bg-[#EAF3DE] text-[#3B6D11]',
  blue: 'bg-[#E6F1FB] text-[#185FA5]',
  purple: 'bg-[#EEEDFE] text-[#534AB7]',
}

export default function Badge({ variant = 'blue', children, className = '' }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
