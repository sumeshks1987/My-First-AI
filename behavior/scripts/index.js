'use strict'

exports.handle = function handle(client) {
  const collectOption = client.createStep({
    satisfied() {
      console.log('test')
      console.log(client)
      return Boolean(client.getConversationState().weatherCity)
    },

    extractInfo() {
     const option = client.getFirstEntityWithRole(client.getMessagePart(), 'option_selected')
      if (option) {
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