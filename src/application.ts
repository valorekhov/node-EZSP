import { Ezsp } from './ezsp';
import { EzspConfigId, EmberZdoConfigurationFlags } from './types';
import { EventEmitter } from "events";


export class ControllerApplication extends EventEmitter {
    private ezsp: Ezsp;

    public async startup(port: string, options: {}) {
        let ezsp = this.ezsp = new Ezsp();
        await ezsp.connect(port, options);
        const version = await ezsp.version();
        console.log('Got version', version);

        await ezsp.setConfigurationValue(EzspConfigId.CONFIG_STACK_PROFILE, 2);
        await ezsp.setConfigurationValue(EzspConfigId.CONFIG_SECURITY_LEVEL, 5);
        await ezsp.setConfigurationValue(EzspConfigId.CONFIG_SUPPORTED_NETWORKS, 1);
        await ezsp.setConfigurationValue(EzspConfigId.CONFIG_APPLICATION_ZDO_FLAGS,
            EmberZdoConfigurationFlags.APP_RECEIVES_SUPPORTED_ZDO_REQUESTS
            | EmberZdoConfigurationFlags.APP_HANDLES_UNSUPPORTED_ZDO_REQUESTS);
        await ezsp.setConfigurationValue(EzspConfigId.CONFIG_TRUST_CENTER_ADDRESS_CACHE_SIZE, 2);
        await ezsp.setConfigurationValue(EzspConfigId.CONFIG_PACKET_BUFFER_COUNT, 0xff);

        if (await ezsp.networkInit()) {
            console.log('Network ready');

            ezsp.on('frame', (frameName: string, ...args: any[]) => {
                if (frameName === 'incomingMessageHandler') {
                    let [messageType, apsFrame, lqi, rssi, sender, bindingIndex, addressIndex, message] = args;
                    super.emit('incomingMessage', {messageType, apsFrame, lqi, rssi, sender, bindingIndex, addressIndex, message});
                }
            })
        } else {
            const state = await ezsp.execCommand('networkState');
            console.log('Network state', state);
        }
    }
}