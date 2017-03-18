'use strict'

exports.handle = (client) => {
  // Create steps

  // addItem takes an item list from the inbound message, merges that list with conversation state, and stores it
  const optionSelected = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      console.log(client.getFirstEntityWithRole(client.getMessagePart(), 'option_1').value)
      console.log('Client entity')
      let itemRoles = client.getEntities(client.getMessagePart(), 'option_1')
      client.addResponse('request_audit')
      client.done()
    }
  })

  // Fetch and show the list contents
  const requestAudit = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('request_audit')
      client.done()
    }
  })

  // Help / intro message
  const option = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('provide_options')
      client.done()
    }
  })

  client.runFlow({
    classifications: {
      // map inbound message classifications to names of streams
      option_selected: 'optionSelected',
      request_audit: 'requestAudit',
      option: 'end',
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      main: [option],
      optionSelected: [optionSelected],
      requestAudit: [requestAudit],
      end: [option],
    },
  })

  client.done() // Needed to support autoResponses if used
}