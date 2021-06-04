/**
 * Nodeを動かした際の時間管理と状態を設定・保持するクラス
 */

export class moveController {
    constructor(taptime = 400) {
        this.t;
        this.states = ['none', 'move']
        this.state = this.states[0]
        this.offX = 0
        this.offY = 0
        this.taptime = taptime
    }

    clear(element) {
        if (element !== null) {
            element.style.boxShadow = ''
            element.firstChild.style.cursor = 'auto'
            clearTimeout(this.t)
            this.state = this.states[0]
            this.offX = 0
            this.offY = 0
        }
    }

    down(element, eX, eY) {
        const rect = element.getBoundingClientRect()
        this.offX = eX - rect.left - window.scrollX
        this.offY = eY - rect.top - window.scrollY
        this.t = setTimeout(() => {
            this.state = this.states[1]
            element.firstChild.style.cursor = 'move'
            element.style.boxShadow = '0px 4px 10px rgba(0,0,0,0.4)'
        }, this.taptime)
    }

    up(element) {
        this.clear(element)
    }

    leave(element) {
        this.clear(element)
    }

    move(element, eX, eY) {
        if (this.state === 'move') {
            element.style.left = eX - this.offX + 'px'
            element.style.top = eY - this.offY + 'px'
        }
    }


}