// Round function implementation.
export function round(value:number, decimals:number):Number {
    const val = parseFloat(`${value}e${decimals}`); 
    return Number(Math.round(val) + 'e-' + decimals);
}

// Equals function implementation.
export function equals(x:number, y:number):boolean {
    return Math.abs(x - y) < Number.EPSILON * Math.max(Math.abs(x), Math.abs(y));
}

// Truncate function implementation.
export function truncate(val:number):number {
    return Math.trunc(val * 100) / 100;
}

// Truncate with decimals function implementation.
export function truncated(val:number, decimals:number):number {    
    const npc = Math.pow(10, decimals); 
    return ~~(val * npc)/npc;
}