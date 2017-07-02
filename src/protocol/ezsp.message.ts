import {  EZSPSpecialByte } from './index';
import { EZSPFrame, EZSPFrameType  } from './ezsp.frame';
import {crc16ccitt} from 'crc';
const Queue = require('data-structures').Queue;

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

    get control(): EZSPFrame {
        return new EZSPFrame(this.buffer);
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
        return crc16ccitt(this.buffer.slice(0, this.length - 3));
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