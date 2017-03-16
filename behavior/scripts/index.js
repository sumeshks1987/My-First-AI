'use strict'

exports.handle = function handle(client) {
  const collectOption = client.createStep({
    satisfied() {
      console.log('test')
      console.log(client.getConversationState())
      return Boolean(client.getConversationState().weatherCity)
    },

    extractInfo() {
     const city = client.getFirstEntityWithRole(client.getMessagePart(), 'city')
      if (city) {
        client.updateConversationState({
          weatherCity: city,
        })
        console.log('User wants the weather in:', city.value)
      }
    },

    prompt() {
      client.addResponse('provide_options')
      client.done()
    },
  })

  const request_audit = client.createStep({
    satisfied() {
      return false
    },

    prompt(callback) {
      client.addResponse('request_audit')
      client.done()
    },
  })

  client.runFlow({
    classifications: {},
    streams: {
      main: 'getOption',
      getOption: [collectOption, request_audit],
    }
  })
}