const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const JSON_SERVER = require('./src/JSON_SERVER')
const js = new JSON_SERVER(require('./src/init.json'))

app.use(express.static(`${__dirname}`))

io.on('connection', (socket) => {
    console.log("connect")
    socket.emit('init', js._data)
    socket.on('disconnect', () => {
        console.log('disconnect')
    })
    socket.on('client_command', (cmd) => {
        //console.log(cmd)
        //再接続
        if (cmd.client_command === 'reconnect') {
            socket.emit('init', js._data)
            //Nodeの削除
        } else if (cmd.client_command === 'deleteNode') {
            js.deleteNode(cmd.option.target_num)
            io.local.emit('init', js._data)
            //ターゲットの更新
        } else if (cmd.client_command === 'update_NodeTarget') {
            js.update_NodeTarget(cmd.option.origin, cmd.option.target)
            io.local.emit('server_command', { 'server_command': 'update_NodeTarget', "option": cmd.option })
            //タイトルの編集
        } else if (cmd.client_command === 'editTitle') {
            js.editTitle(cmd.option.id, cmd.option.newTitle)
            io.local.emit('server_command', { 'server_command': 'editTitle', 'option': cmd.option })
            //ノードポジションの更新
        } else if (cmd.client_command === 'update_NodePos') {
            js.update_NodePos(cmd.option.id, cmd.option.PosX, cmd.option.PosY)
            io.local.emit('server_command', { 'server_command': 'update_NodePos', 'option': cmd.option })
            //ノードの追加
        } else if (cmd.client_command === 'NodeAdd') {
            cmd.option.timestamp = Date.now()
            js.add(js.createNode(cmd.option.NodeTitle, cmd.option.PosX, cmd.option.PosY, cmd.option.timestamp))
            io.local.emit('server_command', { 'server_command': 'NodeAdd', 'option': cmd.option })
            //全削除
        } else if (cmd.client_command === 'removeAll') {
            js.__resetData()
            io.local.emit('server_command', { 'server_command': 'removeAll' })
            //ファイル読み込み
        } else if (cmd.client_command === 'read_JSON') {
            js.__resetData()
            cmd.option.data.forEach((v) => {
                js.add(v)
            })
            io.local.emit('init', js._data)
            //キャンバスサイズの変更
        } else if (cmd.client_command === 'canvasSizing') {
            io.local.emit('server_command', { 'server_command': 'canvasSizing', 'option': cmd.option })
        }
    })
})

http.listen(3000, () => { console.log('start:3000') })