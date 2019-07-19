import {NetInfo} from 'react-native'
import {NETWORK_CONNECTION_STATUS_CHANGED} from '../actions/app'
import {from} from 'rxjs';

let instance = null;
export default class NetworkConnection {
    constructor(store) {
        if (!instance) {

            instance = this
            this.store = store
            this.networkAvailable = true

            NetInfo.addEventListener(
                'connectionChange',
                this.handleFirstConnectivityChange
            );
        }
        else {
            instance.getConnectionStatus().subscribe(({type, effectiveType}) => {
                this.handleResult(type)
            })
        }
        return instance
    }

    dealloc() {
        if (this.store) {
            this.store.dispatch({type: NETWORK_CONNECTION_STATUS_CHANGED, validNetworkConnection: false})
        }
    }

    handleFirstConnectivityChange = ({type, effectiveType}) => {
        this.handleResult(type)
    }

    getConnectionStatus(complete) {
        return from(NetInfo.getConnectionInfo())
    }

    handleResult = (type) => {
        if ((type === 'none' || type === 'unknown') && this.networkAvailable) {
            this.networkAvailable = false
            if (this.store) {
                this.store.dispatch({type: NETWORK_CONNECTION_STATUS_CHANGED, validNetworkConnection: false})
            }
            return false
        }
        else if (type === 'wifi' || type === 'cellular') {
            this.networkAvailable = true
            if (this.store) {
                this.store.dispatch({type: NETWORK_CONNECTION_STATUS_CHANGED, validNetworkConnection: true})
            }
            return true
        }
    }
}