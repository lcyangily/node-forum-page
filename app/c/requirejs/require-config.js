requirejs.config({
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
});