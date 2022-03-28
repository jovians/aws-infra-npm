"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefetchedCreds = void 0;
function prefetchedCreds(cred) {
    return () => new Promise(resolve => { return resolve(cred); });
}
exports.prefetchedCreds = prefetchedCreds;
