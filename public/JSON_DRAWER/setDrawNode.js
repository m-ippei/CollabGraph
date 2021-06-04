/**
 * Nodeを構成する要素の設定をまとめたもの
 * @param {_JSON_NODE_data} obj Nodesを構成する Nodeの情報をいれる 主にJSON_DRAWERのcreateNodeから生成
 * @param {JSON_DRAWER} _this JSON_DRAWERの持つthisプロパティをそのまま使う
 */

import { JSON_DRAWER } from "./JSON_DRAWER.js"

export function setDrawNode(obj, _this) {
    const li = document.createElement('li')
    const label = document.createElement('label')
    li.id = `l${obj.id}`
    li.className = "Nodes"
    li.style.left = obj.PosX + 'px'
    li.style.top = obj.PosY + 'px'

    li.addEventListener('pointerdown', (event) => {
        if (event.target.parentNode.id !== 'ul0' && event.target.id !== 'canvas1') {
            g.hc.connects = []
            g.hc.connects.push(Number(event.target.parentNode.id.replace("l", "")))
            event.target.parentNode.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.2)'

            g.mc.down(event.target.parentNode, event.pageX, event.pageY)
        }
    })

    li.addEventListener('pointerleave', (event) => {
        //ロングタップ後、リスト範囲から離れた時
        if (g.mc.state === 'move') {
            g.sc.fire('update_NodePos', { "id": g.hc.connects[0], "PosX": event.pageX - g.mc.offX, "PosY": event.pageY - g.mc.offY })
            g.mc.leave(event.target)
            g.hc.connects = []

            //Edgeを伸ばした時
        } else if (g.mc.state === 'none') {
            clearTimeout(g.mc.t)
            if (g.hc.connects.length > 0) {
                document.querySelector(`#l${g.hc.connects[0]}`).style.boxShadow = ''
            }
        }

    })

    li.addEventListener('pointerup', (event) => {
        if (g.hc.connects.length > 0) {
            if (event.target.parentNode.id !== 'ul0' && event.target.id !== 'canvas1') {
                //Edgeを繋いだ時
                if (g.mc.state !== 'move') {
                    const origin = g.hc.connects[0]
                    const target = Number(event.target.parentNode.id.replace("l", ""))
                    if (origin !== target) {
                        g.sc.fire('update_NodeTarget', {
                            "origin": origin,
                            "target": target
                        })
                    }

                    const _element = document.querySelector(`#l${g.hc.connects[0]}`)
                    g.mc.up(_element)
                    g.hc.connects = []

                    //Edgeを動かしていた時
                } else if (g.mc.state === 'move') {

                    g.sc.fire('update_NodePos', { "id": g.hc.connects[0], "PosX": event.pageX - g.mc.offX, "PosY": event.pageY - g.mc.offY })


                    const _element = document.querySelector(`#l${g.hc.connects[0]}`)
                    g.mc.up(_element)
                    g.hc.connects = []
                }

            }
        }
    })

    li.addEventListener('pointermove', (event) => {
        if (g.mc.state === 'move') {
            if (g.hc.connects.length > 0) {
                if (event.target.parentNode.id !== 'ul0' && event.target.id !== 'canvas1') {
                    //データ変更
                    g.mc.move(event.target.parentNode, event.pageX, event.pageY)
                    if (event.pageX > _this.cc.canvas1.width * 0.95) {
                        //キャンバスサイズ変更
                        g.sc.fire('canvasSizing', { "width": _this.cc.canvas1.width + (window.innerWidth / 2) })
                    }
                    if (event.pageY > _this.cc.canvas1.height * 0.95) {
                        //キャンバスサイズ変更
                        g.sc.fire('canvasSizing', { "height": _this.cc.canvas1.height + (window.innerHeight / 2) })
                    }
                }
            }
        }
    })

    label.innerHTML = obj.title
    label.className = "titles"


    label.addEventListener('contextmenu', (event) => {
        g.hc.selectElement = event.target

        g.contextmenu0.style.display = "none"
        _this.cc.is_drawSingleArrow = false

        g.list_contextmenu.style.display = "flex"
        g.list_contextmenu.style.left = event.pageX + "px"
        //以下の+20は要素に重ねないようにするため
        g.list_contextmenu.style.top = event.pageY + 20 + "px"

    })

    li.appendChild(label)
    document.querySelector("#ul0").appendChild(li)
}