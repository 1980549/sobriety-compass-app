
/**
 * Cria uma mensagem temporária do usuário para exibição imediata
 */
export const createUserMessage = (content: string) => ({
  id: crypto.randomUUID(),
  role: 'user' as const,
  content,
  message_type: 'text' as const,
  created_at: new Date().toISOString()
})

/**
 * Valida se a mensagem não está vazia
 */
export const validateMessage = (message: string): boolean => {
  return message.trim().length > 0
}

/**
 * Determina se uma crise foi detectada baseada no nível
 */
export const isCrisisDetected = (crisisLevel?: number): boolean => {
  return crisisLevel !== undefined && crisisLevel >= 5
}

/**
 * Retorna o tipo de alerta baseado no nível de crise
 */
export const getCrisisAlertType = (crisisLevel: number): 'default' | 'destructive' => {
  return crisisLevel >= 8 ? 'destructive' : 'default'
}
