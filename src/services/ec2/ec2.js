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
exports.EC2RegionsCollator = exports.EC2RegionalService = void 0;
const client_ec2_1 = require("@aws-sdk/client-ec2");
const type_tools_1 = require("@jovian/type-tools");
const full_fetch_1 = require("../../util/full-fetch");
class EC2RegionalService extends type_tools_1.ix.Entity {
    constructor(regCollator, region) {
        super('aws-ec2-service-facade');
        this.listSupportedRegions = () => __awaiter(this, void 0, void 0, function* () {
            return yield (0, full_fetch_1.getAllPages)(this, this.client.describeRegions, 'Regions');
        });
        this.listEC2Instances = () => __awaiter(this, void 0, void 0, function* () {
            return yield (0, full_fetch_1.getAllPages)(this, this.client.describeInstances, 'Reservations');
        });
        this.listSecurityGroups = () => __awaiter(this, void 0, void 0, function* () {
            return yield (0, full_fetch_1.getAllPages)(this, this.client.describeSecurityGroups, 'SecurityGroups');
        });
        this.listImagesOwned = () => __awaiter(this, void 0, void 0, function* () {
            return yield (0, full_fetch_1.getAllPages)(this, this.client.describeImages, 'Images', { Owners: ['self'] });
        });
        this.listVolumes = () => __awaiter(this, void 0, void 0, function* () {
            return yield (0, full_fetch_1.getAllPages)(this, this.client.describeVolumes, 'Volumes');
        });
        this.listSnapshotsOwned = () => __awaiter(this, void 0, void 0, function* () {
            return yield (0, full_fetch_1.getAllPages)(this, this.client.describeSnapshots, 'Snapshots', { OwnerIds: ['self'] });
        });
        this.listEIPs = () => __awaiter(this, void 0, void 0, function* () {
            return yield (0, full_fetch_1.getAllPages)(this, this.client.describeAddresses, 'Addresses');
        });
        this.listVPCs = () => __awaiter(this, void 0, void 0, function* () {
            return yield (0, full_fetch_1.getAllPages)(this, this.client.describeVpcs, 'Vpcs');
        });
        this.listKeyPairs = () => __awaiter(this, void 0, void 0, function* () {
            return yield (0, full_fetch_1.getAllPages)(this, this.client.describeKeyPairs, 'KeyPairs');
        });
        this.lcManagedBy(regCollator);
        this.regCollator = regCollator;
        this.client = new client_ec2_1.EC2({ region, credentials: this.regCollator.svcCollator.account.credentialsResolver });
        this.initialize();
    }
    static newInstance(regCollator, region) {
        return __awaiter(this, void 0, void 0, function* () {
            const regService = new EC2RegionalService(regCollator, region);
            return regService;
        });
    }
    static getSupportedRegions(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new client_ec2_1.EC2({ region: 'us-east-1', credentials });
            try {
                const regions = yield client.describeRegions({});
                return regions.Regions;
            }
            catch (e) {
                console.log(e);
                return [];
            }
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    getReason() {
        return `$${this.region} is not supported in this account`;
    }
}
exports.EC2RegionalService = EC2RegionalService;
class EC2RegionsCollator extends type_tools_1.ix.Entity {
    constructor(activeRegions, svcCollator) {
        super('aws-ec2-regions-collator');
        this.inRegion = {};
        this.svcCollator = svcCollator;
        this.activeRegions = activeRegions;
    }
    static newInstance(svcCollator) {
        return __awaiter(this, void 0, void 0, function* () {
            const regions = yield EC2RegionalService.getSupportedRegions(svcCollator.account.credentialsResolver);
            const activeRegions = regions.map(reg => reg.RegionName);
            const regCollator = new EC2RegionsCollator(activeRegions, svcCollator);
            yield regCollator.initialize();
            return regCollator;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const region of this.activeRegions) {
                this.inRegion[region] = yield EC2RegionalService.newInstance(this, region);
            }
        });
    }
    in(region) {
        if (this.inRegion[region]) {
            return this.inRegion[region];
        }
        throw new Error(`Region '${region}' is not active for this account for EC2.`);
    }
}
exports.EC2RegionsCollator = EC2RegionsCollator;
