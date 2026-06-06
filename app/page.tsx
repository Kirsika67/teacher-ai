'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen" style={{background: '#f8f9f6'}}>
      {/* Nav */}
      <nav style={{borderBottom: '1px solid #e8ebe4'}} className="bg-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div style={{background: '#16a34a', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 3L2 8l10 5 10-5-10-5zM2 16l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{fontFamily: 'var(--font-display)', fontSize: 18, color: '#1a1a1a'}}>Teacher AI</span>
        </div>
        <Link href="/generate" style={{background: '#16a34a', color: 'white', padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none'}}>
          Alusta →
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-8 pt-24 pb-16 max-w-4xl mx-auto text-center">
        <div style={{display: 'inline-block', background: '#dcfce7', color: '#16a34a', fontSize: 13, fontWeight: 500, padding: '4px 14px', borderRadius: 100, marginBottom: 24}}>
          AI õpetaja assistent
        </div>
        <h1 style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.1, color: '#1a1a1a', marginBottom: 24}}>
          Loo õppematerjale<br/>
          <em style={{color: '#16a34a'}}>sekunditega</em>
        </h1>
        <p style={{fontSize: 18, color: '#555', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7}}>
          Kirjuta teema ja klass — AI genereerib kohe töölehe, kontrolltöö või tagasiside. Valmis kasutamiseks.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/generate" style={{background: '#16a34a', color: 'white', padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 500, textDecoration: 'none', display: 'inline-block'}}>
            Genereeri materjal
          </Link>
          <Link href="/dashboard" style={{background: 'white', color: '#1a1a1a', padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 500, textDecoration: 'none', border: '1px solid #e8ebe4', display: 'inline-block'}}>
            Vaata salvestatud
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 pb-24 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {icon: '📄', title: 'Töölehted', desc: 'Struktureeritud ülesanded koos juhistega. Kohe printimiseks valmis.'},
            {icon: '✅', title: 'Kontrolltööd', desc: 'Küsimused vastustevõtmega. Valikvastused või avatud küsimused.'},
            {icon: '💬', title: 'Tagasiside', desc: 'Konstruktiivne ja konkreetne tagasiside õpilase töödele.'},
          ].map((f, i) => (
            <div key={i} style={{background: 'white', borderRadius: 12, padding: '24px', border: '1px solid #e8ebe4'}}>
              <div style={{fontSize: 28, marginBottom: 12}}>{f.icon}</div>
              <h3 style={{fontWeight: 600, fontSize: 16, marginBottom: 8}}>{f.title}</h3>
              <p style={{color: '#666', fontSize: 14, lineHeight: 1.6}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
