import * as angular from 'angular'
import App from './App.ng'
import { parse } from '../util'

window.jQuery = require('jquery')
window.$ = jQuery

angular.errorHandle = (h, e) => {
    return h('pre', {
        style: {
            backgroundColor: 'red',
            color: 'white',
            fontSize: '12px',
            padding: '10px'
        }
    })
}

let app = null

export function initDevTools (shell) 
{
    initApp(shell)
    shell.onReload(() => 
    {
        if(app) {
            //angular.element(document).injector().get('$rootScope')
            //angular.injector(['app'])

            console.log('devtools -> app.$destory ')
        }

        bridge.removeAllListeners()
        initApp(shell)
    })

}

function initApp(shell)
{
    shell.connect(bridge => {
        window.bridge = bridge

        var name = 'devtools'

        bridge.once('ready', version => {
            // ...
        })

        bridge.on('event:triggered', payload => {
            console.log(parse(payload))
        })

        app = angular.module(name, []).component('app', App)

        angular.bootstrap(
            document.getElementById('container'), [name]
        )
    })
}