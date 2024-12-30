import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const subject = url.searchParams.get('subject')

    const dataPath = path.join(process.cwd(), 'src', 'python', 'data', 'processed_data.json')
    const jsonData = fs.readFileSync(dataPath, 'utf-8')
    const questions = JSON.parse(jsonData)

    // Filter questions by subject if provided
    const filteredQuestions = subject
      ? questions.filter((q: any) => q.subject === subject)
      : questions

    if (filteredQuestions.length === 0) {
      return NextResponse.json(
        { error: 'No questions found for the selected subject.' },
        { status: 404 }
      )
    }

    // Get a random question from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length)
    const randomQuestion = filteredQuestions[randomIndex]

    // Format the response
    const formattedQuestion = {
      id: randomQuestion.id,
      question: randomQuestion.question,
      answer: randomQuestion.answer || "No answer available.",
      confidence: Math.round(Math.random() * 15 + 80) // Random confidence between 80-95%
    }

    return NextResponse.json({ predictions: [formattedQuestion] })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to get random question' },
      { status: 500 }
    )
  }
} 