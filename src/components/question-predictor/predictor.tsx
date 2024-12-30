'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, X } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import CustomDropdownMenu from '@/components/ui/dropdown-menu'

interface Prediction {
  id: number | string
  question: string
  answer?: string
  confidence: number
}

export function QuestionPredictor() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [subjects, setSubjects] = useState<string[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('')

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('/api/subjects', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch subjects')
        }

        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }

        setSubjects(data.subjects)
      } catch (error) {
        console.error('Error fetching subjects:', error)
        setError('Failed to load subjects. Please try again.')
      }
    }

    fetchSubjects()
  }, [])

  // Progress simulation
  useEffect(() => {
    if (loading) {
      setProgress(0)
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer)
            return 100
          }
          // Slower progress between 70-90% to simulate model processing
          if (prev >= 70 && prev < 90) {
            return prev + 0.5
          }
          return prev + 2
        })
      }, 100)

      return () => {
        clearInterval(timer)
        setProgress(0)
      }
    }
  }, [loading])

  const handlePredict = async () => {
    if (!selectedSubject) {
      setError('Please select a subject before predicting.')
      return
    }

    setLoading(true)
    setPredictions([])
    setError('')
    
    try {
      const response = await fetch(`/api/random-question?subject=${encodeURIComponent(selectedSubject)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (!response.ok) {
        throw new Error('Failed to get random question')
      }
      
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Ensure progress reaches 100% before showing predictions
      setProgress(100)
      setTimeout(() => {
        setPredictions(data.predictions)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to get question. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Subject Selection with Dropdown Menu */}
      <div className="relative">
        <label className="text-base font-medium mb-2 block">Select the Subject</label>
        <CustomDropdownMenu 
          items={subjects} 
          selectedItem={selectedSubject} 
          onSelect={(subject) => setSelectedSubject(subject)} 
        />
      </div>

      {/* Preset Questions - Black Button Style */}
      <div className="space-y-2">
        <h3 className="text-base font-medium">Preset Questions</h3>
        <div className="space-y-2">
          <Button 
            className="w-full justify-start text-left bg-black hover:bg-gray-900 text-white py-6 rounded-xl text-base"
            onClick={handlePredict}
            disabled={loading || !selectedSubject}
          >
            <Calendar className="h-5 w-5 mr-3" />
            Predict Next Questions
          </Button>
        </div>
      </div>

      {/* Progress Bar - Simplified */}
      {loading && (
        <div className="space-y-3">
          <Progress value={progress} className="h-2 bg-gray-100" />
          <div className="text-sm text-center text-gray-500">
            {progress < 30 && "Loading model..."}
            {progress >= 30 && progress < 60 && "Analyzing previous questions..."}
            {progress >= 60 && progress < 90 && "Generating predictions..."}
            {progress >= 90 && "Finalizing results..."}
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}

      {/* Predictions - Updated Card Style */}
      {predictions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Predicted Questions:</h3>
          <div className="space-y-4">
            {predictions.map((pred) => (
              <div key={pred.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-medium">Question {pred.id}</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-1">{pred.confidence}%</span>
                    Confidence
                  </div>
                </div>
                <p className="text-base text-gray-700">{pred.question}</p>
                {pred.answer && (
                  <p className="mt-2 text-sm text-gray-600"><strong>Answer:</strong> {pred.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
