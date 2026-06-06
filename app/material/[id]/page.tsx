'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  content: string
  created_at: string
  difficulty: string
  language: string
}

export default function MaterialPage({ params }: { params: { id: string } }) {
  const [material, setMaterial] = useState<Material | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.from('materials').select('*').eq('id', params.id).single().then(({ data }) => {
      setMaterial(data)
      setLoading(false)
    })
  }, [params.id])

  function copy() {
    if (material) {
      navigator.clipboard.writeText(material.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function deleteMaterial() {
    if (confirm('Kustuta see materjal?')) {
      await supabase.from('materials').delete().eq('id', params.id)
      router.push('/dashboard')
    }
  }

  const typeLabels: Record<string, string> = {
    worksheet: 'Tööleht', test: 'Kontrolltöö', lesson_plan: 'Tunnikava', feedback: 'Tagasiside'
  }

  if (loading) return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9f6'}}>
      <div style={{color: '#666'}}>Laadin...</div>
    </div>
  )

  if (!material) return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9f6'}}>
      <div>Materjali ei leitud. <Link href="/dashboard">Tagasi</Link></div>
    </div>
  )

  return (
    <main style={{minHeight: '100vh', background: '#f8f9f6'}}>
      <nav style={{borderBottom: '1px solid #e8ebe4', background: 'white'}} className="px-8 py-4 flex items-center justify-between">
        <Link href="/" style={{display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none'}}>
          <div style={{background: '#16a34a', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 3L2 8l10 5 10-5-10-5zM2 16l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{fontFamily: 'var(--font-display)', fontSize: 18, color: '#1a1a1a'}}>Teacher AI</span>
        </Link>
        <Link href="/dashboard" style={{color: '#555', fontSize: 14, textDecoration: 'none'}}>← Tagasi</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-10">
        {/* Header */}
        <div style={{marginBottom: 24}}>
          <div style={{display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap'}}>
            <span style={{background: '#dcfce7', color: '#16a34a', fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 100}}>
              {typeLabels[material.type] || material.type}
            </span>
            <span style={{background: '#f1f5f9', color: '#555', fontSize: 12, padding: '3px 10px', borderRadius: 100}}>
              {material.subject}
            </span>
            <span style={{background: '#f1f5f9', color: '#555', fontSize: 12, padding: '3px 10px', borderRadius: 100}}>
              {material.class_level}. klass
            </span>
          </div>
          <h1 style={{fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 4}}>{material.topic}</h1>
          <p style={{color: '#888', fontSize: 13}}>{new Date(material.created_at).toLocaleDateString('et-EE')}</p>
        </div>

        {/* Actions */}
        <div style={{display: 'flex', gap: 8, marginBottom: 24}}>
          <button onClick={copy}
            style={{background: copied ? '#dcfce7' : 'white', color: copied ? '#16a34a' : '#333', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', border: '1px solid #e8ebe4'}}>
            {copied ? '✓ Kopeeritud!' : '📋 Kopeeri'}
          </button>
          <Link href="/generate"
            style={{background: '#16a34a', color: 'white', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none', display: 'inline-block'}}>
            ✨ Loo uus
          </Link>
          <button onClick={deleteMaterial}
            style={{background: 'white', color: '#dc2626', padding: '8px 18px', borderRadius: 8, fontSize: 14, cursor: 'pointer', border: '1px solid #fecaca', marginLeft: 'auto'}}>
            Kustuta
          </button>
        </div>

        {/* Content */}
        <div style={{background: 'white', borderRadius: 16, padding: '32px', border: '1px solid #e8ebe4', whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: 15, color: '#1a1a1a'}}>
          {material.content}
        </div>
      </div>
    </main>
  )
}
