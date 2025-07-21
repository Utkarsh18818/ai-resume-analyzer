import * as crypto from "node:crypto";
/**
* @param bytes
* @returns
*/
export function formatSize(bytes:number){
    if(bytes === 0) return '0 Bytes';
    const k= 1024;
    const sizes = ['Bytes','MB','KB','GB','TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + '' + sizes[i];
}

export const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    // Fallback UUID generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};