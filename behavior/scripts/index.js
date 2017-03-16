'use strict'

exports.handle = function handle(client) {

  const collectOptions = client.createStep({
    satisfied() {
      return false
    },

    extractInfo() {
      console.log('test')
     const city = client.getFirstEntityWithRole(client.getMessagePart(), 'city')
      if (city) {
        client.updateConversationState({
          weatherCity: city,
        })
        console.log('User wants the weather in:', city.value)
      }
    },

    prompt() {
      client.addResponse('provide_options)
      client.done()
    },
  })

  client.runFlow({
    classifications: {},
    streams: {
      main: 'provide_options',
      provide_options: [collectOptions]
    }
  })
}