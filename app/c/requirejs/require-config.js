/*requirejs.config({
    baseUrl : '../../c',
    map : {
        '*' : {
            'css' : 'requirejs/css'
        }
    },
    paths : {
        'handlebars'      : 'gallery/handlebars/handlebars',
        'hbs-helper.calc' : 'gallery/handlebars/helper/calc',
        'jquery'          : 'sib/core/1.0/jquery/jquery-1.8.3',
        'jquery.cookie'   : 'gallery/jquery.cookie',
        'jquery.validate' : 'gallery/jquery.validate',
        'jquery.blockUI'  : 'gallery/jquery.blockUI',
        'utils'           : 'common/utils',
        'cryptojs.core'   : 'gallery/cryptojs/core',
        'cryptojs.sha256' : 'gallery/cryptojs/sha256',
        'cryptojs.hmac'   : 'gallery/cryptojs/hmac'
    },
    shim : {
        'handlebars' : {
            exports : 'Handlebars'
        },
        'cryptojs.core': {
            exports: "CryptoJS"
        },
        'cryptojs.hmac': {
            deps: ['cryptojs.core'],
            exports: "CryptoJS"
        },
        'cryptojs.sha256': {
            deps: ['cryptojs.hmac'],
            exports: "CryptoJS"
        }
    }
});*/

requirejs.config({
    baseUrl : '../../c',
    paths : {
        'hbs'             : 'gallery/handlebars/handlebars',
        'hbs-helper.calc' : 'gallery/handlebars/helper/calc',
        'hbs-helper.eq'   : 'gallery/handlebars/helper/eq',
        'hbs-helper.string' : 'gallery/handlebars/helper/string',
        'jquery'          : 'sib/core/1.0/jquery/jquery-1.8.3',
        //'jquery'          : '../p/base/jll-jquery', //让jquery依赖初始化js
        'jquery.cookie'           : 'gallery/jquery.cookie',
        'jquery.validate.core'    : 'gallery/jquery.validate/jquery.validate',
        'jquery.validate.i18n.zh' : 'gallery/jquery.validate/localization/messages_zh',
        'jquery.validate'         : 'gallery/jquery.validate/jquery.validate.customize',
        'jquery.infinitescroll'   : 'gallery/jquery.infinitescroll',
        //'jquery.blockUI'  : 'gallery/jquery.blockUI',
        'cryptojs.core'   : 'gallery/cryptojs/core',
        'cryptojs.sha256' : 'gallery/cryptojs/sha256',
        'cryptojs.hmac'   : 'gallery/cryptojs/hmac',
        'masonry'         : 'gallery/masonry.pkgd.min',
        'imagesloaded'    : 'gallery/imagesloaded.pkgd.min',
        
        /** jquery plugin & sib depends **/
        'moment'             : 'sib/calendar/1.0/moment/moment',
        'jquery.easing'      : 'sib/core/1.0/jquery/jquery.easing.1.3',
        'jquery.enhance'     : 'sib/core/1.0/jquery/jquery.enhance',
        'jquery.event.drag'  : 'sib/core/1.0/jquery/jquery.event.drag-2.2',
        'jquery.position'    : 'sib/core/1.0/jquery/jquery.position',
        'jquery.resizable'   : 'sib/core/1.0/jquery/jquery.resizable',
        'jquery.resize'      : 'sib/core/1.0/jquery/jquery.resize',
        /** sib widget **/
        'events'             : 'sib/core/1.0/events',
        'json'               : 'sib/core/1.0/json2',
        'jquery+'            : 'sib/core/1.0/jQuery+',
        'sib.sib'            : 'sib/core/1.0/Sib',
        'sib.class'          : 'sib/core/1.0/Class',
        'sib.widget'         : 'sib/core/1.0/Widget',

        'sib.autocomplete'   : 'sib/autocomplete/1.0/Autocomplete',
        'sib.autocomplete.tab'   : 'sib/autocomplete/1.0/plugins/tab',
        'sib.autocomplete.table' : 'sib/autocomplete/1.0/plugins/table',
        'sib.calendar'       : 'sib/calendar/1.0/Calendar',
        'sib.calendar.base'  : 'sib/calendar/1.0/BaseCalendar',
        'sib.calendar.year'  : 'sib/calendar/1.0/YearPanel',
        'sib.calendar.month' : 'sib/calendar/1.0/MonthPanel',
        'sib.calendar.date'  : 'sib/calendar/1.0/DatePanel',
        'sib.combobox'       : 'sib/combo/1.0/ComboBox',
        'sib.countdown'      : 'sib/countdown/1.0/Countdown',
        'sib.countdown.effect' : 'sib/countdown/1.0/effect',
        'sib.countdown.timer'  : 'sib/countdown/1.0/timer',
        'sib.datagrid'       : 'sib/datagrid/1.0/DataGrid',
        'sib.datagrid.detail': 'sib/datagrid/1.0/plugins/detail',
        'sib.dialog'         : 'sib/dialog/1.0/Dialog',
        'sib.dialog.mask'    : 'sib/dialog/1.0/Mask',
        'sib.imagezoom'      : 'sib/imagezoom/1.0/ImageZoom',
        'sib.lazyload'       : 'sib/lazyload/1.0/LazyLoad',
        'sib.menu'           : 'sib/menu/1.0/Menu',
        'sib.pagenavigator'  : 'sib/pagenavigator/1.0/PageNavigator',
        'sib.pager'          : 'sib/pager/1.0/Pager',
        'sib.pagination'     : 'sib/pagination/1.0/Pagination',
        'sib.pin'            : 'sib/pin/1.0/Pin',
        'sib.placeholder'    : 'sib/placeholder/1.0/Placeholder',
        'sib.popup'          : 'sib/popup/1.0/Popup',
        'sib.progressbar'    : 'sib/progressbar/1.0/ProgressBar',
        'sib.slide'          : 'sib/slide/1.0/Slide',
        'sib.slide.scrollx'  : 'sib/slide/1.0/plugins/effect.scrollx',
        'sib.slide.scrolly'  : 'sib/slide/1.0/plugins/effect.scrolly',
        'sib.slide.fade'     : 'sib/slide/1.0/plugins/effect.fade',
        'sib.spinner'        : 'sib/spinner/1.0/Spinner',
        'sib.stepbar'        : 'sib/stepbar/1.0/StepBar',
        'sib.tabs'           : 'sib/tabs/1.0/Tabs',
        'sib.tip'            : 'sib/tip/1.0/Tip',
        
        'sib.calendar.i18n.en'    : 'sib/calendar/1.0/i18n/en',
        'sib.calendar.i18n.zh-cn' : 'sib/calendar/1.0/i18n/zh-cn',
        
        /** services components & utils **/
        'utils'           : 'common/utils',
        'init'            : '../p/base/init'
    },
    shim : {
        'hbs' : {
            exports : 'Handlebars'
        },
        'cryptojs.core': {
            exports: "CryptoJS"
        },
        'cryptojs.hmac': {
            deps: ['cryptojs.core'],
            exports: "CryptoJS"
        },
        'cryptojs.sha256': {
            deps: ['cryptojs.hmac'],
            exports: "CryptoJS"
        }
    }
});