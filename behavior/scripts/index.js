'use strict'

exports.handle = (client) => {
  // Create steps

  // addItem takes an item list from the inbound message, merges that list with conversation state, and stores it
  const optionSelected = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      let itemRoles = client.getEntities(client.getMessagePart(), 'option_1')
      console.log(itemRoles)
      if (itemRoles) {
        let items = itemRoles['generic']

        if (items.length > 0) {
          let listItems = client.getConversationState().listItems || []



          let newItems = items.map(i => i.raw_value)

          // Send a confirmation, using custom text for a few items and a list for more
          if (newItems.length < 3) {
            client.addResponse('request_audit', {item: newItems})
          } else {
            client.addResponse('request_audit', {item_list: newItems.join(', ')})
          }
        }
      } else {
        // No items detected
        client.addResponse('list_add_error')
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
      let listItems = client.getConversationState().listItems || []

      // Get the raw text names from the entity objects
      let itemList = listItems.map(i => i.raw_value)

      if (itemList.length < 1) {
        client.addResponse('request_audit')
      } else if (itemList.length < 3) {
        client.addResponse('request_audit', {item: itemList})
      } else {
        client.addResponse('request_audit', {item_list: itemList.join(', ')})
      }
      client.done()
    }
  })

  // Clear the list and then confirm to user
  const clearList = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.updateConversationState('listItems', [])

      client.addResponse('cleared_list')
      client.done()
    }
  })

  // Tell the user to clear the list, if they are trying to remove a single item
  const promptClear = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('prompt_clear_list')
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
      clear_list: 'clearList',
      done_shopping: 'clearList',
      started_shopping: 'checkList',
      purchased_item: 'purchasedItem',
      remove_item: 'removeItem',
      option: 'end',
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      main: [option],
      optionSelected: [optionSelected],
      requestAudit: [requestAudit],
      clearList: [clearList],
      purchasedItem: [promptClear],
      removeItem: [promptClear],
      end: [option],
    },
  })

  client.done() // Needed to support autoResponses if used
}