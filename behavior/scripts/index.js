'use strict'

exports.handle = function handle(client) {

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('apology/untrained')
     client.done()
    }
  })

  const greeting = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('provide_options')
      client.done()
    }
  })

  const handleOptions = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('provide_options')
      client.done()
    }
  })

  const handleGoodbye = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('goodbye')
      client.done()
    }
  })

  client.runFlow({
    classifications: {
      provide_options: 'provide_options',
      goodbye: 'goodbye',
      greeting: 'greeting'
    },
    streams: {
      goodbye: handleGoodbye,
      provide_options: handleOptions,
      main: 'onboarding',
      onboarding: [greeting],
      end: [untrained]
    }
  })
}