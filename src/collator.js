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
exports.AWSAccountsCollator = exports.AWSAccountServicesCollator = void 0;
const type_tools_1 = require("@jovian/type-tools");
const ec2_1 = require("./services/ec2/ec2");
const region_1 = require("./region");
class AWSAccountServicesCollator extends type_tools_1.ix.Entity {
    constructor(globalCollator, acc) {
        super('aws-account-services-collator');
        this.globalCollator = globalCollator;
        this.account = acc;
    }
    static newInstacne(globalCollator, acc) {
        return __awaiter(this, void 0, void 0, function* () {
            const svcCollator = new AWSAccountServicesCollator(globalCollator, acc);
            yield svcCollator.initialize();
            return svcCollator;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ec2 = yield ec2_1.EC2RegionsCollator.newInstance(this);
        });
    }
}
exports.AWSAccountServicesCollator = AWSAccountServicesCollator;
class AWSAccountsCollator extends type_tools_1.ix.Entity {
    constructor(config) {
        super('aws-global-collator');
        this.accountsPending = {};
        this.accounts = {};
        if (!config) {
            config = {
                regionProvider: new region_1.RegionsProvider(),
            };
        }
        this.config = config;
        this.regionsList = this.config.regionProvider.regionsList;
    }
    addAccount(acc) {
        return __awaiter(this, void 0, void 0, function* () {
            this.accountsPending[acc.key] = true;
            const svcCollator = yield AWSAccountServicesCollator.newInstacne(this, acc);
            delete this.accountsPending[acc.key];
            this.accounts[acc.key] = svcCollator;
            return svcCollator;
        });
    }
    getAccount(accountKey) {
        if (this.accountsPending[accountKey]) {
            throw new Error(`Account '${accountKey}' is still being initialized.`);
        }
        if (!this.accounts[accountKey]) {
            throw new Error(`Account '${accountKey}' does not exist in this collation.`);
        }
        return this.accounts[accountKey];
    }
    acc(accountKey) { return this.getAccount(accountKey); }
}
exports.AWSAccountsCollator = AWSAccountsCollator;
