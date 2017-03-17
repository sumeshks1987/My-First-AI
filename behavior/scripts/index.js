'use strict'

exports.handle = (client) => {
  // Create steps

  // addItem takes an item list from the inbound message, merges that list with conversation state, and stores it
  const addItem = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      let itemRoles = client.getEntities(client.getMessagePart(), 'item')

      if (itemRoles) {
        let items = itemRoles['generic']

        if (items.length > 0) {
          let listItems = client.getConversationState().listItems || []

          // Deduplicate with existing items
          const existingItemNames = listItems.map(i => i.raw_value) // Get the raw text names from the entity objects
          items.forEach(item => {
            if (existingItemNames.indexOf(item.raw_value) < 0) {
              listItems.push(item)
            }
          })

          client.updateConversationState('listItems', listItems)

          let newItems = items.map(i => i.raw_value)

          // Send a confirmation, using custom text for a few items and a list for more
          if (newItems.length < 3) {
            client.addResponse('confirm_list_add', {item: newItems})
          } else {
            client.addResponse('confirm_list_add', {item_list: newItems.join(', ')})
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
  const checkList = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      let listItems = client.getConversationState().listItems || []

      // Get the raw text names from the entity objects
      let itemList = listItems.map(i => i.raw_value)

      if (itemList.length < 1) {
        client.addResponse('provide_empty_list')
      } else if (itemList.length < 3) {
        client.addResponse('provide_list', {item: itemList})
      } else {
        client.addResponse('provide_list', {item_list: itemList.join(', ')})
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
      add_list: 'addItem',
      check_list: 'checkList',
      clear_list: 'clearList',
      done_shopping: 'clearList',
      started_shopping: 'checkList',
      purchased_item: 'purchasedItem',
      remove_item: 'removeItem',
      help: 'end',
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      main: [option],
      addItem: [addItems],
      checkList: [checkList],
      clearList: [clearList],
      purchasedItem: [promptClear],
      removeItem: [promptClear],
      end: [help],
    },
  })

  client.done() // Needed to support autoResponses if used
}