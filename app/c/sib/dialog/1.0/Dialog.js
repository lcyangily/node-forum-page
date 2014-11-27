/**   
 * @Title: Dialog.js 
 * @author liuchuanyang
 * @email  lcyangily@gmail.com
 * @date 2014-2-11
 */
define(function(require, exports, module){

    //导入依赖样式资源
    require('css!./dialog.css');
    
    var $      = require('../../core/1.0/jQuery+'),
        SIB    = require('../../core/1.0/Sib'),
        Widget = require('../../core/1.0/Widget'),
        Mask   = require('./Mask'),
        w = (function(){return this})(), d = w.document;

    //默认值
    var defaults = {
        //appendTo : "",
        //autoOpen : true,
        trigger : null,
        title : null,
        content : null,

        //buttons : [], //object | array
        closeOnEscape : true, //当前对话框获取焦点的情况下，是否允许ESC键关闭
        closeText : '×',
        //dialogClass : '',
        height : 'auto',
        width : 'auto',
        maxHeight : null,
        maxWidth : null,
        minHeight : 100,
        minWidth : 150,
        modal : false,
        position : {
            my : 'center',
            at : 'center',
            of : w,
            collision : 'fit',
            // 保证顶部header和close按钮始终能在可视区域内
            using: function( pos ) {
                var topOffset = $( this ).css( pos ).offset().top;
                if ( topOffset < 0 ) {
                    $( this ).css( "top", pos.top - topOffset );
                }
            }
        },
        draggable : false,
        //resiable : true,
        //show : null, //显示时动画
        //hide : null, //关闭时动画

        //简单的动画效果 none | fade | slide
        effect : '',
        zIndex : 999,

        //callback event
        beforeClose : null,
        close : null,
        drag : null,
        dragStart : null,
        dragStop : null,
        focus : null,
        open : null/*,
        resize : null,
        resizeStart : null,
        resizeStop : null*/
    };

    var dTmpl = '<div class="{clsPrefix}" data-role="dialog">' +
                    '<div class="{clsPrefix}-header sib-clearfix" data-role="header">' + 
                        '<span class="{clsPrefix}-title" data-role="title">{title}</span>' +
                    '</div>'+
                    '<a class="{clsPrefix}-close" title="Close" href="javascript:;" data-role="close"></a>' +
                    '<div class="{clsPrefix}-content" data-role="content"></div>' +
                '</div>';

    var D, Dialog;
    D = Dialog = Widget.extend({
        static : {
            widgetName : 'SIBDialog',
            require : require,
            optionFilter : 'target',
            clsPrefix : 'sib-dialog',
            defaults : defaults,
            template : dTmpl,
            allDialogs : [],
            mask : new Mask(),
            MIN_WIDTH : 50,
            MAX_WIDTH : $(w).width()
        },
        private : {
            _prepareOption : function() {
                var state = this.state,
                    opts = state.options,
                    $el = this.$element,
                    self = this;

                state.zIndex = +opts.zIndex;
                state.$dialog  = $el;
                state.$header  = $el.find('>[data-role=header]');
                state.$close   = $el.find('>[data-role=close]');
                state.$content = $el.find('>[data-role=content]');
                if(opts.trigger) {
                    var $t = $(opts.trigger);
                    state.$trigger = $t.length > 0 ? $t : null;
                }

                //内容类型
                state.contentType = getType();
                
                function getType() {
                    var type = '';
                    if (/^(https?:\/\/|\/|\.\/|\.\.\/)/.test(opts.content)) {
                        type = "iframe";
                    }
                    return type;
                }
            },
            //构造HTML
            _buildHTML : function() {
                var state = this.state, 
                    $el = this.$element,
                    opts = state.options,
                    $content = state.$content;

                //title
                var title = opts.title || '';
                if(opts.title) {
                    state.$header.find('[data-role=title]').text(title);
                } else {
                    state.$header.remove();
                    state.$header = null;
                }

                $el.attr('tabIndex', -1);
                
                //close
                state.$close.html(opts.closeText);

                //非iframe情况
                if (state.contentType !== "iframe") {
                    var value;
                    // 有些情况会报错
                    try {
                        value = $(opts.content);
                    } catch (e) {
                        value = [];
                    }
                    if (value[0]) {
                        $content.empty().append(value);
                        value.show();   //如果是dom节点,大部分情况是先隐藏在页面中，生成Dialog后显示,先将这种情况下内容显示
                    } else {
                        $content.empty().html(opts.content);
                    }
                    //this._position();
                }
            },
            _bindEvents : function(){
                var state = this.state,
                    opts = state.options,
                    $dialog = state.$dialog,
                    $header = state.$header,
                    self = this;

                this._on({
                    //绑定ESC键和TAB键事件
                    keydown: function( event ) {
                        if ( opts.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
                                event.keyCode === SIB.keyCode.ESCAPE ) {
                            event.preventDefault();
                            this.close( event );
                            return;
                        }

                        // prevent tabbing out of dialogs
                        if ( event.keyCode !== SIB.keyCode.TAB ) {
                            return;
                        }
                        var $tabbables = $dialog.find('input,select,textarea,button,object').not(':disabled').filter(':visible');
                            $first = $tabbables.filter( ":first" ),
                            $last = $tabbables.filter( ":last" );

                        if (( event.target === $last[0] || event.target === $dialog[0]) && !event.shiftKey) {
                            $first.focus();
                            event.preventDefault();
                        } else if ( ( event.target === $first[0] || event.target === $dialog[0] ) && event.shiftKey ) {
                            $last.focus();
                            event.preventDefault();
                        }
                    },
                    mousedown: function( event ) {
                        if ( this.moveToTop( event ) ) {
                            $dialog.focus();
                        }
                    }
                });

                this._on({
                    //关闭窗口时，将显示的zIndex最大的窗口获取焦点
                    close : function( event ){
                        var zIndexMax = 0,
                            topDialog;
                        $.each(D.allDialogs, function(idx, obj){
                            //获取显示的且z-index最大的
                            if(obj.isOpen() && obj.state.zIndex > zIndexMax) {
                                zIndexMax = obj.state.zIndex;
                                topDialog = obj;
                            }
                        });
                        topDialog && topDialog.moveToTop();
                    }
                });
                //关闭按钮
                this._on( state.$close, {
                    click: function( event ) {
                        event.preventDefault();
                        this.close( event );
                    }
                });

                if(state.$trigger) {
                    state.$trigger.on('click', function(e){
                        state.$activeTrigger = $(e.currentTarget);
                        self.open();
                    });
                }
                
                D.mask._on({
                    'maskfoucs' : function(evt, data) {
                        if(data.$dialog[0] == state.$dialog[0]) {
                            state.$dialog.focus();
                        }
                    }
                });
                
                if(opts.draggable && $header) {
                    
                    $dialog.drag('init', function(ev, dd){
                        
                    },{
                        handle : $header
                        
                    }).drag('start', function(ev, dd){
                        $( this ).css({
                            opacity: .75,
                            cursor: 'crosshair'
                        });
                    }).drag(function(ev, dd){
                        $( this ).css({
                            top: dd.offsetY,
                            left: dd.offsetX
                        });
                    }).drag('end', function(){
                        $( this ).css({
                            opacity: '',
                            cursor: ''
                        });
                    });
                }
            },
            _size: function() {
                //reset
                var state = this.state,
                    opts = state.options,
                    $dialog = state.$dialog,
                    $content = state.$content,
                    nonContentHeight, //内容高度设置为0的dialog高度
                    minContentHeight, 
                    maxContentHeight,
                    width = opts.width,
                    maxW = parseFloat(opts.maxWidth) || D.MAX_WIDTH,
                    minW = parseFloat(opts.minWidth) || D.MIN_WIDTH;

                // Reset content sizing
                $content.show().css({
                    width: "auto",
                    minHeight: 0,
                    maxHeight: "none",
                    height: 0
                });

                if(opts.width == 'auto') {
                    $dialog.width('auto');
                    var autoW = SIB.width($dialog);

                    if(autoW > maxW) {
                        $dialog.outerWidth(maxW);
                    }
                    if(autoW < minW) {
                        $dialog.outerWidth(minW);
                    }
                } else {
                    if(opts.minWidth) {
                        width = Math.max(width, minW);
                    }
                    if(opts.maxWidth) {
                        width = Math.min(width, maxW);
                    }
                    $dialog.outerWidth(width);
                }

                //reset dialog
                nonContentHeight = $dialog.css({
                        height: "auto"
                    }).outerHeight();
                minContentHeight = Math.max( 0, opts.minHeight - nonContentHeight );
                maxContentHeight = typeof opts.maxHeight === "number" ?
                    Math.max( 0, opts.maxHeight - nonContentHeight ) :
                    "none";

                if ( opts.height === "auto" ) {
                    $content.css({
                        minHeight: minContentHeight,
                        maxHeight: maxContentHeight,
                        height: "auto"
                    });
                } else {
                    $content.height( Math.max( 0, opts.height - nonContentHeight ) );
                }

                /*if (this.uiDialog.is(":data(ui-resizable)") ) {
                    this.uiDialog.resizable( "option", "minHeight", this._minHeight() );
                }*/
            },
            _position: function() {
                var state = this.state,
                    opts = state.options,
                    $dialog = state.$dialog;

                var isVisible = $dialog.is( ":visible" );
                if ( !isVisible ) {
                    $dialog.show();
                }

                $dialog.position( opts.position );
 
                if ( !isVisible ) {
                    $dialog.hide();
                }
            },
            _setupMask : function() {
                //显示/关闭遮罩层
                this._on({
                    open : this._showMask,
                    close : this._hideMask
                });
            },
            //创建/显示遮罩层
            _showMask: function() {
                var state = this.state,
                    opts = state.options,
                    $dialog = state.$dialog;

                if ( !opts.modal ) {//非模态窗口，直接返回
                    return;
                }

                D.mask.maskTo($dialog);
            },
            //当前窗口关闭，隐藏遮罩或遮罩显示在其他窗口下
            _hideMask : function(){
                var state = this.state,
                    opts = state.options;
                
                if(!opts.modal) {
                    return;
                }

                var topDialog,//最上层有遮罩的窗口
                    zIndexMax = 0;
                $.each(D.allDialogs, function(idx, obj){
                    //显示 & 模态
                    if(obj.isOpen() && obj.state.options.modal && obj.state.zIndex > zIndexMax) {
                        zIndexMax = obj.state.zIndex;
                        topDialog = obj;
                    }
                });

                if(zIndexMax && topDialog) {
                    D.mask.maskTo(topDialog.$element);
                } else {
                    D.mask.hide();
                }
            },
            //在最上层显示
            _moveToTop : function( event, silent ) {
                var state = this.state,
                    opts = state.options,
                    $dialog = state.$dialog,
                    moved = false;

                if(!D.zIndexMax) {
                    var zIndicies = $.map(D.allDialogs, function(obj, idx) {
                        return +obj.state.zIndex;
                    });
                    D.zIndexMax = Math.max.apply( null, zIndicies );
                }

                if ( D.zIndexMax >= state.zIndex ) {
                    D.zIndexMax = state.zIndex = D.zIndexMax + 1;
                    $dialog.css( "z-index", state.zIndex );
                    if(opts.modal) {
                        D.mask.maskTo($dialog, state.zIndex);
                    }

                    moved = true;
                }

                if ( moved && !silent ) {
                    this._trigger( "focus", event );
                }
                return moved;
            },
            _showIframe: function() {
                var state = this.state,
                    opts = state.options,
                    $dialog = state.$dialog,
                    that = this;

                // 若未创建则新建一个
                if (!state.$iframe) {
                    this._createIframe();
                }
                // 开始请求 iframe
                state.$iframe.attr({
                    src: fixUrl(),
                    name: D.WN + "-iframe" + new Date().getTime()
                });
                // iframe不支持0级DOM的onload事件绑定，所以 IE 下 onload 无法触发
                // 用 $().one 函数来代替 onload,只执行一次
                state.$iframe.one("load", function() {
                    // 如果 dialog 已经隐藏了，就不需要触发 onload
                    if (!$dialog.is(":visible")) {
                        return;
                    }
                    // 绑定自动处理高度的事件
                    /*if (that.get("autoFit")) {
                        clearInterval(that._interval);
                        that._interval = setInterval(function() {
                            that._syncHeight();
                        }, 300);
                    }
                    that._syncHeight();
                    that._setPosition();*/
                    //that.trigger("complete:show");
                    that._syncIframeHeight();
                });

                //URL添加时间戳
                function fixUrl() {
                    var s = opts.content.match(/([^?#]*)(\?[^#]*)?(#.*)?/),
                        tempName = 't',
                        tempValue = new Date().getTime();
                    s.shift();
                    if(s[1] && s[1] !== "?") {
                        //防止重名
                        while(tempName.indexOf(tempName + '=') >= 0){
                            tempName += 't';
                        }
                        s[1] += '&' + tempName + '=' + tempValue;
                    } else {
                        s[1] = '?t=' + tempValue;
                    }
                    return s.join("");
                }
            },
            _createIframe: function() {
                var state = this.state,
                    $content = state.$content;

                var $iframe = state.$iframe = $("<iframe>", {
                    src: "javascript:'';",
                    scrolling: "no",
                    frameborder: "no",
                    allowTransparency: "true",
                    css: {
                        border: "none",
                        width: "100%",
                        display: "block",
                        height: "100%",
                        overflow: "hidden"
                    }
                }).appendTo($content);
                // 给 iframe 绑一个 close 事件
                // iframe 内部可通过 window.frameElement.trigger('close') 关闭
                //Events.mixTo(this.iframe[0]);
                this._on($iframe, {
                    "close" : function(e) {
                        this.close();
                    }
                });
            },
            _setIframeHeight : function(){
                var state = this.state,
                    opts = state.options,
                    $el = this.$element,
                    $content = state.$content,
                    h;
                // 如果未传 height，才会自动获取
                try {
                    h = getIframeHeight(state.$iframe) + "px";
                } catch (err) {
                    // 页面跳转也会抛错，最多失败6次
                    state._errCount = (state._errCount || 0) + 1;
                    if (state._errCount >= 6) {
                        // 获取失败则给默认高度 300px
                        // 跨域会抛错进入这个流程
                        h = opts.minHeight;
                        clearInterval(state._interval);
                        delete state._interval;
                    }
                }
                $content.css("height", h);
                // force to reflow in ie6
                // http://44ux.com/blog/2011/08/24/ie67-reflow-bug/
                $el[0].className = $el[0].className;
                
                // 获取 iframe 内部的高度
                function getIframeHeight($iframe) {
                    var doc = $iframe[0].contentWindow.document;
                    if (doc.body.scrollHeight && doc.documentElement.scrollHeight) {
                        return Math.min(doc.body.scrollHeight, doc.documentElement.scrollHeight);
                    } else if (doc.documentElement.scrollHeight) {
                        return doc.documentElement.scrollHeight;
                    } else if (doc.body.scrollHeight) {
                        return doc.body.scrollHeight;
                    }
                }
            },
            _show : function(fn){
                var state = this.state,
                    opts = state.options,
                    $dialog = state.$dialog,
                    $content = state.$content;

                // iframe 要在载入完成才显示
                if (state.contentType === "iframe") {
                    // iframe 还未请求完，先设置一个固定高度
                    //!this.get("height") && this.contentElement.css("height", this.get("initialHeight"));
                    $content.height(opts.height || 300);
                    this._showIframe();
                }

                //this.render();
                if('slide' == opts.effect) {
                    $dialog.slideDown(fn);
                } else if('fade' == opts.effect) {
                    $dialog.fadeIn(fn);
                } else {
                    $dialog.show(fn);
                }

                //$dialog.focus();
                //this._focusChildEle();
                this._trigger("focus");
            }
        },
        public : {
            _init : function(){
                this._prepareOption();
                /**暂不构建html,render时再构造html(懒构造),如果先buildHTML,而没有open(render),
                 * 则在DOM中无window的html节点了,DOM中可能有其他一些组件初始化，则无法找到元素
                 */
                //this._buildHTML();
                this._bindEvents();
                this._setupMask();
                D.allDialogs.push(this);
            },
            //iframe内容加载完，同步iframe高度
            _syncIframeHeight : function(){
                var state = this.state,
                    opts = state.options;
                // 绑定自动处理高度的事件
                if (!opts.height || opts.height === 'auto') {
                    clearInterval(state._interval);
                    state._interval = setInterval($.proxy(this._setIframeHeight, this), 300);
                }
            },
            _focusDialogEle: function() {
                var state = this.state,
                    $dialog = state.$dialog;
                var hasFocus = $dialog.find("[autofocus]");
                if ( !hasFocus.length ) {
                    hasFocus = $dialog.find('input,select,textarea,button,object').not(':disabled').filter(':visible');
                }
                hasFocus.eq(0).focus();
            },
            render : function(){
                var state = this.state;

                if(state.rendered) {
                    return;
                }
                this._super();
                this._buildHTML();
                return ;
            },
            isOpen : function(){
                return this.state._isOpen;
            },
            moveToTop : function(){
                return this._moveToTop();
            },
            open : function() {
                var state = this.state,
                    opts  = state.options,
                    $dialog = state.$dialog,
                    that  = this;

                if ( state._isOpen ) {
                    if ( this._moveToTop() ) {
                        $dialog.focus();
                        that._focusDialogEle();
                    }
                    return;
                } else {
                    //先将Dialog加入到页面，否则后面设置位置有问题，IE下position为relative
                    this.render();
                }

                state._isOpen = true;
                //state.opener = $( $el.document[0].activeElement );
                this._size();
                this._position();
                this._moveToTop( null, true );
                $dialog.hide(); //先隐藏，不然第一次弹出时没有动画效果
                this._show(function(){
                    $dialog.focus();
                    that._focusDialogEle();
                });
                this._trigger("open");
            },
            close : function( event ){
                var state = this.state,
                    opts = state.options,
                    $dialog = state.$dialog,
                    that = this;

                if ( !state._isOpen || this._trigger( "beforeClose", event ) === false ) {
                    return;
                }

                state._isOpen = false;

                if('slide' == opts.effect) {
                    $dialog.slideUp();
                } else if('fade' == opts.effect) {
                    $dialog.fadeOut();
                } else {
                    $dialog.hide();
                }
                this._trigger('hide', event);
                this._trigger('close', event);
            },
            refresh : function(){
                var state = this.state,
                    opts = state.options;
            },
            destroy : function(){
                
            }
        }
    });

    return D;
});
