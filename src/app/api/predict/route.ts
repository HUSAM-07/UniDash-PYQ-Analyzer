import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

export async function POST(): Promise<Response> {
  const pythonScript = path.join(process.cwd(), 'src', 'python', 'predict.py')
  const dataDir = path.join(process.cwd(), 'src', 'python', 'data')

  return new Promise((resolve) => {
    console.log('Spawning Python process...')
    const process = spawn('python', [
      pythonScript,
      '--data_dir', dataDir
    ])

    let output = ''
    let errorOutput = ''

    process.stdout.on('data', (data) => {
      output += data.toString()
    })

    process.stderr.on('data', (data) => {
      errorOutput += data.toString()
      console.error(`Python stderr: ${data}`)
    })

    process.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`)
        return resolve(NextResponse.json(
          { error: 'Failed to generate predictions' },
          { status: 500 }
        ))
      }

      try {
        const predictions = output
          .trim()
          .split('\n')
          .map((question, index) => ({
            id: index + 1,
            question: question.trim(),
            confidence: Math.round(Math.random() * 15 + 80)
          }))

        resolve(NextResponse.json({ predictions }))
      } catch (error) {
        console.error('Error parsing predictions:', error)
        resolve(NextResponse.json(
          { error: 'Failed to parse predictions' },
          { status: 500 }
        ))
      }
    })
  })
} 