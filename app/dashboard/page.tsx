'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Material {
  id: string
  subject: string
  class_level: string
  topic: string
  type: string
  created_at: string
}

export default function Dashboard() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('materials').select('id,subject,class_level,topic,type,created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setMaterials(data || [])
        setLoading(false)
      })
  }, [])

  const typeLabels: Record<string, string> = {
    worksheet: 'Tööleht', test: 'Kontrolltöö', lesson_plan: 'Tunnikava', feedback: 'Tagasiside'
  }

  const typeColors: Record<string, string> = {
    worksheet: '#dbeafe', test: '#dcfce7', lesson_plan: '#fef9c3', feedback: '#fce7f3'
  }

  const typeTextColors: Record<string, string> = {
    worksheet: '#1d4ed8', test: '#16a34a', lesson_plan: '#ca8a04', feedback: '#be185d'
  }

  return (
    <main style={{minHeight: '100vh', background: '#f8f9f6'}}>
      <nav style={{borderBottom: '1px solid #e8ebe4', background: 'white'}} className="px-8 py-4 flex items-center justify-between">
        <Link href="/" style={{display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none'}}>
          <div style={{background: '#16a34a', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 3L2 8l10 5 10-5-10-5zM2 16l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{fontFamily: 'var(--font-display)', fontSize: 18, color: '#1a1a1a'}}>Teacher AI</span>
        </Link>
        <Link href="/generate"
          style={{background: '#16a34a', color: 'white', padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none'}}>
          + Loo uus
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <div style={{marginBottom: 32}}>
          <h1 style={{fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 4}}>Salvestatud materjalid</h1>
          <p style={{color: '#666', fontSize: 15}}>{materials.length} materjali kokku</p>
        </div>

        {loading ? (
          <div style={{color: '#666', textAlign: 'center', padding: 60}}>Laadin...</div>
        ) : materials.length === 0 ? (
          <div style={{background: 'white', borderRadius: 16, padding: 60, textAlign: 'center', border: '1px solid #e8ebe4'}}>
            <div style={{fontSize: 40, marginBottom: 16}}>📚</div>
            <h2 style={{fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8}}>Materjale pole veel</h2>
            <p style={{color: '#666', marginBottom: 24}}>Loo oma esimene materjal AI abil</p>
            <Link href="/generate"
              style={{background: '#16a34a', color: 'white', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 500, textDecoration: 'none', display: 'inline-block'}}>
              Loo materjal
            </Link>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            {materials.map(m => (
              <Link key={m.id} href={`/material/${m.id}`} style={{textDecoration: 'none'}}>
                <div style={{background: 'white', borderRadius: 12, padding: '18px 24px', border: '1px solid #e8ebe4', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.15s', cursor: 'pointer'}}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#16a34a')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8ebe4')}>
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', gap: 8, marginBottom: 4, alignItems: 'center'}}>
                      <span style={{
                        background: typeColors[m.type] || '#f1f5f9',
                        color: typeTextColors[m.type] || '#555',
                        fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100
                      }}>
                        {typeLabels[m.type] || m.type}
                      </span>
                      <span style={{color: '#999', fontSize: 12}}>{m.subject} · {m.class_level}. klass</span>
                    </div>
                    <p style={{fontWeight: 500, fontSize: 15, color: '#1a1a1a'}}>{m.topic}</p>
                  </div>
                  <div style={{color: '#999', fontSize: 12, whiteSpace: 'nowrap'}}>
                    {new Date(m.created_at).toLocaleDateString('et-EE')}
                  </div>
                  <div style={{color: '#ccc', fontSize: 18}}>→</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
