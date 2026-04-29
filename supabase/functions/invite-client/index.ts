import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gestion du CORS pour les appels depuis le navigateur
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Clé secrète admin
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { email, first_name, last_name } = await req.json()

    // 1. Inviter l'utilisateur via son email
    // Supabase va envoyer un mail avec un lien de confirmation
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { first_name, last_name }, // Ces données seront récupérées par notre Trigger SQL
      redirectTo: `${req.headers.get('origin')}/dashboard`, 
    })

    if (error) throw error

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})