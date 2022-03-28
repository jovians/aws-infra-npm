"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPages = void 0;
function getAllPages(wrapper, pageFetcher, propOrGetter, input, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        if (!input) {
            input = {};
        }
        input.NextToken = undefined;
        while (true) {
            let res;
            try {
                res = yield pageFetcher.apply(wrapper.client, [input, options]);
                if (typeof propOrGetter === 'string') {
                    results.push(...res[propOrGetter]);
                }
                else if (propOrGetter) {
                    results.push(...(yield Promise.resolve(propOrGetter(res))));
                }
                else {
                    break;
                }
            }
            catch (e) {
                console.log(e);
                break;
            }
            if (!res || !res.NextToken) {
                break;
            }
            input = res.NextToken;
        }
        return results;
    });
}
exports.getAllPages = getAllPages;
