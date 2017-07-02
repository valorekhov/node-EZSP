import { EventEmitter } from 'events';
import { EZSPMessage } from './ezsp.message';
import { EZSPFrameType, EZSPSpecialByte } from './index';
const Queue = require('data-structures').Queue;

export class EZSPChannel extends EventEmitter {
    currentData: any;
    frameCounter: number;
    ackCounter: number;
    retransmitQueue: any;
    reject: boolean;
    writeCallback: Function;

    constructor() {
        super();
        this.currentData = new Queue();
        this.retransmitQueue = new Queue();
        this.frameCounter = 0;
        this.ackCounter = 0;
        this.reject = false;
        this.writeCallback = (d: Buffer) => {
            console.log("Warning: writeCallback not set, please set write callback!");
            var msg = new EZSPMessage(d);
            msg.unprepare();
            console.log("> " + msg.toString());
        };
    }

    reset = () => {
        return new Promise((resolve, reject) => {

            var rstMessage: EZSPMessage = new EZSPMessage();
            rstMessage.control.frameType = EZSPFrameType.RST;
            var timeout = setTimeout(function () {
                reject("Reset timed out!");
            }, 3000);
            this.once('reset', function (version, code) {
                clearTimeout(timeout);
                resolve([version, code]);
            })
            this.write(rstMessage);
        })
    }

    write = (message: EZSPMessage) => {
        if (message.control.frameType === EZSPFrameType.DATA) {
            message.control.frameNumber = this.frameCounter;
            this.frameCounter = this.frameCounter % 8;
            this.frameCounter++;
        }
        var txmessage = new EZSPMessage(new Buffer(message.length));
        message.buffer.copy(txmessage.buffer);
        txmessage.prepare();
        this.writeCallback(txmessage.buffer);

        this.retransmitQueue.enqueue(message);
    }

    isSpecialCharacter(character: number): boolean {
        return EZSPSpecialByte[character] !== undefined;
    }

    //call this function whenever new data is avaliable
    read = (buffer: Buffer) => {
        for (let i = 0; i < buffer.length; i++) {
            let data = buffer[i];
            if (!this.isSpecialCharacter(data)) {
                this.currentData.enqueue(data);
            }
            if (data === EZSPSpecialByte.FLAG) {
                this.currentData.enqueue(data);
                var buf = new Buffer(this.currentData._content);
                this.currentData = new Queue();
                var message = new EZSPMessage(buf);
                try {
                    message.unprepare();
                    if (this.reject) {
                        //reject mode.
                    }
                    else if (message.control.frameType === EZSPFrameType.DATA) {
                        //is it the next message we were expecting?
                        if (message.control.frameNumber === this.ackCounter) {
                            this.ackCounter = ((this.ackCounter) + 1) % 8;
                            var ackMessage = new EZSPMessage();
                            console.log(message.control.frameNumber);
                            ackMessage.control.frameType = EZSPFrameType.ACK;
                            ackMessage.control.ackNumber = this.ackCounter;
                            ackMessage.control.inhibitCallback = false;
                            this.write(ackMessage);
                            //does it contain a piggybacked ACK?
                            if (message.control.ackNumber !== 0) {
                                //update the acked frame number
                                var frames = message.control.ackNumber - this.retransmitQueue.size;
                                if (frames < 0) { frames = frames + 8; };
                                //free a frame.
                                for (var j = 0; j < frames; j++) {
                                    if (this.retransmitQueue.size > 0) {
                                        this.retransmitQueue.dequeue();
                                    }
                                }
                            }
                            this.emit('data', message);
                        }
                        else {
                            //NAK this message, since we are out of sequence.
                            var nakMessage = new EZSPMessage();
                            nakMessage.control.frameType = EZSPFrameType.NAK;
                            nakMessage.control.ackNumber = this.ackCounter + 1;
                            nakMessage.control.inhibitCallback = false;
                            this.write(nakMessage);
                        }
                    }
                    else if (message.control.frameType === EZSPFrameType.RSTACK) {
                        this.emit('reset', message.version, message.code);
                    }
                    else if (message.control.frameType === EZSPFrameType.ACK) {
                        var frames = message.control.ackNumber - this.frameCounter;
                        if (frames < 0) { frames = frames + 8; };
                        //free a frame.
                        for (var j = 0; j < frames; j++) {
                            if (this.retransmitQueue.size > 0) {
                                this.retransmitQueue.dequeue();
                            }
                        }
                    }
                    else if (message.control.frameType === EZSPFrameType.NAK) {
                        //begin retransmit phase.
                        this.emit('nak', "NAK received, entering retransmit mode.")
                        this.reject = true;
                    }
                }
                catch (e) {
                    //TODO: error handling here
                    console.log("Channel error: " + e + "(message buffer= " + message.buffer.toJSON() + ")");
                }
            }
        }
    }
}
