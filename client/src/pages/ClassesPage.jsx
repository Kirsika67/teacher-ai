import { useState, useEffect } from 'react'
import { useClasses } from '../context/ClassContext'
import { apiCall } from '../api/client'
import ProgressBar from '../components/ProgressBar'

export default function ClassesPage() {
  const { classes, loading: classesLoading } = useClasses()
  const [topicData, setTopicData] = useState({})
  const [loading, setLoading] = useState(false)
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    if (classesLoading) return
    if (!classes.length) return
    loadData()
  }, [classesLoading, classes])

  const loadData = async () => {
    setLoading(true)
    try {
      const result = []
      for (const cls of classes) {
        const g = await apiCall(`/api/classes/${cls.id}/grades`)
        const grades = g.grades || []
        const topicMap = {}
        grades.forEach(grade => {
          const topicName = grade.topic_name || grade.topicName || grade.topic || 'Teema'
          if (!topicMap[topicName]) topicMap[topicName] = []
          topicMap[topicName].push(Number(grade.score))
        })
        Object.entries(topicMap).forEach(([topic, scores]) => {
          result.push({ topic, className: cls.name, avg: Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) })
        })
      }
      const grouped = {}
      result.forEach(item => { if (!grouped[item.topic]) grouped[item.topic] = []; grouped[item.topic].push(item) })
      setTopicData(grouped)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const analyzeWeakness = async () => {
    setAiLoading(true)
    try {
      const entries = Object.entries(topicData)
      if (!entries.length) {
        setAiText('Analüüsi jaoks pole veel piisavalt hindeandmeid.')
        return
      }

      const weakestTopics = entries
        .map(([topic, classList]) => ({
          topic,
          avg: Math.round(classList.reduce((s, item) => s + Number(item.avg), 0) / classList.length),
        }))
        .sort((a, b) => a.avg - b.avg)
        .slice(0, 3)

      const text = weakestTopics.length
        ? `Suurim mahajäämus on teemades: ${weakestTopics.map(t => `${t.topic} (${t.avg}%)`).join(', ')}. Soovitus: korda neid teemasid esmalt nõrgemates klassides.`
        : 'AI analüüs pole hetkel saadaval.'
      setAiText(text)
    } catch {
      setAiText('AI analüüs pole hetkel saadaval.')
    }
    finally { setAiLoading(false) }
  }

  if (classesLoading) return <div className="p-8 text-gray-500">Laadin...</div>

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Klasside võrdlus</h1>
        <button onClick={analyzeWeakness} disabled={aiLoading}
          className="text-sm border border-[#AFA9EC] text-[#534AB7] rounded-lg px-4 py-2 hover:bg-[#EEEDFE] disabled:opacity-50">
          {aiLoading ? 'Analüüsin...' : 'Analüüsi mahajäämust ↗'}
        </button>
      </div>

      {aiText && <div className="bg-[#EEEDFE] rounded-xl p-5 mb-6"><p className="text-sm text-[#3C3489]">{aiText}</p></div>}
      {loading && <div className="text-gray-400 text-sm">Laadin andmeid...</div>}
      {!loading && !Object.keys(topicData).length && (
        <div className="bg-white rounded-xl border border-black/10 p-8 text-center text-gray-400">Hindeid pole veel sisestatud.</div>
      )}

      <div className="space-y-6">
        {Object.entries(topicData).map(([topic, classList]) => (
          <div key={topic} className="bg-white rounded-xl border border-black/10 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">{topic}</h2>
            <div className="space-y-3">
              {classList.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-sm text-gray-700 w-24 flex-shrink-0">{item.className}</span>
                  <div className="flex-1"><ProgressBar value={item.avg} /></div>
                  <span className={`text-sm font-bold w-12 text-right ${
                    item.avg < 50 ? 'text-[#E24B4A]' : item.avg < 70 ? 'text-[#EF9F27]' : 'text-[#639922]'
                  }`}>{item.avg}%</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
