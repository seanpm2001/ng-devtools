// this is injected to the app page when the panel is activeted.

import { initBackend } from 'src/backend'
import Bridge from 'src/bridge'

window.addEventListener('message', handshake)

function handshake (e) {
    
    if (e.data.source === 'ng-devtools-proxy' && e.data.payload === 'init') {
        window.removeEventListener('message', handshake)

        let listeners = []
        const bridge = new Bridge ({
            listen (fn) {
                var listener = evt => {
                    if (evt.data.source === 'ng-devtools-proxy' && evt.data.payload) {
                        fn(evt.data.payload)
                    }
                }

                window.addEventListener('message', listener)
                listeners.push(listener)
            },

            send (data) {
                window.postMessage({
                    source: 'ng-devtools-backend',
                    payload: data
                })
            }
        })
        
        bridge.on('shutdown', () => {
            listeners.forEach(l => {
                window.removeEventListener('message', l)
            })

            listeners = []
        })

        initBackend(bridge)
    }
}