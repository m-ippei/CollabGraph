
/**
 * メインとなるクラス
 * 全クライアント用のJSONを保持更新と配信を行う
 */
module.exports = class JSON_SERVER {
    constructor(obj) {
        //初期化JSONの判定
        if (obj) {
            //DeepCopy
            this._data = JSON.parse(JSON.stringify(obj))
            //timestamp値の追加
            this._data = this._data.map((v, i) => {
                v.timestamp = Date.now() + i
                return v
            })
        } else {
            this._data = []
        }
    }

    //ノードの追加処理

    add(obj, option) {
        this._data.push(obj)
    }

    /**
     * 新規Nodeの追加
     * @param {string} title 
     * @param {number} x 
     * @param {number} y 
     * @param {number} timestamp 
     */
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
    update_NodePos(num_id, x, y) {
        this._data[num_id].PosX = x
        this._data[num_id].PosY = y
    }

    //コネクタの更新処理
    update_NodeTarget(num_id, add_num_id) {
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

    //titleの編集
    editTitle(edit_id, newTitle) {
        this._data[edit_id].title = newTitle
    }

    //削除処理
    deleteNode(target_num) {
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
    }


    //データの全削除
    __resetData() {
        this._data = []
    }
}