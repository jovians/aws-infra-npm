/*
 * Copyright 2014-2021 Jovian; all rights reserved.
 */

export type DefaultRegionKey = (
  // US
  'us-east-2' |
  'us-east-1' |
  'us-west-1' |
  'us-west-2' |

  // AF
  'af-south-1' |

  // AP Region
  'ap-east-1' |
  'ap-south-1' |
  'ap-northeast-1' |
  'ap-northeast-2' |
  'ap-northeast-3' |
  'ap-southeast-1' |
  'ap-southeast-2' |
  'ap-southeast-3' |

  // CA
  'ca-central-1' |

  // EU
  'eu-central-1' |
  'eu-west-1' |
  'eu-west-2' |
  'eu-west-3' |
  'eu-north-1' |
  'eu-south-1' |

  // ME
  'me-south-1' |
  
  // SA
  'sa-east-1' |

  // US GOV
  'us-gov-east-1' |
  'us-gov-west-1'
);

export class RegionInfo<RegionKey = DefaultRegionKey> {
  key: RegionKey;
  name: string;
};

export const defaultRegionInfo: {[key in DefaultRegionKey]: RegionInfo<DefaultRegionKey> } = {
  // US
  /** US East (Ohio) */
  'us-east-2': { key: 'us-east-2', name: 'US East (Ohio)' },
  'us-east-1': { key: 'us-east-1', name: 'US East (N. Virginia)' },
  'us-west-1': { key: 'us-west-1', name: 'US West (N. California)' },
  'us-west-2': { key: 'us-west-2', name: 'US West (Oregon)' },

  // AF
  'af-south-1': { key: 'af-south-1', name: 'Africa (Cape Town)' },

  // AP Region
  'ap-east-1': { key: 'ap-east-1', name: 'Asia Pacific (Hong Kong)' },
  'ap-south-1': { key: 'ap-south-1', name: 'Asia Pacific (Mumbai)' },
  'ap-northeast-1': { key: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)' },
  'ap-northeast-2': { key: 'ap-northeast-2', name: 'Asia Pacific (Seoul)' },
  'ap-northeast-3': { key: 'ap-northeast-3', name: 'Asia Pacific (Osaka)' },
  'ap-southeast-1': { key: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
  'ap-southeast-2': { key: 'ap-southeast-2', name: 'Asia Pacific (Sydney)' },
  'ap-southeast-3': { key: 'ap-southeast-3', name: 'Asia Pacific (Jakarta)' },

  // CA
  'ca-central-1': { key: 'ca-central-1', name: 'Canada (Central)' },

  // EU
  'eu-central-1': { key: 'eu-central-1', name: 'Europe (Frankfurt)' },
  'eu-west-1': { key: 'eu-west-1', name: 'Europe (Ireland)' },
  'eu-west-2': { key: 'eu-west-2', name: 'Europe (London)' },
  'eu-west-3': { key: 'eu-west-3', name: 'Europe (Paris)' },
  'eu-north-1': { key: 'eu-north-1', name: 'Europe (Stockholm)' },
  'eu-south-1': { key: 'us-east-2', name: 'Europe (Milan)' },

  // ME
  'me-south-1': { key: 'me-south-1', name: 'Middle East (Bahrain)' },
  
  // SA
  'sa-east-1': { key: 'sa-east-1', name: 'South America (São Paulo)' },

  // US GOV
  'us-gov-east-1': { key: 'us-gov-east-1', name: 'AWS GovCloud (US-East)' },
  'us-gov-west-1': { key: 'us-gov-west-1', name: 'AWS GovCloud (US-West)' },
};

export class RegionsProvider<RegionKey = DefaultRegionKey> {
  regionType: RegionKey;
  regionsMap: { [key: string]: RegionInfo<RegionKey> } = {};
  regionsList: RegionKey[] = [];
  constructor(init?: { [key: string]: RegionInfo<RegionKey> }) {
    if (!init) { init = defaultRegionInfo as any; }
    this.regionsMap = Object.assign(this.regionsMap, init);
    this.regionsList = Object.keys(this.regionsMap) as unknown as RegionKey[];
  }
}

export const regions = new RegionsProvider<DefaultRegionKey>(defaultRegionInfo);
