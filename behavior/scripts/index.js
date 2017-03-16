'use strict'

exports.handle = function handle(client) {

  const handleOptions = client.createStep({
    satisfied() {
      console.log(client.getConversationState())
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
      onboarding: [handleOptions]
    }
  })
}