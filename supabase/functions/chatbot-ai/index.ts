
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, conversationId, userId } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Verificar se há situação de crise
    const { data: crisisResponses } = await supabaseClient
      .from('crisis_responses')
      .select('*')

    let crisisDetected = false
    let crisisLevel = 0
    let crisisResponse = null

    if (crisisResponses) {
      for (const response of crisisResponses) {
        const keywords = response.trigger_keywords
        const messageText = message.toLowerCase()
        
        if (keywords.some((keyword: string) => messageText.includes(keyword.toLowerCase()))) {
          crisisDetected = true
          crisisLevel = response.crisis_level
          crisisResponse = response
          break
        }
      }
    }

    // Se situação de crise, usar resposta pré-definida
    if (crisisDetected && crisisResponse) {
      // Salvar mensagem do usuário
      await supabaseClient
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          role: 'user',
          content: message,
          message_type: 'crisis',
          crisis_level: crisisLevel
        })

      // Salvar resposta de crise
      await supabaseClient
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          role: 'assistant',
          content: crisisResponse.response_template,
          message_type: 'crisis',
          crisis_level: crisisLevel
        })

      return new Response(
        JSON.stringify({
          response: crisisResponse.response_template,
          crisisDetected: true,
          crisisLevel: crisisLevel,
          requiresIntervention: crisisResponse.requires_human_intervention
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Buscar contexto do usuário (jornadas de sobriedade)
    const { data: sobrietyRecords } = await supabaseClient
      .from('sobriety_records')
      .select(`
        *,
        addiction_types (name, icon)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)

    // Buscar histórico recente de humor
    const { data: recentMood } = await supabaseClient
      .from('mood_history')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })
      .limit(7)

    // Construir contexto para Google Gemini
    let context = "Você é um assistente especializado em apoio à recuperação de vícios. "
    
    if (sobrietyRecords && sobrietyRecords.length > 0) {
      context += `O usuário está em recuperação de: ${sobrietyRecords.map(r => r.addiction_types?.name).join(', ')}. `
      context += `Dias de sobriedade: ${sobrietyRecords.map(r => r.current_streak_days).join(', ')} dias. `
    }

    if (recentMood && recentMood.length > 0) {
      const avgMood = recentMood.reduce((sum, mood) => sum + mood.mood_value, 0) / recentMood.length
      context += `Humor médio recente: ${avgMood.toFixed(1)}/5. `
    }

    context += "Seja empático, motivador e ofereça conselhos práticos. Se detectar sinais de crise, direcione para recursos de ajuda. Responda sempre em português brasileiro."

    // Chamada para Google Gemini API
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY não configurada')
    }

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${context}\n\nUsuário: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    })

    if (!geminiResponse.ok) {
      throw new Error(`Erro na API do Gemini: ${geminiResponse.status}`)
    }

    const geminiData = await geminiResponse.json()
    const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui processar sua mensagem no momento."

    // Salvar mensagens no banco
    await supabaseClient
      .from('chat_messages')
      .insert([
        {
          conversation_id: conversationId,
          user_id: userId,
          role: 'user',
          content: message,
          message_type: 'text'
        },
        {
          conversation_id: conversationId,
          user_id: userId,
          role: 'assistant',
          content: aiResponse,
          message_type: 'text'
        }
      ])

    return new Response(
      JSON.stringify({
        response: aiResponse,
        crisisDetected: false,
        crisisLevel: 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in chatbot-ai function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
