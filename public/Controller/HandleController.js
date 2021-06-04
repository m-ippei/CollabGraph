/**
 * html要素とJSON_DRAWERを繋ぐクラス
 */
export class HandleController {
    constructor() {
        this.connects = []
        this.clickX = 0
        this.clickY = 0
        this.selectElement = null
    }

    NodeAdd() {
        if (g.queryUIv1.value === "") {
            window.confirm("Please enter a new title")
        } else {
            g.sc.fire('NodeAdd', { 'NodeTitle': g.queryUIv1.value, 'PosX': this.clickX, 'PosY': this.clickY })

            g.queryUIv1.value = ""
            g.contextmenu0.style.display = "none"
        }
    }

    editTitle() {
        if (this.selectElement !== null) {
            const _id = Number(this.selectElement.parentNode.id.replace("l", ""))
            let newTitle = window.prompt("Edit Title", g.jd._data[_id].title)
            if (newTitle === null || newTitle === "") {
                //No operation
            } else {
                g.sc.fire('editTitle', { "id": _id, "newTitle": newTitle })
            }
            this.close()
            this.selectElement = null
        }
    }

    NodeDelete() {
        if (this.selectElement !== null) {
            const result = window.confirm("Delete Node?")
            if (result) {
                const target_num = Number(this.selectElement.parentNode.id.replace("l", ""))
                g.sc.fire('deleteNode', { "target_num": target_num })
            }
            this.close()
            this.selectElement = null
        }
    }

    close() {
        g.contextmenu0.style.display = "none"
        g.list_contextmenu.style.display = "none"
        g.hc.connects = []
        g.jd.cc.is_drawSingleArrow = true
    }

}