import * as SerialPort from 'serialport';
import * as crc from 'crc';
const Queue = require('data-structures').Queue;
import * as events from 'events';

export enum EZSPFrameType {
    DATA,
    ACK,
    NAK,
    RST,
    RSTACK,
    ERROR
}

export enum EZSPSpecialByte {
    FLAG = 0x7E,
    ESCAPE = 0x7D,
    XON = 0x11,
    XOFF = 0x13,
    SUBSTITUTE = 0x18,
    CANCEL = 0x1A
}

export class EZSPControl {

    constructor(private buffer: Buffer) {
    }

    get frameType(): EZSPFrameType {
        var val = this.buffer.readUInt8(0);
        if (val === 0xC2) { return EZSPFrameType.ERROR; }
        else if (val === 0xC1) { return EZSPFrameType.RSTACK; }
        else if (val === 0xC0) { return EZSPFrameType.RST; }
        else if ((val & 0xE0) == 0xA0) { return EZSPFrameType.NAK; }
        else if ((val & 0xE0) == 0x80) { return EZSPFrameType.ACK; }
        else if ((val & 0x80) == 0x00) { return EZSPFrameType.DATA; }
        throw "Unknown frame type!!!";
    }

    set frameType(val: EZSPFrameType) {
        var prev;
        switch (val) {
            case EZSPFrameType.ERROR:
                this.buffer.writeUInt8(0xC2, 0);
                break;
            case EZSPFrameType.RSTACK:
                this.buffer.writeUInt8(0xC1, 0);
                break;
            case EZSPFrameType.RST:
                this.buffer.writeUInt8(0xC0, 0);
                break;
            case EZSPFrameType.ACK:
                prev = this.buffer.readUInt8(0);
                prev &= ~0xE0;
                this.buffer.writeUInt8((prev | 0x80) >>> 0, 0);
                break;
            case EZSPFrameType.NAK:
                prev = this.buffer.readUInt8(0);
                prev &= ~0xE0;
                this.buffer.writeUInt8((prev | 0xA0) >>> 0, 0);
                break;
            case EZSPFrameType.DATA:
                prev = this.buffer.readUInt8(0);
                prev &= ~0x80;
                this.buffer.writeUInt8(prev, 0);
                break;
        }
    }


    get frameNumber(): number {
        var frmNum = this.buffer.readUInt8(0) & 0x70;
        return frmNum >>> 4;
    }

    set frameNumber(val: number) {
        var prev = this.buffer.readUInt8(0);
        prev &= ~0x70;
        this.buffer.writeUInt8(prev | (val << 4), 0);
    }

    get retransmitted(): boolean {
        return (this.buffer.readUInt8(0) & 0x8) > 0;
    }

    set retransmitted(val: boolean) {
        var prev = this.buffer.readUInt8(0);
        if (val) { prev |= 0x8 }
        else { prev &= ~0x8; }
        this.buffer.writeUInt8(prev, 0);
    }

    get inhibitCallback(): boolean {
        return (this.buffer.readUInt8(0) & 0x8) > 0;
    }

    set inhibitCallback(val: boolean) {
        var prev = this.buffer.readUInt8(0);
        if (val) { prev |= 0x8 }
        else { prev &= ~0x8; }
        this.buffer.writeUInt8(prev, 0);
    }

    get ackNumber(): number {
        var frmNum = this.buffer.readUInt8(0) & 0x7;
        return frmNum;
    }

    set ackNumber(val: number) {
        var prev = this.buffer.readUInt8(0);
        prev &= ~0x7;
        this.buffer.writeUInt8(prev | (val), 0);
    }
}

export class EZSPMessage {

    buffer: Buffer;
    _length: number;
    prepared: boolean;

    constructor(buffer?: Buffer) {
        if (buffer === undefined) {
            this.prepared = false;
            this.buffer = new Buffer(256); //max size we'll need if every byte is stuffed...
        }
        else {
            if (!(buffer instanceof Buffer)) {
                this.buffer = new Buffer(<any>buffer);
            }
            else {
                this.buffer = buffer;
            }
            this.prepared = true;
        }
    }

    get control(): EZSPControl {
        return new EZSPControl(this.buffer);
    }

    get length(): number {
        if (this.prepared) {
            return this.buffer.length;
        }
        switch (this.control.frameType) {
            case EZSPFrameType.RST:
                return 4;
            case EZSPFrameType.RSTACK:
                return 6;
            case EZSPFrameType.ERROR:
                return 6;
            case EZSPFrameType.DATA:
                return this._length + 4;
            case EZSPFrameType.ACK:
                return 4;
            case EZSPFrameType.NAK:
                return 4;
        }
    }

    set datalength(val: number) {
        if (this.prepared) {
            throw "Can't set length on a prepared frame!";
        }
        if (this.control.frameType == EZSPFrameType.DATA) {
            this._length = val;
        }
        else {
            throw "Can't set length on non-data frame!";
        }
    }

    get CRC(): number {
        return this.buffer.readUInt16BE(this.length - 3);
    }

    set CRC(val: number) {
        this.buffer.writeUInt16BE(val, this.length - 3);
    }

    get flag(): number {
        return this.buffer.readUInt8(this.length - 1);
    }

    set flag(val: number) {
        this.buffer.writeUInt8(val, this.length - 1);
    }

    get data(): Buffer {
        return this.buffer.slice(1, this._length + 1);
    }

    get version(): number {
        return this.buffer.readUInt8(1);
    }

    set version(val: number) {
        this.buffer.writeUInt8(val, 1);
    }

    get code(): number {
        return this.buffer.readUInt8(2);
    }

    set code(val: number) {
        this.buffer.writeUInt8(val, 2);
    }

    calculateCRC = (): number => {
        return crc.crc16ccitt(this.buffer.slice(0, this.length - 3));
    }

    isSpecialCharacter(character: number): boolean {
        return EZSPSpecialByte[character] !== undefined;
    }

    //Stuff bytes. We can attempt to do this in place, as long as
    //the buffer has enough bytes...
    stuffandflag = (): number => {
        var i = 0;
        var seen = 0;
        var length = this.length; //need to preserve this because stuffing can change it...
        var stuffQueue = new Queue();
        do {
            if (seen < length - 1) {
                var thischar = this.buffer.readUInt8(i);
                if (this.isSpecialCharacter(thischar)) {
                    stuffQueue.enqueue(EZSPSpecialByte.ESCAPE);
                    stuffQueue.enqueue(thischar ^ 0x20);
                }
                else {
                    if (stuffQueue.size > 0) {
                        stuffQueue.enqueue(thischar);
                    }
                }
                seen++;
            }
            else if (seen === length - 1) {
                stuffQueue.enqueue(EZSPSpecialByte.FLAG);
                seen++;
            }

            if (stuffQueue.size > 0) {
                this.buffer.writeUInt8(stuffQueue.dequeue(), i);
            }
            i++;
        } while (stuffQueue.size > 0 || seen < length);
        this.prepared = true;
        this.buffer = this.buffer.slice(0, i);
        return i;
    }

    //unstuff bytes. Since we know that we'll have fewer bytes
    //we can do this in place.
    unstuff = () => {
        var i = 0;
        var writePointer = 0;
        do {
            var thischar = this.buffer.readUInt8(i);
            if (thischar === EZSPSpecialByte.ESCAPE) {
                this.buffer.writeUInt8(this.buffer.readUInt8(i + 1) ^ 0x20, writePointer);
                i += 2; //skip over escaped char
            }
            else {
                i += 1;
            }
            writePointer++;
        } while (i < this.buffer.length);
        if (this.control.frameType === EZSPFrameType.DATA) {
            this._length = writePointer - 4;
        }
        this.prepared = false;
        this.buffer = this.buffer.slice(0, writePointer);
    }

    //Randomizes the data field according to the LFSR...
    randomize = () => {
        var i;
        var rand: number = 0x42;
        for (i = 1; i < this.length - 3; i++) {
            var b = this.buffer.readUInt8(i);
            this.buffer.writeUInt8(b ^ rand, i);
            if ((rand & 1) == 0) { rand = (rand >> 1); }
            else { rand = (rand >> 1) ^ 0xB8 }
        }
    }

    //Prepares a message to be sent by calculating the CRC,
    //applying bit stuffing, randomizing the data and
    //setting the flag.
    prepare = () => {
        if (this.control.frameType === EZSPFrameType.DATA) {
            this.randomize();
        }
        this.CRC = this.calculateCRC();
        this.stuffandflag();
        return this.buffer;
    }

    //Unpacks a prepared message by unapplying bit stuffing,
    //derandomizing the data field, and checking the CRC.
    unprepare = () => {
        this.unstuff();
        if (this.CRC !== this.calculateCRC()) {
            throw "CRC failure during unprepare! (expected " + this.calculateCRC().toString(16) + ", got " + this.CRC.toString(16) + ")";
        }

        if (this.control.frameType === EZSPFrameType.DATA) {
            this.randomize();
        }
        return this.buffer;
    }

    toString(): string {
        if (this.prepared) {
            return "[Prepared Message]";
        }
        var outStr = "[";
        outStr += EZSPFrameType[this.control.frameType] + "]";

        switch (this.control.frameType) {
            case EZSPFrameType.RST:
                break;
            case EZSPFrameType.RSTACK:
                outStr += " (V=0x" + this.version.toString(16) + ", C=0x" + this.code.toString(16) + ");"
                break;
            case EZSPFrameType.ERROR:
                outStr += " (V=0x" + this.version.toString(16) + ", C=0x" + this.code.toString(16) + ");"
                break;
            case EZSPFrameType.DATA:
                outStr += " (F=" + this.control.frameNumber + ", A=" + this.control.ackNumber + ", R=" + this.control.retransmitted + ")";
                outStr += " " + this.data.toJSON();
                break;
            case EZSPFrameType.ACK:
                outStr += " (A=" + this.control.ackNumber + ", R=" + this.control.inhibitCallback + ")";
                break;
            case EZSPFrameType.NAK:
                outStr += " (A=" + this.control.ackNumber + ", R=" + this.control.inhibitCallback + ")";
                break;
        }

        return outStr;
    }
}

export class EZSPChannel extends events.EventEmitter {
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
        var i;
        for (i = 0; i < buffer.length; i++) {
            var data = buffer[i];
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
