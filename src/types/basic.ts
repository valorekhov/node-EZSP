export class int_t {
    static _signed = true

    static serialize(cls : any, value: number){
        let buffer = Buffer.alloc(cls._size);
        if (cls._signed){
            buffer.writeIntLE(value, 0, cls._size);
        } else {
            buffer.writeUIntLE(value, 0, cls._size);
        }
        return buffer;
    }

    static deserialize(cls : any, data:Buffer){
        return [cls._signed ? data.readIntLE(0, cls._size) : data.readUIntLE(0, cls._size), data.slice(cls._size) ]
    }
}

export class int8s extends int_t{
    static _size = 1
}

export class int16s extends int_t{
    static _size = 2
}

export class int24s extends int_t{
    static _size = 3
}

export class int32s extends int_t{
    static _size = 4
}

export class int64s extends int_t{
    static _size = 8
}

export class uint_t extends int_t{
    static _signed = false
}

export class uint8_t extends uint_t{
    static _size = 1
}

export class uint16_t extends uint_t{
    static _size = 2
}

export class uint24_t extends uint_t{
    static _size = 3
}

export class uint32_t extends uint_t{
    static _size = 4
}

export class uint64_t extends uint_t{
    static _size = 8
}

/*
export class Single extends number {
    serialize() {
        return struct.pack("<f", this);
    }
    static deserialize(cls, data) {
        return [struct.unpack("<f", data)[0], data.slice(4)];
    }
}
export  class Double extends number {
    serialize() {
        return struct.pack("<d", this);
    }
    static deserialize(cls, data) {
        return [struct.unpack("<d", data)[0], data.slice(8)];
    }
}*/

export class LVBytes  {
    static serialize(cls: any, value: any[]) {
        return [this.length].concat(value);
    }
    static deserialize(cls : any, data : Buffer) {
        var l, s;
        l = data.readIntLE(0,1);
        s = data.slice(1, (l + 1));
        return [s, data.slice((l + 1))];
    }
}
class _List  {
    static serialize(cls: any, value: any[]) {
        console.assert(((cls._length === null) || (cls.length === cls._length)));
        return value.map(i=>i.serialize(cls, i));
    }
    static deserialize(cls : any, data: Buffer) : (any[] | Buffer)[] {
        var item;
        var r : any[]= [];
        while (data) {
            [item, data] = (<any>r)._itemtype.deserialize((<any>r)._itemtype, data);
            r.push(item);
        }
        return [r, data];
    }
}

class _LVList extends _List {
    static serialize(cls: any, value: any[]) {
        var data, head;
        head = [cls.length];
        data = super.serialize(cls, value);
        return head.concat(data);
    }
    static deserialize(cls : any, data : Buffer) {
        var item, length;
        var r : any[]= [];
        [length, data] = [data[0], data.slice(1)];
        for (var i = 0; i < length; i++) {
            [item, data] = (<any>r)._itemtype.deserialize((<any>r)._itemtype, data);
            r.push(item);
        }
        return [r, data];
    }
}
export function List(itemtype:any) {
    class List extends _List {
    }
    (<any>LVList.prototype)['_itemtype'] = itemtype;
    return List;
}
export function LVList(itemtype:any) {
    class LVList extends _LVList {
    }
    (<any>LVList.prototype)['itemtype'] = itemtype;
    return LVList;
}
export class _FixedList extends _List {
    static deserialize(cls : any, data : Buffer) {
        debugger;
        let item;
        let r : any[] = [];
        for (var i = 0; i < cls._length; i++) {
            [item, data] = cls._itemtype.deserialize(cls._itemtype, data);
            r.push(item);
        }
        return [r, data];
    }
}
export function fixed_list(length : number, itemtype : any) {
    class FixedList extends _FixedList {
    }
    (<any>FixedList)['_itemtype'] = itemtype;
    (<any>FixedList)['_length'] = length;
    return FixedList;
}