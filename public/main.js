import { JSON_DRAWER } from './JSON_DRAWER/JSON_DRAWER.js'
import { HandleController } from './Controller/HandleController.js'
import { moveController } from './Controller/moveController.js'
import { socketController } from './Socket/socketController.js'

//初期JSON　無しでもいい
const json_data = [
    {
        "id": 0,
        "PosX": 100,
        "PosY": 100,
        "title": "QuickDrag -> DrawEdge",
        "target": [1]
    }, {
        "id": 1,
        "PosX": 200,
        "PosY": 200,
        "title": "Hold on Label -> Move",
        "target": [2]
    }, {
        "id": 2,
        "PosX": 300,
        "PosY": 300,
        "title": "RightClick on Label -> Edit Title or Delete",
        "target": []
    }, {
        "id": 3,
        "PosX": 400,
        "PosY": 100,
        "title": "RightClick on Window -> Menu",
        "target": []
    },
]


//グローバル変数
window.g = {
    //外部クラス
    jd: new JSON_DRAWER(json_data),
    hc: new HandleController(),
    mc: new moveController(),
    sc: new socketController(io('http://localhost:3000')),
    //ファイル読み込み用
    FileRead: document.querySelector('#FileRead'),
    //テキストボックス
    queryUIv1: document.querySelector('#UIv1'),
    //右クリックメニュー
    contextmenu0: document.querySelector('#contextmenu0'),
    //リストの上の表示するコンテキストメニュー
    list_contextmenu: document.querySelector('#list_contextmenu'),
    //リスト
    ul0: document.querySelector('#ul0'),
    //JSONの表示
    show_JSON: function () {
        const bom = new Uint8Array([0xFF, 0xFE])
        const array = Uint16Array.from(JSON.stringify(g.jd._data, null, 4), c => c.charCodeAt(0))
        const blob = new Blob([bom, array], {
            type: "text/plain"
        })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.target = "_blank"
        link.click()
    },
    removeAll: function () {
        //操作保留


        const result = window.confirm('Are you sure you want to delete everything?')
        if (result) {
            g.sc.fire('removeAll')
        }

    },
    expands: false,
    switch_expands: function () {
        if (g.expands) {
            document.body.style.overflow = 'hidden'
            g.expands = false
        } else {
            document.body.style.overflow = 'scroll'
            g.expands = true
        }
    },
    handleClearLoadGraph: function (json_obj) {
        g.jd.__resetData()
        json_obj.forEach((v) => {
            g.jd.add(v, {
                skip: true
            })
        })
        const mX = json_obj.reduce((acc, cur) => {
            return Math.max(acc, cur.PosX)
        }, 0)
        const mY = json_obj.reduce((acc, cur) => {
            return Math.max(acc, cur.PosY)
        }, 0)

        g.jd.cc.canvasSizingAll(mX + window.innerWidth / 2, mY + window.innerHeight / 2)

        g.jd.drawEdge()
    },
}

//JSONファイルの読み込み
window.g.FileRead.addEventListener('change', (event) => {
    const reader = new FileReader()
    reader.onload = () => {
        g.sc.fire('read_JSON', { "data": JSON.parse(reader.result) })
    }
    reader.readAsText(event.target.files[0])
})

//Enterで決定
window.g.queryUIv1.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.keyCode === 13) {
        g.hc.NodeAdd()
    }
})

