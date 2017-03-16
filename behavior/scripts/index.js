'use strict'

exports.handle = function handle(client) {
  const collectOption = client.createStep({
    satisfied() {
      console.log('test')
      return false
    },
    prompt() {
      client.addResponse('provide_options')
      client.done()
    },
  })

  const option_selected = client.createStep({
    satisfied() {
      console.log('test')
      console.log(client)
      return Boolean(client.getConversationState().optionSelected)
    },

    extractInfo() {
     const option = client.getFirstEntityWithRole(client.getMessagePart(), 'option_selected')
      if (option) {
        client.updateConversationState({
          optionSelected: option,
        })
        console.log('User wants the weather in:', option.value)
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
      getOption: [collectOption, option_selected, request_audit],
    }
  })
}