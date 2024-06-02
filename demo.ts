import { hc } from 'hono/client'
import type { AppType } from './main.ts'
import {
  finalizeEvent,
  generateSecretKey,
  getPublicKey,
  Relay,
} from 'nostr-tools'

const client = hc<AppType>('http://localhost:8000')

const sk = generateSecretKey()
const pk = getPublicKey(sk)

const URL = 'wss://relay.nostr.band/'
const relay = await Relay.connect(URL)
relay.subscribe([
  {
    authors: [pk],
  },
], {
  onevent(e) {
    console.log(e)
  },
})

await client.post.$post({
  json: finalizeEvent({
    content: '',
    created_at: Math.floor(Date.now() / 1000),
    kind: 999,
    tags: [['a']],
  }, sk),
  query: {
    url: URL,
  },
})
