'use strict'

exports.handle = function handle(client) {

  const collectOptions = client.createStep({
    satisfied() {
      console.log('Test')
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
      client.addResponse('prompt/weather_city')
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