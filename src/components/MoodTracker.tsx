
import { useState } from 'react'
import { useMoodHistory } from '@/hooks/useMoodHistory'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Heart, TrendingUp, Calendar, MessageCircle } from 'lucide-react'

const moodEmojis = ['😢', '😕', '😐', '😊', '😄']
const moodLabels = ['Muito Ruim', 'Ruim', 'Neutro', 'Bom', 'Muito Bom']
const moodColors = ['#ef4444', '#f97316', '#fbbf24', '#22c55e', '#16a34a']

export function MoodTracker() {
  const { todayMood, recordMood, getMoodStats, loading } = useMoodHistory()
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const stats = getMoodStats()

  const handleMoodSelect = async (moodValue: number) => {
    setSelectedMood(moodValue)
    
    if (!showNotes) {
      // Registrar humor imediatamente se não há notas
      await handleRecordMood(moodValue, '')
    }
  }

  const handleRecordMood = async (moodValue: number, moodNotes: string) => {
    try {
      setIsRecording(true)
      await recordMood(moodValue, moodNotes)
      setSelectedMood(null)
      setNotes('')
      setShowNotes(false)
    } catch (error) {
      console.error('Erro ao registrar humor:', error)
    } finally {
      setIsRecording(false)
    }
  }

  const handleSubmitWithNotes = () => {
    if (selectedMood) {
      handleRecordMood(selectedMood, notes)
    }
  }

  if (loading) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <CardTitle className="text-lg">Como você está hoje?</CardTitle>
          </div>
          {stats && (
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
              Média: {stats.overall}/5
            </Badge>
          )}
        </div>
        <CardDescription>
          {todayMood 
            ? `Você registrou seu humor hoje: ${moodEmojis[todayMood.mood_value - 1]} ${moodLabels[todayMood.mood_value - 1]}`
            : 'Registre seu humor diário para acompanhar seu progresso emocional'
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!todayMood ? (
          <>
            {/* Seletor de Humor */}
            <div className="flex justify-center space-x-2">
              {moodEmojis.map((emoji, index) => {
                const moodValue = index + 1
                const isSelected = selectedMood === moodValue
                
                return (
                  <button
                    key={moodValue}
                    onClick={() => handleMoodSelect(moodValue)}
                    disabled={isRecording}
                    className={`
                      w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl
                      transition-all duration-200 hover:scale-110
                      ${isSelected 
                        ? 'border-indigo-500 bg-indigo-50 scale-110' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                      ${isRecording ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    title={moodLabels[index]}
                  >
                    {emoji}
                  </button>
                )
              })}
            </div>

            {/* Opção de adicionar notas */}
            <div className="text-center">
              <Dialog open={showNotes} onOpenChange={setShowNotes}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Adicionar notas (opcional)
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Como você está se sentindo?</DialogTitle>
                    <DialogDescription>
                      Adicione algumas notas sobre seu humor hoje (opcional)
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {/* Seletor de humor no modal */}
                    <div className="flex justify-center space-x-2">
                      {moodEmojis.map((emoji, index) => {
                        const moodValue = index + 1
                        const isSelected = selectedMood === moodValue
                        
                        return (
                          <button
                            key={moodValue}
                            onClick={() => setSelectedMood(moodValue)}
                            className={`
                              w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl
                              transition-all duration-200
                              ${isSelected 
                                ? 'border-indigo-500 bg-indigo-50' 
                                : 'border-gray-200 hover:border-gray-300'
                              }
                            `}
                          >
                            {emoji}
                          </button>
                        )
                      })}
                    </div>

                    <Textarea
                      placeholder="Como foi seu dia? O que você está sentindo?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                    />

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowNotes(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSubmitWithNotes}
                        disabled={!selectedMood || isRecording}
                        className="flex-1"
                      >
                        {isRecording ? 'Salvando...' : 'Salvar'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </>
        ) : (
          <>
            {/* Humor já registrado hoje */}
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <div className="text-4xl mb-2">{moodEmojis[todayMood.mood_value - 1]}</div>
              <p className="font-medium text-green-700">
                {moodLabels[todayMood.mood_value - 1]}
              </p>
              {todayMood.notes && (
                <p className="text-sm text-green-600 mt-2 italic">
                  "{todayMood.notes}"
                </p>
              )}
            </div>
          </>
        )}

        {/* Estatísticas */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-lg font-bold text-indigo-600">{stats.last7Days}</div>
              <div className="text-xs text-gray-500">7 dias</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Heart className="w-4 h-4 text-pink-500" />
              </div>
              <div className="text-lg font-bold text-pink-600">{stats.overall}</div>
              <div className="text-xs text-gray-500">Geral</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-lg font-bold text-green-600">{stats.streak}</div>
              <div className="text-xs text-gray-500">Sequência</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
