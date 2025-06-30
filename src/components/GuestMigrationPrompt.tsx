
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, X } from 'lucide-react'
import { useGuestStorage } from '@/hooks/useGuestStorage'

interface GuestMigrationPromptProps {
  onClose: () => void
  onMigrate: () => void
}

export function GuestMigrationPrompt({ onClose, onMigrate }: GuestMigrationPromptProps) {
  const { guestData } = useGuestStorage()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleMigrate = async () => {
    setIsProcessing(true)
    try {
      await onMigrate()
    } finally {
      setIsProcessing(false)
    }
  }

  const getDataSummary = () => {
    const summary = []
    if (guestData.sobrietyRecords.length > 0) {
      summary.push(`${guestData.sobrietyRecords.length} jornada(s) de sobriedade`)
    }
    if (guestData.moodHistory.length > 0) {
      summary.push(`${guestData.moodHistory.length} registro(s) de humor`)
    }
    if (guestData.chatMessages.length > 0) {
      summary.push(`${guestData.chatMessages.length} mensagem(ns) do chat`)
    }
    if (guestData.achievements.length > 0) {
      summary.push(`${guestData.achievements.length} conquista(s)`)
    }
    return summary
  }

  const summary = getDataSummary()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Migrar Dados</span>
              </CardTitle>
              <CardDescription>
                Encontramos dados salvos localmente
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Queremos transferir seus dados locais para sua nova conta:
            </p>
            
            {summary.length > 0 ? (
              <div className="space-y-2">
                {summary.map((item, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-1">
                    {item}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum dado local encontrado.
              </p>
            )}
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleMigrate}
              disabled={isProcessing || summary.length === 0}
              className="flex-1"
            >
              {isProcessing ? 'Migrando...' : 'Migrar Dados'}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isProcessing}
            >
              Pular
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Após a migração, os dados locais serão removidos e sincronizados com sua conta.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
