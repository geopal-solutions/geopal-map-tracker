/**
 * Ext.geopal.util.LinkButton
 */

Ext.define('Ext.geopal.util.LinkButton', {
    extend: 'Ext.Button',
    template: new Ext.Template(
        '<table border="0" cellpadding="0" cellspacing="0" class="x-btn-wrap"><tbody><tr>',
        '<td class="x-btn-left"><i> </i></td><td class="x-btn-center"><a class="x-btn-text" href="{1}" target="{2}">{0}</a></td><td class="x-btn-right"><i> </i></td>',
        "</tr></tbody></table>"),

    /**
     *
     * @param ct
     * @param position
     */
    onRender: function (ct, position) {
        var btn, targs = [this.text || ' ', this.href, this.target || "_self"];
        if (position) {
            btn = this.template.insertBefore(position, targs, true);
        } else {
            btn = this.template.append(ct, targs, true);
        }
        var btnEl = btn.child("a:first");
        btnEl.on('focus', this.onFocus, this);
        btnEl.on('blur', this.onBlur, this);


        this.initButtonEl(btn, btnEl);
        Ext.ButtonToggleMgr.register(this);
    },


    /**
     *
     * @param e
     */
    onClick: function (e) {
        if (e.button != 0) {
            return;
        }
        if (!this.disabled) {
            this.fireEvent("click", this, e);
            if (this.handler) {
                this.handler.call(this.scope || this, this, e);
            }
        }
    }
});
