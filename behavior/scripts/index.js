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
      	//client.updateConversationState('option','call back')
        client.addTextResponse('Please provide your mobile number with country code.')
      } else if(option1){
      	//client.addResponse('request_audit')
      	client.updateConversationState('option','seo audit')
        client.updateConversationState('website', '')
        client.updateConversationState('email', '')
      	client.addTextResponse('We are glad to hear that. Please share your website url for the same.')
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
      const website = client.getFirstEntityWithRole(client.getMessagePart(), 'url/website')
      console.log(website.value)
      client.updateConversationState('website', website.value)
      client.addTextResponse('Thanks for providing the URL. Please provide us your email ID to which we can send the details of the audit.')
      //client.addResponse('request_email')
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
      //console.log(client.getConversation().state['option'])
      console.log(email)
      console.log('website')
      console.log(website)
      if(client.getConversation().state['website']){
      	//client.updateConversationState('website', email.value)
      	client.updateConversationState('email', email.value)
      	client.addTextResponse('We will send you the Audit report in around 24-48 hrs to your email address ' + email.value + '.')
      } else {
      	client.updateConversationState('website', email.value)
      	client.addTextResponse('Thanks for providing the URL. Please provide us your email ID to which we can send the details of the audit.')
      }
      console.log(client.getConversation())
      
      client.done()
    }
  })

  const requestNumber = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      console.log('Request Number')
      client.addResponse('request_number')
      client.done()
    }
  })

  const callBackEnd = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      console.log('Request Number End')
      client.addTextResponse('Thanks for providing your contact details. We will get back to you in 2-4 hrs.')
      client.done()
    }
  })

  const reponseNumber = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      const phonenumber = client.getFirstEntityWithRole(client.getMessagePart(), 'phone-number/number')
      client.updateConversationState('phonenumber', phonenumber.value)
      console.log('Request Number')
      client.addTextResponse('Thanks for providing your contact details. We will get back to you on your provided contact number ' + phonenumber.value + ' within 2-4 hrs.')
      client.done()
    }
  })

  // Help / intro message
  const checkMail = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      console.log('Check Number')
      client.addTextResponse('Check number')
      client.done()
    }
  })

  // Help / intro message
  const option = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addTextResponse('Hi there. How can we help you? Please choose from these options:')
      client.addResponseWithReplies(client.addTextResponse('test'),{foo: 'bar'},[client.makeReplyButton('Free SEO Audit','https://image.freepik.com/free-icon/seo-up-arrows-symbol-in-a-circle_318-53437.jpg','option_selected',{option: 1})]);
      client.done()
    }
  })

  client.runFlow({
    classifications: {
      // map inbound message classifications to names of streams
      option_selected: 'optionSelected',
      website: 'website',
      response_email: 'requestEmail',
      request_audit: 'requestAudit',
      response_number: 'reponseNumber',
      request_number: 'requestNumber',
      request_email: 'checkMail',
      callback_end: 'callBackEnd',
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
      requestNumber: [requestNumber],
      reponseNumber: [reponseNumber],
      checkMail: [checkMail],
      callBackEnd: [callBackEnd],
      option: [option],
    },
  })

  client.done() // Needed to support autoResponses if used
}