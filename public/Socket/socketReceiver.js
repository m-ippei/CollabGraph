/**
 * socketの受信処理
 */
export class socketReceiver {
    /**
     * socket.ioのインスタンスを保持する
     * @param {Socket.IO} socket socket.ioのインスタンス io('http://example.com')
     */
    constructor(socket) {
        this.socket = socket

        this.socket.on('info', (arg) => {
            console.log(arg)
        })

        this.socket.on('init', (json) => {
            g.handleClearLoadGraph(json)
        })

        /**
         * サーバーからのコマンドを受け取る
         * @param {JSON} cmd JSON型のコマンド {cmd:"CommandName"}
         * @param {JSON} cmd JSON型のコマンドとオプション {cmd:"CommandName",option:{}}
         */
        this.socket.on('server_command', (cmd) => {
            //ターゲットの更新
            if (cmd.server_command === 'update_NodeTarget') {
                g.jd.updateData_target(cmd.option.origin, cmd.option.target)
                g.jd.drawEdge()
                g.jd.cc.clearCanvas1()
                //タイトルの編集
            } else if (cmd.server_command === 'editTitle') {
                const _element = document.querySelector(`#l${cmd.option.id}`)
                _element.firstChild.innerHTML = cmd.option.newTitle
                g.jd.drawEdge()
                //ノードポジションの更新
            } else if (cmd.server_command === 'update_NodePos') {
                g.jd.updateData_pos(cmd.option.id, cmd.option.PosX, cmd.option.PosY)

                const _element = document.querySelector(`#l${cmd.option.id}`)
                _element.style.left = cmd.option.PosX + 'px'
                _element.style.top = cmd.option.PosY + 'px'

                g.jd.drawEdge()
                //ノードの追加
            } else if (cmd.server_command === 'NodeAdd') {
                g.jd.add(g.jd.createNode(cmd.option.NodeTitle, cmd.option.PosX, cmd.option.PosY, cmd.option.timestamp))
                //全削除
            } else if (cmd.server_command === 'removeAll') {
                g.jd.__resetData()
                g.jd.cc.canvasSizingAll(window.innerWidth, window.innerHeight)
                //キャンバスサイズの変更
            } else if (cmd.server_command === 'canvasSizing') {
                if (cmd.option.width) {
                    g.jd.cc.canvasSizing01W(cmd.option.width)
                } else if (cmd.option.height) {
                    g.jd.cc.canvasSizing01H(cmd.option.height)
                }
            }
        })
    }
}