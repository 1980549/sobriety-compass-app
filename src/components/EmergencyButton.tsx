
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Phone, MessageCircle, Heart, Clock } from 'lucide-react'

const emergencyContacts = [
  {
    name: 'CVV - Centro de Valorização da Vida',
    number: '188',
    description: 'Prevenção do suicídio, 24h',
    type: 'Ligação gratuita'
  },
  {
    name: 'CAPS - Centro de Atenção Psicossocial',
    number: '136',
    description: 'Saúde mental e dependência química',
    type: 'Informações'
  },
  {
    name: 'Narcóticos Anônimos',
    number: '(11) 3229-2020',
    description: 'Grupo de apoio 24h',
    type: 'São Paulo'
  }
]

const copingStrategies = [
  {
    title: 'Respire Profundamente',
    icon: '🫁',
    description: 'Faça 5 respirações profundas, contando até 4 na inspiração e 6 na expiração.',
    time: '2 min'
  },
  {
    title: 'Beba Água',
    icon: '💧',
    description: 'Beba um copo grande de água gelada. A hidratação ajuda a controlar a ansiedade.',
    time: '1 min'
  },
  {
    title: 'Mova-se',
    icon: '🚶',
    description: 'Faça uma caminhada rápida, polichinelos ou alongamentos por alguns minutos.',
    time: '5-10 min'
  },
  {
    title: 'Ligue para Alguém',
    icon: '📞',
    description: 'Entre em contato com um amigo, familiar ou padrinho de confiança.',
    time: '10 min'
  },
  {
    title: 'Escreva',
    icon: '✍️',
    description: 'Anote seus sentimentos, o que está acontecendo e por que você quer se manter limpo.',
    time: '5 min'
  },
  {
    title: 'Meditação Rápida',
    icon: '🧘',
    description: 'Use um app de meditação ou apenas feche os olhos e se concentre no presente.',
    time: '5 min'
  }
]

const motivationalMessages = [
  "Você já chegou até aqui, isso prova sua força! 💪",
  "Este momento difícil vai passar. Você é mais forte que seu vício. 🌟",
  "Lembre-se do porquê você começou essa jornada. 🎯",
  "Cada 'não' é uma vitória. Você está vencendo! 🏆",
  "Sua família e amigos acreditam em você. Nós também! ❤️",
  "Amanhã você vai se orgulhar de ter resistido hoje. 🌅",
]

export function EmergencyButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMessage] = useState(() => 
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  )

  const handleCall = (number: string) => {
    window.open(`tel:${number}`, '_self')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className="bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg animate-pulse"
        >
          <AlertTriangle className="w-5 h-5 mr-2" />
          Emergência / Crise
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-red-600 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2" />
            Você não está sozinho!
          </DialogTitle>
          <DialogDescription className="text-base">
            Se você está enfrentando uma crise ou vontade intensa, estas estratégias podem ajudar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mensagem motivacional */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200">
            <CardContent className="p-4">
              <p className="text-lg font-medium text-indigo-700 text-center">
                {currentMessage}
              </p>
            </CardContent>
          </Card>

          {/* Contatos de emergência */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-green-600" />
              Contatos de Emergência
            </h3>
            <div className="grid gap-3">
              {emergencyContacts.map((contact, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.description}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {contact.type}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => handleCall(contact.number)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {contact.number}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Estratégias de enfrentamento */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-600" />
              Estratégias Rápidas (Escolha Uma)
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {copingStrategies.map((strategy, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <span className="text-2xl mr-3">{strategy.icon}</span>
                      {strategy.title}
                      <Badge variant="outline" className="ml-auto text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {strategy.time}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{strategy.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Lembretes importantes */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-base text-yellow-800">
                ⚠️ Lembre-se:
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-yellow-700 space-y-2">
              <p>• Este sentimento é temporário e vai passar</p>
              <p>• Você já superou momentos difíceis antes</p>
              <p>• Cada dia limpo é uma vitória</p>
              <p>• Procurar ajuda é sinal de força, não fraqueza</p>
              <p>• Sua jornada de recuperação vale a pena</p>
            </CardContent>
          </Card>

          {/* Botão para fechar */}
          <div className="text-center pt-4">
            <Button 
              onClick={() => setIsOpen(false)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-8"
            >
              Estou Melhor Agora
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
