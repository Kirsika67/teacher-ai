import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Groq from 'groq-sdk'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!
})

export async function POST(req: NextRequest) {
  const { subject, classLevel, topic, type, difficulty, language, length, instructions } = await req.json()

  const typeMap: Record<string, string> = {
    worksheet: 'tööleht (worksheet)',
    test: 'kontrolltöö (test)',
    lesson_plan: 'tunnikava (lesson plan)',
    feedback: 'tagasiside juhend (feedback guide)'
  }

  const diffMap: Record<string, string> = {
    easy: 'lihtne',
    medium: 'keskmine',
    hard: 'raske'
  }

  const lengthMap: Record<string, string> = {
    short: 'lühike (5-6 ülesannet)',
    medium: 'keskmine (8-10 ülesannet)',
    detailed: 'pikk ja detailne (12+ ülesannet)'
  }

  const systemPrompt = `You are an expert school teacher and educational content creator with 20 years of experience. You create high-quality, structured, clear and practical teaching materials. Your materials are immediately usable in real classrooms. You write in a clear, pedagogically sound way.`

  const userPrompt = `Generate a ${typeMap[type] || type} for:

Subject: ${subject}
Class level: ${classLevel}. klass (grade ${classLevel})
Topic: ${topic}
Difficulty: ${diffMap[difficulty] || difficulty}
Language: ${language}
Length: ${lengthMap[length] || length}
${instructions ? `Additional instructions: ${instructions}` : ''}

Requirements:
- Write in ${language}
- Content must be appropriate and engaging for grade ${classLevel} students
- Use clear, structured formatting with sections and numbering
- Include student instructions at the top
- Make it ready to use immediately in a classroom
- Be specific and concrete, not vague
- Avoid filler content
- If it's a test, include an answer key at the end
- If it's a worksheet, include varied task types
- Format nicely with clear sections`

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })

    const content = completion.choices[0]?.message?.content || ''

    const { data, error } = await supabase
      .from('materials')
      .insert([{ subject, class_level: classLevel, topic, type, difficulty, language, length, instructions, content }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ id: data.id, content })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
