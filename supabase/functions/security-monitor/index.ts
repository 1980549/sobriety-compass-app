
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
    const { eventType, details, userId, ipAddress, userAgent } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Determinar nível de risco
    let riskLevel = 'low'
    
    if (eventType === 'failed_login') {
      // Verificar tentativas de login falhadas
      const { data: failedAttempts } = await supabaseClient
        .from('failed_login_attempts')
        .select('*')
        .eq('email', details.email)
        .eq('ip_address', ipAddress)
        .single()

      if (failedAttempts) {
        const newCount = failedAttempts.attempt_count + 1
        riskLevel = newCount > 5 ? 'critical' : newCount > 3 ? 'high' : 'medium'
        
        // Atualizar contador
        await supabaseClient
          .from('failed_login_attempts')
          .update({ 
            attempt_count: newCount,
            last_attempt: new Date().toISOString(),
            blocked_until: newCount > 5 ? new Date(Date.now() + 30 * 60 * 1000).toISOString() : null
          })
          .eq('id', failedAttempts.id)
      } else {
        // Primeira tentativa falhada
        await supabaseClient
          .from('failed_login_attempts')
          .insert({
            email: details.email,
            ip_address: ipAddress,
            attempt_count: 1
          })
      }
    }

    if (eventType === 'suspicious_activity') {
      riskLevel = 'high'
    }

    // Registrar evento de segurança
    await supabaseClient
      .from('security_logs')
      .insert({
        user_id: userId,
        event_type: eventType,
        ip_address: ipAddress,
        user_agent: userAgent,
        details: details,
        risk_level: riskLevel
      })

    // Se risco alto/crítico, alertar
    if (riskLevel === 'high' || riskLevel === 'critical') {
      // Aqui você poderia enviar notificações push ou emails
      console.log(`High risk event detected: ${eventType} for user ${userId}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        riskLevel,
        blocked: riskLevel === 'critical'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in security-monitor function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
