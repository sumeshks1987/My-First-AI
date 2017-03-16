'use strict'

exports.handle = function handle(client) {
  const collectOption = client.createStep({
    satisfied() {
      console.log('test')
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

  const provideWeather = client.createStep({
    satisfied() {
      return false
    },

    prompt(callback) {
      const environment = client.getEnvironment()
      console.log(environment)
      getCurrentWeather(environment.weatherAPIKey, client.getConversationState().weatherCity.value, resultBody => {
        if (!resultBody || resultBody.cod !== 200) {
          console.log('Error getting weather.')
          callback()
          return
        }

        const weatherDescription = (
          resultBody.weather.length > 0 ?
          resultBody.weather[0].description :
          null
        )

        const weatherData = {
          temperature: Math.round(resultBody.main.temp),
          condition: weatherDescription,
          city: resultBody.name,
        }

        console.log('sending real weather:', weatherData)
        client.addResponse('provide_weather/current', weatherData)
        client.done()

        callback()
      })
    },
  })

  client.runFlow({
    classifications: {},
    streams: {
      main: 'getOption',
      getOption: [collectOption, provideWeather],
    }
  })
}