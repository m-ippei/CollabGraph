/**
 * canvas関連の設定をする
 */

export class canvasController {
    constructor() {
        //Edgeの自動描画用
        this.canvas0 = document.querySelector('#canvas0')
        this.c0 = this.canvas0.getContext('2d')

        //Edgeの手動描画用
        this.canvas1 = document.querySelector('#canvas1')
        this.c1 = this.canvas1.getContext('2d')

        this.canvasSizingAll(window.innerWidth, window.innerHeight)

        this.keydown = false
        this.keycode = ''
        this.is_drawSingleArrow = true

        this.canvas1.addEventListener('contextmenu', (event) => {
            g.contextmenu0.style.display = "flex"
            g.contextmenu0.style.left = event.pageX + "px"
            g.contextmenu0.style.top = event.pageY + "px"
            g.hc.clickX = event.pageX
            g.hc.clickY = event.pageY
        })
        this.canvas1.addEventListener('pointerdown', (event) => {
            g.contextmenu0.style.display = "none"
            g.list_contextmenu.style.display = "none"
            g.jd.cc.is_drawSingleArrow = true
            g.hc.connects = []
        })

        this.canvas1.addEventListener('pointermove', (event) => {
            if (g.mc.state === 'none') {
                if (g.hc.connects.length > 0) {
                    if (this.is_drawSingleArrow) {
                        const _element = document.querySelector(`#l${g.hc.connects[0]}`)
                        this.clearCanvas1()
                        g.jd.drawSingleArrow(_element, event.pageX, event.pageY)
                    }
                }
            }

        })

        this.canvas1.addEventListener('pointerup', (event) => {

            if (this.keydown) {
                if (this.keycode === 'Shift') {
                    const result = window.prompt('New Title')
                    if (result) {
                        g.jd.add(g.jd.createNode(result, event.pageX, event.pageY))
                        g.jd.updateData_target(g.hc.connects[0], g.jd._data.length - 1)
                        const _element = document.querySelector(`#l${g.hc.connects[0]}`)
                        g.mc.up(_element)
                        g.hc.connects = []
                        g.jd.drawEdge()
                        this.clearCanvas1()
                    }
                    this.keydown = false
                    this.keycode = ''
                }
            } else {
                if (g.hc.connects > 0) {
                    const _element = document.querySelector(`#l${g.hc.connects[0]}`)
                    g.mc.up(_element)
                }
                g.hc.connects = []
                this.clearCanvas1()
            }
        })

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Shift') {
                this.keydown = true
                this.keycode = 'Shift'
            }
        })


        document.addEventListener('keyup', (event) => {
            if (event.key === 'Shift') {
                this.keydown = false
                this.keycode = 'Shift'
            }
        })


        window.onresize = () => {
            if (this.canvas0.width < window.innerWidth) {
                this.canvas0.width = window.innerWidth
                this.canvas1.width = window.innerWidth
            }
            if (this.canvas0.height < window.innerHeight) {
                this.canvas0.height = window.innerHeight
                this.canvas1.height = window.innerHeight
            }
            g.jd.drawEdge()
        }

    }

    canvasSizing(layer = "0", width, height) {
        if (layer === "0") {
            this.canvas0.width = width
            this.canvas0.height = height
        } else if (layer === "1") {
            this.canvas1.width = width
            this.canvas1.height = height
        }
    }

    canvasSizing01W(width) {
        this.canvas0.width = width
        this.canvas1.width = width
    }

    canvasSizing01H(height) {
        this.canvas0.height = height
        this.canvas1.height = height
    }

    canvasSizingAll(width, height) {
        this.canvasSizing("0", width, height)
        this.canvasSizing("1", width, height)
    }

    clearCanvas0() {
        this.c0.clearRect(0, 0, this.canvas0.width, this.canvas0.height)
    }

    clearCanvas1() {
        this.c1.clearRect(0, 0, this.canvas0.width, this.canvas0.height)
    }
}