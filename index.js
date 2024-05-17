/**
 * @file mofron-effect-draggable/index.js
 * @brief draggable effect module for mofron component
 * @license MIT
 */
const Drag    = require('mofron-event-drag');
const MouseUp = require('mofron-event-mouseup');
const ConfArg = mofron.class.ConfArg;
const comutl  = mofron.util.common;

module.exports = class extends mofron.class.Effect {
    /**
     * initialize effect
     * 
     * @param (mixed) 
     *                key-value: effect config
     * @short
     * @type private
     */
    constructor (p1) {
        try {
            super();
            this.modname("Draggable");

            /* init config */
	    this.confmng().add('is_drag', { type:'boolean', init:false });
            this.confmng().add('drag_base_pos', { type:'array', init:[-1,-1] });
            this.confmng().add('dragTarget', { type:'object' });
            this.confmng().add("dragArea", { type:'array', init:[-1,-1,-1,-1] });
            
	    if (0 < arguments.length) {
                this.config(p1);
	    }
            
            let thisobj = this;
	    mofron.window.event([
	        //new Drag(new ConfArg(window_drag,this)),
                new Drag((d1,d2,d3) => { thisobj.drag(d1,d2,thisobj); }),
                new MouseUp(() => { thisobj.is_drag(false); })
            ]);

        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    dragArea (left, right, top, bottom) {
        try {
	    if (undefined === left) {
                return this.confmng("dragArea");
	    }
	    this.confmng("dragArea", [left, right, top, bottom]);
	} catch (e) {
            console.error(e.stack);
            throw e;
        }
    }


    drag (w1,w2,w3) {
        try {
            if (true === w3.suspend()) {
                /* skip effect */
                return;
            }
            let comp_pos = {
                'left': comutl.getsize(w3.component().style('left')).toPixel(),
                'top': comutl.getsize(w3.component().style('top')).toPixel()
            };
            let comp_siz = {
                'height': comutl.getsize(w3.component().height()).toPixel(),
                'width': comutl.getsize(w3.component().width()).toPixel()
            }
            
            /* check drag */
            if (true === w3.is_drag()) {
                /* dragging */
                // update position
                let base_pos = w3.confmng('drag_base_pos');
                w3.component().style({
                    'left': w2.pageX - base_pos[0] + 'px',
                    'top': w2.pageY - base_pos[1] + 'px'
                });
            } else {
                /* start drag */
                // check drag area
                let drag_area = w3.dragArea();
                if ( !(comp_pos.left+drag_area[0] < w2.pageX) &&
                     !((comp_pos.left+drag_area[1]) > w2.pageX) ) {
                    return;
                } else if ( !(comp_pos.top+drag_area[2] < w2.pageY) &&
                            !((comp_pos.top+drag_area[3]) > w2.pageY) ) {
                    return;
                }
                
                // update drag status
                w3.is_drag(true);
                
                // set base position
                w3.confmng('drag_base_pos', [w2.pageX-comp_pos.left, w2.pageY-comp_pos.top]);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    is_drag (prm) {
        try {
            if (false === prm) {
                this.confmng('drag_base_pos', [-1,-1]);
            }
            return this.confmng('is_drag', prm);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
