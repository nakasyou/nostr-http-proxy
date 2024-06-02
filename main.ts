import { Hono } from 'hono'
import { cors } from 'npm:hono/cors'
import * as v from '@valibot/valibot'
import { vValidator } from '@hono/valibot-validator'
import { Relay } from 'nostr-tools/relay'
import { finalizeEvent, generateSecretKey } from 'nostr-tools'

const POST_SCHEMA = v.object({
  content: v.string(),
  created_at: v.number(),
  tags: v.array(v.array(v.string())),
  kind: v.number(),
  id: v.string(),
  sig: v.string(),
  pubkey: v.string()
})

const app = new Hono().use('*', cors({ origin: '*' })).post('/post', vValidator('json', POST_SCHEMA), vValidator('query', v.object({
  url: v.string()
})), async c => {
  const { url } = c.req.valid('query')
  const evt = c.req.valid('json')

  const relay = await Relay.connect(url)
  
  const res = await relay.publish(evt)

  c.header('
  return c.text(res)
})

Deno.serve(app.fetch)

export type AppType = typeof app
