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
      let option1 = client.getFirstEntityWithRole(client.getMessagePart(), 'option_1')
      let option2 = client.getFirstEntityWithRole(client.getMessagePart(), 'option_2')
      let option3 = client.getFirstEntityWithRole(client.getMessagePart(), 'option_3')
      let option4 = client.getFirstEntityWithRole(client.getMessagePart(), 'option_4')
      if(option2){
      	console.log("option 1 selected")
      } else if(option1){
      	//client.addResponse('request_audit')
      	client.addTextResponse('We are glad to hear that. Please share your website url for the same.', {selected: option1})
      } else if(option3){
      	console.log("option 3 selected")
      } else {
      	console.log("option 4 selected")
      }
      client.done()
    }
  })

  const requestAudit = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
    	console.log('Request Audit')
      client.addResponse('request_audit')
      client.done()
    }
  })

  // Fetch and show the list contents
  const website = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      console.log('Request Audit')
      const website = client.getFirstEntityWithRole(client.getMessagePart(), 'url')
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
      const email = client.getFirstEntityWithRole(client.getMessagePart(), 'email_id')
      console.log(option1)
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
      request_website: 'website',
      response_email: 'requestEmail',
      request_audit: 'requestAudit',
      greeting: 'option',
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      main: [option],
      optionSelected: [optionSelected],
      website: [website],
      requestEmail: [requestEmail],
      requestAudit: [requestAudit],
      option: [option],
    },
  })

  client.done() // Needed to support autoResponses if used
}