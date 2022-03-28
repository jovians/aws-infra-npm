"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regions = exports.RegionsProvider = exports.defaultRegionInfo = exports.RegionInfo = void 0;
class RegionInfo {
}
exports.RegionInfo = RegionInfo;
;
exports.defaultRegionInfo = {
    'us-east-2': { key: 'us-east-2', name: 'US East (Ohio)' },
    'us-east-1': { key: 'us-east-1', name: 'US East (N. Virginia)' },
    'us-west-1': { key: 'us-west-1', name: 'US West (N. California)' },
    'us-west-2': { key: 'us-west-2', name: 'US West (Oregon)' },
    'af-south-1': { key: 'af-south-1', name: 'Africa (Cape Town)' },
    'ap-east-1': { key: 'ap-east-1', name: 'Asia Pacific (Hong Kong)' },
    'ap-south-1': { key: 'ap-south-1', name: 'Asia Pacific (Mumbai)' },
    'ap-northeast-1': { key: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)' },
    'ap-northeast-2': { key: 'ap-northeast-2', name: 'Asia Pacific (Seoul)' },
    'ap-northeast-3': { key: 'ap-northeast-3', name: 'Asia Pacific (Osaka)' },
    'ap-southeast-1': { key: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
    'ap-southeast-2': { key: 'ap-southeast-2', name: 'Asia Pacific (Sydney)' },
    'ap-southeast-3': { key: 'ap-southeast-3', name: 'Asia Pacific (Jakarta)' },
    'ca-central-1': { key: 'ca-central-1', name: 'Canada (Central)' },
    'eu-central-1': { key: 'eu-central-1', name: 'Europe (Frankfurt)' },
    'eu-west-1': { key: 'eu-west-1', name: 'Europe (Ireland)' },
    'eu-west-2': { key: 'eu-west-2', name: 'Europe (London)' },
    'eu-west-3': { key: 'eu-west-3', name: 'Europe (Paris)' },
    'eu-north-1': { key: 'eu-north-1', name: 'Europe (Stockholm)' },
    'eu-south-1': { key: 'us-east-2', name: 'Europe (Milan)' },
    'me-south-1': { key: 'me-south-1', name: 'Middle East (Bahrain)' },
    'sa-east-1': { key: 'sa-east-1', name: 'South America (São Paulo)' },
    'us-gov-east-1': { key: 'us-gov-east-1', name: 'AWS GovCloud (US-East)' },
    'us-gov-west-1': { key: 'us-gov-west-1', name: 'AWS GovCloud (US-West)' },
};
class RegionsProvider {
    constructor(init) {
        this.regionsMap = {};
        this.regionsList = [];
        if (!init) {
            init = exports.defaultRegionInfo;
        }
        this.regionsMap = Object.assign(this.regionsMap, init);
        this.regionsList = Object.keys(this.regionsMap);
    }
}
exports.RegionsProvider = RegionsProvider;
exports.regions = new RegionsProvider(exports.defaultRegionInfo);
