'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function GeneratePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    subject: '',
    classLevel: '5',
    topic: '',
    type: 'worksheet',
    difficulty: 'medium',
    language: 'Estonian',
    length: 'medium',
    instructions: ''
  })

  const set = (k: string, v: string) => setForm(f => ({...f, [k]: v}))

  async function handleSubmit() {
    if (!form.subject || !form.topic) {
      alert('Palun täida aine ja teema väljad!')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.id) {
        router.push(`/material/${data.id}`)
      } else {
        alert('Viga: ' + (data.error || 'Tundmatu viga'))
      }
    } catch (e) {
      alert('Viga genereerimise ajal')
    }
    setLoading(false)
  }

  const typeLabels: Record<string, string> = {
    worksheet: '📄 Tööleht',
    test: '✅ Kontrolltöö',
    lesson_plan: '📚 Tunnikava',
    feedback: '💬 Tagasiside'
  }

  return (
    <main className="min-h-screen" style={{background: '#f8f9f6'}}>
      <nav style={{borderBottom: '1px solid #e8ebe4', background: 'white'}} className="px-8 py-4 flex items-center justify-between">
        <Link href="/" style={{display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none'}}>
          <div style={{background: '#16a34a', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 3L2 8l10 5 10-5-10-5zM2 16l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{fontFamily: 'var(--font-display)', fontSize: 18, color: '#1a1a1a'}}>Teacher AI</span>
        </Link>
        <Link href="/dashboard" style={{color: '#555', fontSize: 14, textDecoration: 'none'}}>Salvestatud materjalid</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-12">
        <h1 style={{fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 8}}>Loo uus materjal</h1>
        <p style={{color: '#666', marginBottom: 32, fontSize: 15}}>Täida väljad ja AI genereerib materjali sekunditega.</p>

        <div style={{background: 'white', borderRadius: 16, padding: 32, border: '1px solid #e8ebe4', display: 'flex', flexDirection: 'column', gap: 20}}>
          
          {/* Type selector */}
          <div>
            <label style={{fontSize: 13, fontWeight: 500, color: '#333', display: 'block', marginBottom: 8}}>Materjali tüüp</label>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
              {Object.entries(typeLabels).map(([val, label]) => (
                <button key={val} onClick={() => set('type', val)}
                  style={{
                    padding: '10px 16px', borderRadius: 8, fontSize: 14, cursor: 'pointer', textAlign: 'left',
                    border: form.type === val ? '2px solid #16a34a' : '1px solid #e8ebe4',
                    background: form.type === val ? '#dcfce7' : 'white',
                    color: form.type === val ? '#14532d' : '#333',
                    fontWeight: form.type === val ? 500 : 400
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject + Class */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr auto', gap: 12}}>
            <div>
              <label style={{fontSize: 13, fontWeight: 500, color: '#333', display: 'block', marginBottom: 6}}>Aine *</label>
              <input value={form.subject} onChange={e => set('subject', e.target.value)}
                placeholder="nt. Matemaatika, Eesti keel..."
                style={{width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e8ebe4', fontSize: 14, outline: 'none', fontFamily: 'inherit'}}/>
            </div>
            <div>
              <label style={{fontSize: 13, fontWeight: 500, color: '#333', display: 'block', marginBottom: 6}}>Klass</label>
              <select value={form.classLevel} onChange={e => set('classLevel', e.target.value)}
                style={{padding: '10px 14px', borderRadius: 8, border: '1px solid #e8ebe4', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'white', cursor: 'pointer'}}>
                {Array.from({length: 12}, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n}. klass</option>
                ))}
              </select>
            </div>
          </div>

          {/* Topic */}
          <div>
            <label style={{fontSize: 13, fontWeight: 500, color: '#333', display: 'block', marginBottom: 6}}>Teema *</label>
            <input value={form.topic} onChange={e => set('topic', e.target.value)}
              placeholder="nt. Murdarvud, liitmine ja lahutamine..."
              style={{width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e8ebe4', fontSize: 14, outline: 'none', fontFamily: 'inherit'}}/>
          </div>

          {/* Difficulty + Language + Length */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12}}>
            <div>
              <label style={{fontSize: 13, fontWeight: 500, color: '#333', display: 'block', marginBottom: 6}}>Raskus</label>
              <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)}
                style={{width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e8ebe4', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'white', cursor: 'pointer'}}>
                <option value="easy">Lihtne</option>
                <option value="medium">Keskmine</option>
                <option value="hard">Raske</option>
              </select>
            </div>
            <div>
              <label style={{fontSize: 13, fontWeight: 500, color: '#333', display: 'block', marginBottom: 6}}>Keel</label>
              <select value={form.language} onChange={e => set('language', e.target.value)}
                style={{width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e8ebe4', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'white', cursor: 'pointer'}}>
                <option value="Estonian">Eesti</option>
                <option value="English">Inglise</option>
                <option value="Russian">Vene</option>
              </select>
            </div>
            <div>
              <label style={{fontSize: 13, fontWeight: 500, color: '#333', display: 'block', marginBottom: 6}}>Pikkus</label>
              <select value={form.length} onChange={e => set('length', e.target.value)}
                style={{width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e8ebe4', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'white', cursor: 'pointer'}}>
                <option value="short">Lühike</option>
                <option value="medium">Keskmine</option>
                <option value="detailed">Pikk</option>
              </select>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label style={{fontSize: 13, fontWeight: 500, color: '#333', display: 'block', marginBottom: 6}}>Lisajuhised <span style={{color: '#999', fontWeight: 400}}>(valikuline)</span></label>
            <textarea value={form.instructions} onChange={e => set('instructions', e.target.value)}
              placeholder="nt. Lisa pildid, tee grupitöö variant, fookus sõnavara harjutamisel..."
              rows={3}
              style={{width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e8ebe4', fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'vertical'}}/>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading}
            style={{
              background: loading ? '#86efac' : '#16a34a',
              color: 'white', padding: '14px', borderRadius: 10,
              fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none', transition: 'all 0.2s'
            }}>
            {loading ? '⏳ Genereerin...' : '✨ Genereeri materjal'}
          </button>
        </div>
      </div>
    </main>
  )
}
