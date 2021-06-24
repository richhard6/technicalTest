import { useState, useRef, useCallback, useContext } from 'react'
import { getRandomId } from '../utils/randomId'
import LatestMessagesContext from '../../../contexts/LatestMessages/LatestMessages'

export default function useBot({ setMessagesList, setNextMessage }) {
  const [botIsTyping, setBotIsTyping] = useState(false)
  const [received, setReceived] = useState(false)
  const { setLatestMessage } = useContext(LatestMessagesContext)
  const setLatestContext = useRef(setLatestMessage)

  const getBotMessages = useCallback(
    (message) => {
      const bottyMessage = {
        message: message,
        user: 'bot',
        id: getRandomId(),
      }
      setNextMessage((prevMessage) => (prevMessage = bottyMessage))
      setBotIsTyping(false)
      setReceived(true)
      setMessagesList((messages) => [...messages, bottyMessage])
      setLatestContext.current(bottyMessage.user, bottyMessage.message)
    },
    [setMessagesList, setLatestContext, setNextMessage]
  )

  const checkBotTyping = useCallback((isTyping) => {
    if (!isTyping) {
      setBotIsTyping(true)
    }
  }, [])

  return { botIsTyping, checkBotTyping, getBotMessages, received, setReceived }
}
