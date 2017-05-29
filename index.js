/**
 * @file mofron-effect-draggable/index.js
 * @author simpart
 */
require('mofron-event-drag');

/**
 * @class mofron.effect.Drag
 * @brief drag effect class
 */
mofron.effect.Draggable = class extends mofron.Effect {
    
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
                // set drag event
                let fnc = (tgt, type, prm) => {
                    try {
                        if (false === prm.isEnabled()) {
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
                    new mofron.event.Drag({
                        addType : ['drag', 'dragstart', 'dragend'],
                        handler : new mofron.Param(fnc, this)
                    })
                );
                
                /* set mouse event */
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
    
    disable () {
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
            mofron.effect.draggable_comp = tgt;
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
                mofron.func.getLength(tgt.vdom().style('left')),
                mofron.func.getLength(tgt.vdom().style('top'))
            ];
            cmp_pos[0] = (null === cmp_pos[0]) ? 0 : cmp_pos[0];
            cmp_pos[1] = (null === cmp_pos[1]) ? 0 : cmp_pos[1];
            
            tgt.vdom().style({
                left : cmp_pos[0] + (pos[0] - this.m_stpos[0])  + 'px',
                top  : cmp_pos[1] + (pos[1] - this.m_stpos[1]) + 'px'
            });
            
            this.m_stpos = null;
            mofron.effect.draggable_comp = null;
            tgt.visible(true);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
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
mofron.effect.draggable = {};
mofron.effect.draggable_comp = null;
module.exports = mofron.effect.Draggable;
