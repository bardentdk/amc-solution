// supabase/functions/create-checkout-session/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  const { priceId, userId, email, installments } = await req.json()

  // Si installments > 1, on crée une souscription ou un paiement échelonné
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: installments > 1 ? 'subscription' : 'payment',
    success_url: `${req.headers.get('origin')}/dashboard?success=true`,
    cancel_url: `${req.headers.get('origin')}/offres`,
    metadata: { userId, installments },
    // Configuration SEPA + Carte
    payment_method_types: ['card', 'sepa_debit'],
  })

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' },
  })
})