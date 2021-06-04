import { socketReceiver } from './socketReceiver.js'
/**
 * clientとserverを繋ぐクラス
 * 
 */
export class socketController {
    /**
     * socket.ioのインスタンスを保持する
     * @param {Socket.IO} socket socket.ioのインスタンス io('http://example.com')
     */
    constructor(socket) {
        this.socket = socket
        this.sr = new socketReceiver(socket)

        this.socket.on('reconnect', () => {
            this.fire('reconnect')
        })
    }

    /**
     * サーバーにコマンドを発行する
     * @param {string} cmd CommandName
     * @param {obj} option CommandNameとoption
     */
    fire(cmd, option) {
        if (option === undefined) {
            this.socket.emit('client_command', { "client_command": cmd })
        } else {
            this.socket.emit('client_command', { "client_command": cmd, "option": option })
        }

    }

}