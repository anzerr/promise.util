
declare class Util {
    tap(cd: (res: any) => Promise<any> | any): (res: any) => Promise<any> | any;
    timeout(cd: () => Promise<any> | any, n: number, err?: any): Promise<any>;
    delay(n?: number): Promise<any>;
    measure(cd: (...any[]) => any): Promise<number>;
    each(data: any, cd: (v: any, k: number | string) => any, max?: number): Promise<any>;
    bulk(data: any[], cd: (v: any, k: number | string) => any, max?: number, size?: number): Promise<any>;
}
declare const out: Util;
export default out;
export {};