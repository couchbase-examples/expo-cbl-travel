export interface ICouchbaseLitePlugin {
     // eslint-disable-next-line
  exec(actionName: string, ...args: any[]): Promise<any>;
     // eslint-disable-next-line
  watch( actionName: string, args: any[], cb: (data: any) => void, err: (err: any) => void): void;
}
   // eslint-disable-next-line
export type Dictionary = { [key: string]: any };
