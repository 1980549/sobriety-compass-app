
import React, { useState } from 'react'
import { useSobriety } from '@/hooks/useSobriety'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'

interface StartJourneyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StartJourneyModal({ open, onOpenChange }: StartJourneyModalProps) {
  const { addictionTypes, startJourney, createCustomAddiction } = useSobriety()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('existing')
  
  // Form states
  const [selectedAddictionId, setSelectedAddictionId] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [dailyCost, setDailyCost] = useState('')
  const [personalGoal, setPersonalGoal] = useState('')
  const [motivationReason, setMotivationReason] = useState('')

  // Custom addiction states
  const [customeName, setCustomName] = useState('')
  const [customIcon, setCustomIcon] = useState('🚫')
  const [customColor, setCustomColor] = useState('#6366f1')

  const icons = ['🚬', '🍺', '💊', '🎰', '🛍️', '📱', '🎮', '🍔', '☕', '🍷', '🚫', '❓']
  const colors = ['#ef4444', '#f97316', '#dc2626', '#7c3aed', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#6b7280']

  const handleStartJourney = async () => {
    if (!selectedAddictionId) return

    try {
      setLoading(true)
      await startJourney(
        selectedAddictionId,
        startDate,
        dailyCost ? parseFloat(dailyCost) : undefined,
        personalGoal || undefined,
        motivationReason || undefined
      )
      
      // Reset form
      setSelectedAddictionId('')
      setStartDate(new Date().toISOString().split('T')[0])
      setDailyCost('')
      setPersonalGoal('')
      setMotivationReason('')
      setActiveTab('existing')
      
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao iniciar jornada:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCustom = async () => {
    if (!customeName.trim()) return

    try {
      setLoading(true)
      const newAddiction = await createCustomAddiction(customeName.trim(), customIcon, customColor)
      
      if (newAddiction) {
        setSelectedAddictionId(newAddiction.id)
        setActiveTab('existing')
        
        // Reset custom form
        setCustomName('')
        setCustomIcon('🚫')
        setCustomColor('#6366f1')
      }
    } catch (error) {
      console.error('Erro ao criar vício personalizado:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Iniciar Nova Jornada</DialogTitle>
          <DialogDescription>
            Configure sua nova jornada de sobriedade
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Tipos Existentes</TabsTrigger>
            <TabsTrigger value="custom">Criar Personalizado</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Vício</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {addictionTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all ${
                      selectedAddictionId === type.id
                        ? 'ring-2 ring-indigo-500 bg-indigo-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedAddictionId(type.id)}
                  >
                    <CardContent className="p-3 text-center">
                      <div 
                        className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-lg"
                        style={{ backgroundColor: type.color + '20' }}
                      >
                        {type.icon}
                      </div>
                      <p className="text-xs font-medium truncate">{type.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {selectedAddictionId && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dailyCost">Custo Diário (R$)</Label>
                    <Input
                      id="dailyCost"
                      type="number"
                      step="0.01"
                      placeholder="Ex: 15.00"
                      value={dailyCost}
                      onChange={(e) => setDailyCost(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personalGoal">Meta Pessoal</Label>
                  <Input
                    id="personalGoal"
                    placeholder="Ex: Ficar 1 ano limpo para minha família"
                    value={personalGoal}
                    onChange={(e) => setPersonalGoal(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivationReason">Por que você quer parar?</Label>
                  <Textarea
                    id="motivationReason"
                    placeholder="Descreva sua motivação..."
                    value={motivationReason}
                    onChange={(e) => setMotivationReason(e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Criar Tipo Personalizado</CardTitle>
                <CardDescription>
                  Crie um tipo de vício personalizado para sua jornada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customName">Nome do Vício</Label>
                  <Input
                    id="customName"
                    placeholder="Ex: Redes Sociais, Procrastinação..."
                    value={customeName}
                    onChange={(e) => setCustomName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ícone</Label>
                  <div className="flex flex-wrap gap-2">
                    {icons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-colors ${
                          customIcon === icon
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setCustomIcon(icon)}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cor</Label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          customColor === color
                            ? 'border-gray-800 scale-110'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setCustomColor(color)}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleCreateCustom}
                  disabled={!customeName.trim() || loading}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar e Usar
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleStartJourney}
            disabled={!selectedAddictionId || loading}
          >
            {loading ? 'Iniciando...' : 'Iniciar Jornada'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
