import { EZSPChannel } from './ezsp.channel';
import { EZSPMessage } from './ezsp.message';
import { EZSPControl } from './ezsp.control';

enum EZSPFrameType {
    DATA,
    ACK,
    NAK,
    RST,
    RSTACK,
    ERROR
}

enum EZSPSpecialByte {
    FLAG = 0x7E,
    ESCAPE = 0x7D,
    XON = 0x11,
    XOFF = 0x13,
    SUBSTITUTE = 0x18,
    CANCEL = 0x1A
}


export {EZSPFrameType, EZSPSpecialByte, EZSPChannel, EZSPMessage, EZSPControl }

