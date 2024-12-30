import { QuestionPredictor } from "@/components/question-predictor/predictor"
import MorphingText from "@/components/ui/morphing-text"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1 container max-w-3xl mx-auto py-12 px-4">
        <div className="space-y-8">
          {/* Title Section */}
          <div className="space-y-3 text-center">
            <MorphingText 
              texts={[
                "PYQ ANALYZER",
                "QUESTION PREDICTOR",
                "EXAM ASSISTANT"
              ]} 
              className="h-12 text-[32pt] lg:text-[48pt] text-gray-600"
            />
            <h1 className="text-5xl font-bold">Analyze & Predict Questions for Your Exams</h1>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-600"></div>
              <span>SELECT A SUBJECT</span>
            </div>
            <span>→</span>
            <span>ASK PRESET QUESTIONS</span>
            <span>→</span>
            <span>GET PREDICTIONS</span>
          </div>

          {/* Main Predictor Component */}
          <QuestionPredictor />
        </div>
      </main>
    </div>
  )
}
