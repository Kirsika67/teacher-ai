import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiCall } from '../api/client'
import { useClasses } from '../context/ClassContext'
import Badge from '../components/Badge'

const statusLabels = { red: 'Järelevastamine', yellow: 'Tugi vajalik', green: 'Edasijõudnud', blue: 'Hea tase' }

function getStatus(grades) {
  if (!grades.length) return 'blue'
  const avg = grades.reduce((s, g) => s + Number(g.score), 0) / grades.length
  const sorted = [...grades].sort((a, b) => new Date(b.date) - new Date(a.date))
  if (sorted.length >= 3 && sorted.slice(0, 3).every(g => Number(g.score) < 50)) return 'red'
  if (avg < 60) return 'yellow'
  return 'blue'
}

export default function StudentDetailPage() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const { selectedClassId, selectedClass, loading: classesLoading } = useClasses()
  const [student, setStudent] = useState(null)
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [parentLetter, setParentLetter] = useState('')
  const [smsVersion, setSmsVersion] = useState('')

  useEffect(() => {
    if (classesLoading) return
    if (!selectedClassId) return
    loadStudent()
  }, [classesLoading, selectedClassId, studentId])

  const loadStudent = async () => {
    setLoading(true)
    try {
      const s = await apiCall(`/api/classes/${selectedClassId}/students/${studentId}/detail`)
      setStudent(s.student)
      setGrades(s.grades || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const runAI = async () => {
    if (!selectedClassId) return
    setAiLoading(true)
    try {
      const data = await apiCall(`/api/classes/${selectedClassId}/students/${studentId}/ai-analysis`, {
        method: 'POST',
      })
      setAiAnalysis(data.analysis || null)
      setParentLetter(data.analysis?.parentEmail || '')
    } catch (err) { console.error(err); alert('AI analüüs ebaõnnestus.') }
    finally { setAiLoading(false) }
  }

  if (classesLoading || loading) return <div className="p-8 text-gray-500">Laadin...</div>
  if (!student) return <div className="p-8 text-gray-500">Õpilast ei leitud.</div>

  const status = getStatus(grades)
  const topicMap = {}
  grades.forEach(g => {
    const topicName = g.topicName || g.topic_name || g.topic || 'Teema'
    if (!topicMap[topicName] || new Date(g.date) > new Date(topicMap[topicName].date)) topicMap[topicName] = { ...g, topicName }
  })
  const topics = Object.values(topicMap)

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('/opilased')}
        className="text-sm text-[#7F77DD] hover:underline mb-6 block">
        ← Tagasi õpilaste nimekirja
      </button>

      <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
      <p className="text-gray-500 text-sm mt-0.5">{selectedClass?.name} · {selectedClass?.subject}</p>
      <div className="mt-2 mb-8"><Badge variant={status}>{statusLabels[status]}</Badge></div>

      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Hinded teemade kaupa</h2>
        {!topics.length && <p className="text-sm text-gray-400">Hindeid pole veel sisestatud.</p>}
        <div className="grid grid-cols-2 gap-3">
          {topics.map((g, i) => (
            <div key={i} className="bg-white rounded-xl border border-black/10 p-4">
              <p className="text-sm font-bold text-gray-900 mb-1">{g.topicName}</p>
              <p className={`text-3xl font-bold mb-1 ${
                Number(g.score) < 50 ? 'text-[#E24B4A]' : Number(g.score) < 70 ? 'text-[#EF9F27]' : 'text-[#639922]'
              }`}>{g.score}%</p>
              <p className="text-xs text-gray-400">{new Date(g.date).toLocaleDateString('et-EE')}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-black/10 p-5 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">AI analüüs</h2>
        {!aiAnalysis && (
          <button onClick={runAI} disabled={aiLoading}
            className="bg-[#7F77DD] text-white text-sm rounded-lg px-5 py-2.5 hover:bg-[#534AB7] disabled:opacity-50">
            {aiLoading
              ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Analüüsin...</span>
              : 'Käivita AI analüüs'}
          </button>
        )}
        {aiAnalysis && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Põhiprobleem:</p>
              <p className="text-sm text-gray-700">{aiAnalysis.mainProblem}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">AI hüpotees:</p>
              <p className="text-sm text-gray-700">{aiAnalysis.hypothesis}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">4-nädalane plaan:</p>
              <div className="bg-[#EEEDFE] rounded-lg p-3">
                <p className="text-xs text-gray-700 whitespace-pre-wrap">{aiAnalysis.plan4Weeks}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Soovituslikud ülesanded:</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiAnalysis.suggestedTasks}</p>
            </div>
          </div>
        )}
      </div>

      {parentLetter && (
        <div className="bg-white rounded-xl border border-black/10 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Kiri lapsevanemale</h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-3">
            <p className="text-sm text-gray-700 italic">{parentLetter}</p>
          </div>
          <div className="flex gap-2">
            <button className="text-sm border border-[#AFA9EC] text-[#534AB7] rounded-lg px-4 py-2 hover:bg-[#EEEDFE]">
              Muuda kirja ↗
            </button>
            <button onClick={() => setSmsVersion(aiAnalysis?.parentSms || parentLetter.slice(0, 160))}
              className="text-sm border border-[#AFA9EC] text-[#534AB7] rounded-lg px-4 py-2 hover:bg-[#EEEDFE]">
              SMS versioon ↗
            </button>
          </div>
          {smsVersion && (
            <div className="mt-3 bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 mb-1">SMS (maks 160 tähemärki):</p>
              <p className="text-sm text-gray-700">{smsVersion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
