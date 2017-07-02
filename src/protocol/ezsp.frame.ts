export enum EZSPFrameType {
    DATA,
    ACK,
    NAK,
    RST,
    RSTACK,
    ERROR
}

export class EZSPFrame {

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