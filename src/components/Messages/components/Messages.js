import React, { useRef, useEffect, useState } from 'react'
import HocMessages from './HocMessages'
import useSound from 'use-sound'
import config from '../../../config'
import TypingMessage from './TypingMessage'
import Header from './Header'
import Footer from './Footer'
import Message from './Message'
import useBot from '../hooks/useBot'
import { socket } from '../socket/socket'
import '../styles/_messages.scss'

function Messages({
  handleOnChangeMessage,
  handleMessageSend,
  message,
  messagesList,
  setMessagesList,
}) {
  const [playReceive] = useSound(config.RECEIVE_AUDIO_URL)
  const [nextMessage, setNextMessage] = useState({})
  const { botIsTyping, checkBotTyping, getBotMessages, received, setReceived } =
    useBot({
      setMessagesList,
      setNextMessage,
    })
  const messagesEndRef = useRef(null)

  useEffect(() => {
    socket.on('bot-typing', (isTyping) => {
      checkBotTyping(isTyping)
    })
  }, [checkBotTyping])

  useEffect(() => {
    socket.on('bot-message', (message) => {
      getBotMessages(message)
      scrollToBottom()
    })
  }, [getBotMessages])

  useEffect(() => {
    if (received) {
      playReceive()
      setReceived(false)
    }
  }, [received, playReceive, setReceived])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    })
  }

  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list">
        {messagesList.map((message, index) => {
          return (
            <Message
              key={index}
              message={message}
              nextMessage={nextMessage}
              botTyping={botIsTyping}
            />
          )
        })}
        <div ref={messagesEndRef} />
        {botIsTyping && <TypingMessage />}
      </div>
      <Footer
        message={message}
        sendMessage={handleMessageSend}
        onChangeMessage={handleOnChangeMessage}
      />
    </div>
  )
}

export default HocMessages(Messages)
