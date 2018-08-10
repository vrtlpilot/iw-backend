// Specific IW error class implementation.
class IWError implements Error {
    name: string; 
    message: string;
    status: number;
    stack?: string;

    constructor(status:number, msg:string, stack?: string) {
        this.name = IWError.toString();
        this.status = status;
        this.message = msg;
    }
}
