import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/ulevaade', label: 'Ülevaade' },
  { to: '/opilased', label: 'Õpilased' },
  { to: '/hinded', label: 'Hinded' },
  { to: '/klassid', label: 'Klassid' },
  { to: '/materjalid', label: 'Materjalid' },
  { to: '/tagasiside', label: 'Tagasiside' },
  { to: '/planeerimine', label: 'Planeerimine' },
]

export default function TopNav() {
  return (
    <nav className="bg-white border-b border-black/10 px-8 py-3 flex gap-2 flex-shrink-0">
      {tabs.map(tab => (
        <NavLink key={tab.to} to={tab.to}
          className={({ isActive }) =>
            `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isActive ? 'bg-[#7F77DD] text-white' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
