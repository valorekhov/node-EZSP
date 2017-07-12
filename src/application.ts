import { Ezsp } from './ezsp';
import { EzspConfigId, EmberZdoConfigurationFlags } from './types';
import { EventEmitter } from "events";
import { EmberApsFrame } from './types/struct';
import { Deferred } from './utils/index';
import { EmberOutgoingMessageType } from './types/named';


export class ControllerApplication extends EventEmitter {
    private direct = EmberOutgoingMessageType.OUTGOING_DIRECT
    private ezsp: Ezsp;
    private pending = new Map<number, Array<Deferred<void>>>();

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
            ezsp.on('frame', this.handleFrame.bind(this))
        } else {
            const state = await ezsp.execCommand('networkState');
            console.log('Network state', state);
        }
    }

    private handleFrame(frameName: string, ...args: any[]) {

        if (frameName === 'incomingMessageHandler') {
            let [messageType, apsFrame, lqi, rssi, sender, bindingIndex, addressIndex, message] = args;
            super.emit('incomingMessage', { messageType, apsFrame, lqi, rssi, sender, bindingIndex, addressIndex, message });

            let isReply = false;
            let tsn = -1;
            let commandId = 0;
            if (isReply) {
                this.handleReply(sender, apsFrame, tsn, commandId, args);
            }
        }

    }

    private handleReply(sender: number, apsFrame: EmberApsFrame, tsn: number, commandId: number, ...args: any[]) {
        try {
            var arr = this.pending.get(tsn);
            if (!arr) {
                console.log('Unexpected reponse TSN=', tsn, 'command=', commandId, args)
                return;
            };
            let [sendDeferred, replyDeferred] = arr;
            console.log(sendDeferred.promise);
            if ((sendDeferred.promise as any)['_state'] === 0) {
                this.pending.delete(tsn);
            }
            replyDeferred.resolve(args);
            return;
        } catch (e) {
            console.log(e);
            return;
        }
    }

    public async request(nwk: number, apsFrame: EmberApsFrame, data: Buffer, timeout = 30000) {
        let seq = apsFrame.sequence;
        console.assert(!this.pending.has(seq));
        let sendDeferred = new Deferred<void>();
        let replyDeferred = new Deferred<void>();
        this.pending.set(seq, [sendDeferred, replyDeferred]);

        if (timeout > 0) {
            setTimeout(() => {
                debugger;
                throw new Error('Timeout while waiting for reply');
            }, timeout);
        }
        let v = await this.ezsp.sendUnicast(this.direct, nwk, apsFrame, seq, data);
        console.log('unicast message sent, waiting for reply');
        if (v[0] != 0) {
            this.pending.delete(seq);
            sendDeferred.reject();
            replyDeferred.reject();
            throw new Error(`Message send failure ${v[0]}`)
        }

        await sendDeferred.promise;
        await replyDeferred.promise;
    }
}