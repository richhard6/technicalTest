import io from 'socket.io-client'
import config from '../../../config'

export const socket = io(config.BOT_SERVER_ENDPOINT, {
  transports: ['websocket', 'polling', 'flashsocket'],
})
