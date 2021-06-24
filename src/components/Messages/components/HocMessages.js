import { useState, useCallback, useContext } from 'react'

import useSound from 'use-sound'
import config from '../../../config'
import LatestMessagesContext from '../../../contexts/LatestMessages/LatestMessages'
import { socket } from '../socket/socket'
import { getRandomId } from '../utils/randomId'

function HocMessages(Messages) {
  return function New() {
    const [playSend] = useSound(config.SEND_AUDIO_URL)
    const [message, setMessage] = useState({ message: '', user: '', id: '' })
    const [messagesList, setMessagesList] = useState([])

    const { setLatestMessage } = useContext(LatestMessagesContext)

    const handleMessageSend = useCallback(() => {
      if (!message.message) return
      setMessage((prevMessage) => (prevMessage.id = getRandomId()))
      setMessagesList((messages) => [...messages, message])
      socket.emit('user-message', message.message)
      setLatestMessage(message.user, message.message)
      setMessage({ message: '', user: '', id: '' })
      playSend()
    }, [message, playSend, setLatestMessage, setMessage])

    const handleOnChangeMessage = (e) => {
      const userMessage = {
        message: e.target.value,
        user: 'me',
      }
      setMessage((prevMessage) => (prevMessage = userMessage))
    }

    return (
      <Messages
        handleOnChangeMessage={handleOnChangeMessage}
        handleMessageSend={handleMessageSend}
        message={message}
        messagesList={messagesList}
        setMessagesList={setMessagesList}
      />
    )
  }
}

export default HocMessages
