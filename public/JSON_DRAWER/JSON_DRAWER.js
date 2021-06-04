import { canvasController } from '../Controller/canvasController.js'
import { setDrawNode } from './setDrawNode.js'

/**
 * メインとなるクラス
 * JSONを保持しJSONの操作や描画命令を行う
 */
export class JSON_DRAWER {
    constructor(obj) {
        //Edgeの幅設定
        this._EdgeOutputSize = 5;

        this.cc = new canvasController()

        //初期化JSONの判定
        if (obj) {
            this._data = JSON.parse(JSON.stringify(obj))
            this.drawAll()
            this.drawEdge()
        } else {
            this._data = []
        }
    }

    //ノードの追加処理
    add(obj, option) {
        this._data.push(obj)
        this.cc.clearCanvas0()
        this.drawNode(obj)
        this.drawEdge(option)
    }

    //ノードをすべて描画する
    drawAll() {
        if (this._data === []) {
            return
        } else {
            this._data.forEach((v) => {
                this.drawNode(v)
            })
        }

    }

    //ノードの追加処理
    drawNode(obj) {
        setDrawNode(obj, this)
    }

    //新規ノード
    createNode(title, x, y, timestamp) {
        if (timestamp === undefined) {
            timestamp = Date.now()
        }
        return {
            "id": this._data.length,
            "PosX": x,
            "PosY": y,
            "title": title,
            "timestamp": timestamp,
            "target": []
        }
    }

    //座標の更新処理
    updateData_pos(num_id, x, y) {
        this._data[num_id].PosX = x
        this._data[num_id].PosY = y
    }

    //コネクタの更新処理
    updateData_target(num_id, add_num_id) {
        if (this._data[num_id].target.includes(add_num_id) === false) {
            if (this._data[num_id].id !== add_num_id) {
                this._data[num_id].target.push(add_num_id)
            }
        } else if (this._data[num_id].target.includes(add_num_id) === true) {
            this._data[num_id].target = Array.from(new Set(this._data[num_id].target))
            this._data[num_id].target = this._data[num_id].target.filter((v) => {
                return v !== add_num_id
            })
        }
    }

    //矢印の描画
    drawArrow(p = [[0, 0], [0, 0]], canvasElement) {
        let n = []
        let t = [[], []]
        let gradient;

        n[0] = this.nomalize(p[1][0] - p[0][0], p[1][1] - p[0][1]);
        t[0] = this.rotateHalfPIn(n[0][0], n[0][1], "+")
        t[1] = this.rotateHalfPIn(n[0][0], n[0][1], "-")

        canvasElement.beginPath()
        canvasElement.moveTo(p[1][0], p[1][1])

        gradient = canvasElement.createLinearGradient(p[0][0], p[0][1], p[1][0], p[1][1])
        gradient.addColorStop(0, 'rgba(0,0,0,0.05)')
        gradient.addColorStop(1, '#4E4449')
        canvasElement.fillStyle = gradient
        canvasElement.lineTo(p[0][0] + t[0][0] * this._EdgeOutputSize, p[0][1] + t[0][1] * this._EdgeOutputSize)
        canvasElement.lineTo(p[0][0] + t[1][0] * this._EdgeOutputSize, p[0][1] + t[1][1] * this._EdgeOutputSize)
        canvasElement.fill()
    }

    //Edgeの描画
    drawEdge(option) {
        if (option !== undefined) {
            if (option.skip === true) {
                return
            }
        }
        this.cc.clearCanvas0()
        this._data.forEach((v) => {
            v.target.forEach((v2) => {
                let p = [
                    [],
                    [],
                ]

                const el0 = document.querySelector(`#l${v2}`)
                const el1 = document.querySelector(`#l${v.id}`)
                const rect0 = el0.getBoundingClientRect()
                const rect1 = el1.getBoundingClientRect()

                p[0] = [v.PosX + (rect1.width / 2), v.PosY + (rect1.height / 2)]
                p[1] = [this._data[v2].PosX + (rect0.width / 2), this._data[v2].PosY + (rect0.height / 2)]

                this.drawArrow(p, this.cc.c0)
            })
        })
    }

    //新規描画用の矢印
    drawSingleArrow(startElement, eX, eY) {
        let p = [
            [],
            [],
        ]

        const rect = startElement.getBoundingClientRect()

        p[0] = [rect.left + window.scrollX + (rect.width / 2), rect.top + window.scrollY + (rect.height / 2)]
        p[1] = [eX, eY]



        this.drawArrow(p, this.cc.c1)
    }

    //削除処理
    deleteNode(_element) {
        const target_num = Number(_element.parentNode.id.replace("l", ""))
        let counts = 0
        let a1 = new Array(this._data.length).fill(0)
        let a2 = [].concat(a1)
        a1 = a1.map((v, i) => {
            if (i === target_num) {
                return undefined
            }
            return i
        })
        a2 = a1.map((v, i) => {
            if (v === undefined) {
                counts -= 1
                return undefined
            } else {
                return counts
            }

        })
        const _nodes = document.querySelectorAll('.Nodes')
        _nodes.forEach((v, i) => {
            if (a1[i] !== undefined) {
                v.id = `l${Number(v.id.replace("l", "")) + a2[i]}`
            } else {
                v.removeAttribute('id')
            }
        })
        this._data = this._data.map((v, i) => {
            v.target = v.target.filter((v2) => {
                return v2 !== target_num
            })

            v.target = v.target.map((v2, i2) => {
                return a1[v2] + a2[v2]
            })

            return v
        })
        this._data.splice(target_num, 1)
        this._data = this._data.map((v, i) => {
            v.id = i
            return v
        })
        ul0.removeChild(_element.parentNode)
        this.drawEdge()
    }

    //データの全削除
    __resetData() {
        this._data = []
        const Nodes = document.querySelectorAll('.Nodes')

        Nodes.forEach((v) => {
            document.querySelector('#ul0').removeChild(v)
        })
        this.cc.clearCanvas0()
    }

    //ベクトルの正規化
    nomalize(x, y) {
        const lengthSq = Math.pow(x, 2) + Math.pow(y, 2)
        const length = Math.sqrt(lengthSq)
        return [x / length, y / length]
    }

    //正規化された座標の90度回転
    rotateHalfPIn(x, y, sign = "+") {
        if (sign === "+") {
            return [-y, x]
        } else if (sign === "-") {
            return [y, -x]

        }
    }


}