'use strict'

exports.handle = (client) => {
  // Create steps

  // addItem takes an item list from the inbound message, merges that list with conversation state, and stores it
  const optionSelected = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      console.log('Client entity')
      const option1 = client.getFirstEntityWithRole(client.getMessagePart(), 'option_1')
      const option2 = client.getFirstEntityWithRole(client.getMessagePart(), 'option_2')
      const option3 = client.getFirstEntityWithRole(client.getMessagePart(), 'option_3')
      const option4 = client.getFirstEntityWithRole(client.getMessagePart(), 'option_4')
      if(option2){
      	console.log("option 1 selected")
      } else if(option1){
      	//client.addResponse('request_audit')
      	client.addTextResponse('We are glad to hear that. Please share your website url for the same.')
      } else if(option3){
      	console.log("option 3 selected")
      } else {
      	console.log("option 4 selected")
      }
      client.done()
    }
  })

  // Fetch and show the list contents
  const requestAudit = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
    	console.log('Request Audit')
      client.addResponse('request_email')
      client.done()
    }
  })

  // Fetch and show the list contents
  const requestEmail = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      console.log('Email')
      client.addResponse('request_email')
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
      //request_audit: 'requestAudit',
      request_email: 'requestEmail',
      request_audit: 'requestAudit',
      option: 'end',
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      main: [option],
      optionSelected: [optionSelected],
      //requestAudit: [requestAudit],
      requestEmail: [requestEmail, 'request_email'],
      requestAudit: [requestAudit],
      end: [option],
    },
  })

  client.done() // Needed to support autoResponses if used
}