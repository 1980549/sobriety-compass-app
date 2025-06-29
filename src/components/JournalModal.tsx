
import React, { useState } from 'react'
import { useJournal } from '@/hooks/useJournal'
import { useSobriety } from '@/hooks/useSobriety'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { X, Plus } from 'lucide-react'

interface JournalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JournalModal({ open, onOpenChange }: JournalModalProps) {
  const { createEntry, triggers, strategies } = useJournal()
  const { records } = useSobriety()
  const [loading, setLoading] = useState(false)

  // Form states
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [moodBefore, setMoodBefore] = useState<number>()
  const [moodAfter, setMoodAfter] = useState<number>()
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([])
  const [gratitudeItems, setGratitudeItems] = useState<string[]>([''])
  const [sobrietyRecordId, setSobrietyRecordId] = useState<string>('')

  const handleSubmit = async () => {
    if (!content.trim()) return

    try {
      setLoading(true)
      await createEntry({
        title: title.trim() || undefined,
        content: content.trim(),
        mood_before: moodBefore,
        mood_after: moodAfter,
        triggers: selectedTriggers.length > 0 ? selectedTriggers : undefined,
        coping_strategies: selectedStrategies.length > 0 ? selectedStrategies : undefined,
        gratitude_items: gratitudeItems.filter(item => item.trim()).length > 0 
          ? gratitudeItems.filter(item => item.trim()) 
          : undefined,
        sobriety_record_id: sobrietyRecordId || undefined,
      })

      // Reset form
      setTitle('')
      setContent('')
      setMoodBefore(undefined)
      setMoodAfter(undefined)
      setSelectedTriggers([])
      setSelectedStrategies([])
      setGratitudeItems([''])
      setSobrietyRecordId('')
      
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao criar entrada:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTrigger = (triggerName: string) => {
    setSelectedTriggers(prev => 
      prev.includes(triggerName)
        ? prev.filter(t => t !== triggerName)
        : [...prev, triggerName]
    )
  }

  const toggleStrategy = (strategyName: string) => {
    setSelectedStrategies(prev => 
      prev.includes(strategyName)
        ? prev.filter(s => s !== strategyName)
        : [...prev, strategyName]
    )
  }

  const addGratitudeItem = () => {
    setGratitudeItems(prev => [...prev, ''])
  }

  const updateGratitudeItem = (index: number, value: string) => {
    setGratitudeItems(prev => prev.map((item, i) => i === index ? value : item))
  }

  const removeGratitudeItem = (index: number) => {
    setGratitudeItems(prev => prev.filter((_, i) => i !== index))
  }

  const moodEmojis = ['😢', '😕', '😐', '😊', '😄']

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Entrada no Diário</DialogTitle>
          <DialogDescription>
            Registre seus pensamentos, sentimentos e reflexões do dia
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Título e Jornada */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título (opcional)</Label>
              <Input
                id="title"
                placeholder="Ex: Dia desafiador no trabalho"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Relacionado à jornada (opcional)</Label>
              <Select value={sobrietyRecordId} onValueChange={setSobrietyRecordId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma jornada" />
                </SelectTrigger>
                <SelectContent>
                  {records.map((record) => (
                    <SelectItem key={record.id} value={record.id}>
                      {record.addiction_types?.icon} {record.addiction_types?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Humor antes e depois */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Como você se sentia antes?</Label>
              <div className="flex gap-2">
                {moodEmojis.map((emoji, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={moodBefore === index + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMoodBefore(index + 1)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Como você se sente agora?</Label>
              <div className="flex gap-2">
                {moodEmojis.map((emoji, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={moodAfter === index + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMoodAfter(index + 1)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="space-y-2">
            <Label htmlFor="content">O que você gostaria de compartilhar? *</Label>
            <Textarea
              id="content"
              placeholder="Escreva sobre seus pensamentos, sentimentos, desafios ou conquistas do dia..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
          </div>

          {/* Gatilhos */}
          <div className="space-y-2">
            <Label>Gatilhos que você enfrentou</Label>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {triggers.map((trigger) => (
                    <Badge
                      key={trigger.id}
                      variant={selectedTriggers.includes(trigger.name) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTrigger(trigger.name)}
                    >
                      {trigger.icon} {trigger.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estratégias */}
          <div className="space-y-2">
            <Label>Estratégias que você usou</Label>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {strategies.map((strategy) => (
                    <Badge
                      key={strategy.id}
                      variant={selectedStrategies.includes(strategy.name) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleStrategy(strategy.name)}
                    >
                      {strategy.icon} {strategy.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gratidão */}
          <div className="space-y-2">
            <Label>Pelo que você é grato hoje?</Label>
            <div className="space-y-2">
              {gratitudeItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Ex: Minha família me apoiou hoje"
                    value={item}
                    onChange={(e) => updateGratitudeItem(index, e.target.value)}
                  />
                  {gratitudeItems.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeGratitudeItem(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addGratitudeItem}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || loading}
          >
            {loading ? 'Salvando...' : 'Salvar Entrada'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
