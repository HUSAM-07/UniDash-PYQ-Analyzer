import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'python', 'data', 'processed_data.json')
    const jsonData = fs.readFileSync(dataPath, 'utf-8')
    const questions = JSON.parse(jsonData)

    // Extract unique subjects and sort them
    const subjects = Array.from(new Set(questions.map((q: any) => q.subject)))
      .filter(Boolean) // Remove any null/undefined values
      .sort() // Sort alphabetically

    return NextResponse.json({ subjects })
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    )
  }
} 