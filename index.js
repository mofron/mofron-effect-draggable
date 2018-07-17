/**
 * @file mofron-effect-draggable/index.js
 * @author simpart
 */
let mf = require('mofron');
let Drag = require('mofron-event-drag');

/**
 * @class mofron.effect.Drag
 * @brief drag effect class
 */
mf.effect.Draggable = class extends mf.Effect {
    
    constructor (prm) {
        try {
            super();
            this.name('Draggable');
            this.m_enabled = false;
            this.m_init    = false;
            this.m_stpos   = null;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    contents (flg, cmp) {
        try {
            if (true === flg) {
                this.enable(cmp);
            } else {
                this.disable(cmp);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * switching enable drag effect.
     * enable target component draggable, and initialize some callback
     */
    enable (tgt) {
        try {
            this.m_enabled = true;
            tgt.target().attr({
                draggable : "true"
            });
            tgt.style({
                cursor   : '-webkit-grab'
            });
            if (false === this.m_init) {
                /* set drag event callback */
                let fnc = (tgt, type, prm) => {
                    try {
                        if (false === prm.isEnabled()) {
                            /* this effect is disabled, skip event */
                            return;
                        }
                        if ('dragstart' === type) {
                            prm.dragStart(tgt);
                        } else if ('drag' === type) {
                            prm.drag(tgt);
                        } else if ('dragend' === type) {
                            prm.dragEnd(tgt);
                        } else {
                            throw new Error('not supported type');
                        }
                    } catch (e) {
                        console.error(e.stack);
                        throw e;
                    }
                }
                tgt.addEvent(
                    new Drag({
                        addType : ['drag', 'dragstart', 'dragend'],
                        handler : new mf.Param(fnc, this)
                    })
                );
                
                /* set event callback for mouse position */
                let eff     = this;
                let msc_fnc = (e) => {
                    try {
                        if ( (0 === e.clientX) && (0 === e.clientY) ) {
                            return;
                        }
                        eff.mousePos(
                            e.clientX,
                            e.clientY
                        );
                    } catch (e) {
                        console.error(e.stack);
                        throw e;
                    }
                }
                if (document.addEventListener) {
	            document.addEventListener("drag", msc_fnc);
                    document.addEventListener("dragstart", msc_fnc);
	        } else if (document.attachEvent) {
	            document.attachEvent("ondrag", msc_fnc);
                    document.attachEvent("ondragstart", msc_fnc);
	        }
                this.m_init = true;
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * switching disable, target component could not drag.
     */
    disable (tgt) {
        try {
            this.m_enabled = false;
            tgt.target().attr({
                draggable : "false"
            });
            tgt.style({
                cursor   : 'auto'
            });
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * get enable flag
     *
     * @return true : this component is draggable (enable)
     * @return false : this component is not draggable (disable)
     */
    isEnabled () {
        try {
            return this.m_enabled;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    dragStart (tgt) {
        try {
            tgt.style({
                position : 'relative',
            });
            setTimeout(
                (prm) => {
                    prm.visible(false);
                },
                50,
                tgt
            );
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    drag (tgt) {
        try {
            if (null === this.m_stpos) {
                let stpos = this.mousePos();
                this.m_stpos = [stpos[0], stpos[1]];
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    dragEnd (tgt) {
        try {
            if (null === this.m_stpos) {
                return;
            }
            let pos     = this.mousePos();
            let cmp_pos = [
                mofron.func.getLength(tgt.adom().style('left')),
                mofron.func.getLength(tgt.adom().style('top'))
            ];
            cmp_pos[0] = (null === cmp_pos[0]) ? 0 : cmp_pos[0];
            cmp_pos[1] = (null === cmp_pos[1]) ? 0 : cmp_pos[1];
            
            tgt.adom().style({
                left : cmp_pos[0] + (pos[0] - this.m_stpos[0])  + 'px',
                top  : cmp_pos[1] + (pos[1] - this.m_stpos[1]) + 'px'
            });
            
            this.m_stpos = null;
            tgt.visible(true);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * mouse position getter / setter
     *
     * @param x : x position
     * @param y : y position
     */
    mousePos (x, y) {
        try {
            if (undefined === x) {
                /* getter */
                return (undefined === this.m_mousep) ? null : this.m_mousep;
            }
            /* setter */
            if ( ('number' !== typeof x) || ('number' !== typeof y) ) {
                throw new Error('invalid parameter');
            }
            if (undefined === this.m_mousep) {
                this.m_mousep = new Array(null, null);
            }
            this.m_mousep[0] = x;
            this.m_mousep[1] = y;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
module.exports = mofron.effect.Draggable;
/* end of file */
