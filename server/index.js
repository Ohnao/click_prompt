const fastify = require('fastify')({ logger: true })
const fetch = require('node-fetch')
const cors = require('@fastify/cors')

const RINNA_API_KEY = process.env['RINNA_API_KEY']
const cache = new Map()

fastify.register(cors, {
  'Access-Control-Allow-Origin': '*',
})

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

fastify.post('/textToImage', async (request, reply) => {
  const prompt = JSON.parse(request.body).prompt

  // if (cache.has(prompt)) {
  //   return cache.get(prompt)
  // }

  const body = {
    "data": [
      prompt,
      1,
      4,
      15,
      50,
      "k_lms",
      null,
      "20%",
      "random",
      false,
      0
    ]
  }

  return fetch('https://api.rinna.co.jp/models/tti/predict/', {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': RINNA_API_KEY,
    }
  }).then(async (res) => {
    const body = await res.json()
    const data = {
      prompt: prompt,
      images: body.data,
    }

    cache.set(prompt, data)

    return data
  })
})

const start = async () => {
  try {
    await fastify.listen({ port: 3001 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
