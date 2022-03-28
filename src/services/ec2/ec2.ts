/*
 * Copyright 2014-2021 Jovian; all rights reserved.
 */
import {
  EC2,
  Reservation,
  DescribeInstancesCommandInput,
  DescribeInstancesCommandOutput,
  SecurityGroup,
  DescribeSecurityGroupsCommandInput,
  DescribeSecurityGroupsCommandOutput,
  Image,
  DescribeImagesCommandOutput,
  DescribeImagesCommandInput,
  Volume,
  DescribeVolumesCommandInput,
  DescribeVolumesCommandOutput,
  Snapshot,
  DescribeSnapshotsCommandInput,
  DescribeSnapshotsCommandOutput,
  Address,
  DescribeAddressesCommandInput,
  DescribeAddressesCommandOutput,
  Vpc,
  DescribeVpcsCommandInput,
  DescribeVpcsCommandOutput,
  KeyPair,
  DescribeKeyPairsCommandInput,
  DescribeKeyPairsCommandOutput,
  Region,
  DescribeRegionsCommandInput,
  DescribeRegionsCommandOutput,
} from '@aws-sdk/client-ec2';
import { CredentialProvider } from '@aws-sdk/types';
import { ix } from '@jovian/type-tools';
import { AWSAccountServicesCollator } from '../../collator';
import { DefaultRegionKey } from '../../region';
import { getAllPages } from '../../util/full-fetch';

export class EC2RegionalService<RegionKey extends string = DefaultRegionKey> extends ix.Entity {
  static async newInstance<RegionKey extends string = DefaultRegionKey>(regCollator: EC2RegionsCollator<RegionKey>, region: RegionKey) {
    const regService = new EC2RegionalService<RegionKey>(regCollator, region);
    return regService;
  }
  static async getSupportedRegions(credentials: CredentialProvider) {
    const client = new EC2({ region: 'us-east-1', credentials });
    try {
      const regions = await client.describeRegions({});
      return regions.Regions;
    } catch (e) { console.log(e); return []; }
  }
  regCollator: EC2RegionsCollator<RegionKey>;
  region: RegionKey;
  regionSupported: boolean;
  client: EC2;
  ready: boolean;
  constructor(regCollator: EC2RegionsCollator<RegionKey>, region: RegionKey) {
    super('aws-ec2-service-facade');
    this.lcManagedBy(regCollator);
    this.regCollator = regCollator;
    this.client = new EC2({ region, credentials: this.regCollator.svcCollator.account.credentialsResolver });
    this.initialize();
  }
  async initialize() {
    // const supportedRegions = await this.listSupportedRegions();
    // console.log(supportedRegions);
  }
  getReason() {
    return `$${this.region} is not supported in this account`
  }
  listSupportedRegions = async () => await getAllPages<Region, DescribeRegionsCommandInput, DescribeRegionsCommandOutput>(
                                        this, this.client.describeRegions, 'Regions');
  listEC2Instances = async () => await getAllPages<Reservation, DescribeInstancesCommandInput, DescribeInstancesCommandOutput>(
                                        this, this.client.describeInstances, 'Reservations');
  listSecurityGroups = async () => await getAllPages<SecurityGroup, DescribeSecurityGroupsCommandInput, DescribeSecurityGroupsCommandOutput>(
                                        this, this.client.describeSecurityGroups, 'SecurityGroups');
  listImagesOwned = async () => await getAllPages<Image, DescribeImagesCommandInput, DescribeImagesCommandOutput>(
                                        this, this.client.describeImages, 'Images', { Owners: ['self'] });
  listVolumes = async () => await getAllPages<Volume, DescribeVolumesCommandInput, DescribeVolumesCommandOutput>(
                                        this, this.client.describeVolumes, 'Volumes');
  listSnapshotsOwned = async () => await getAllPages<Snapshot, DescribeSnapshotsCommandInput, DescribeSnapshotsCommandOutput>(
                                        this, this.client.describeSnapshots, 'Snapshots', { OwnerIds: ['self'] });
  listEIPs = async () => await getAllPages<Address, DescribeAddressesCommandInput, DescribeAddressesCommandOutput>(
                                        this, this.client.describeAddresses, 'Addresses');
  listVPCs = async () => await getAllPages<Vpc, DescribeVpcsCommandInput, DescribeVpcsCommandOutput>(
                                        this, this.client.describeVpcs, 'Vpcs');
  listKeyPairs = async () => await getAllPages<KeyPair, DescribeKeyPairsCommandInput, DescribeKeyPairsCommandOutput>(
                                          this, this.client.describeKeyPairs, 'KeyPairs');
}

export class EC2RegionsCollator<RegionKey extends string = DefaultRegionKey> extends ix.Entity {
  static async newInstance<RegionKey extends string = DefaultRegionKey>(svcCollator: AWSAccountServicesCollator<RegionKey>) {
    const regions = await EC2RegionalService.getSupportedRegions(svcCollator.account.credentialsResolver);
    const activeRegions: RegionKey[] = regions.map(reg => reg.RegionName as unknown as RegionKey);
    const regCollator = new EC2RegionsCollator<RegionKey>(activeRegions, svcCollator);
    await regCollator.initialize();
    return regCollator;
  }
  activeRegions: RegionKey[];
  inRegion: { [key in RegionKey] : EC2RegionalService<RegionKey> } = ({} as any);
  svcCollator: AWSAccountServicesCollator<RegionKey>;
  constructor(activeRegions: RegionKey[], svcCollator: AWSAccountServicesCollator<RegionKey>) {
    super('aws-ec2-regions-collator');
    this.svcCollator = svcCollator;
    this.activeRegions = activeRegions;
  }
  async initialize() {
    for (const region of this.activeRegions) {
      this.inRegion[region] = await EC2RegionalService.newInstance<RegionKey>(this, region);
    }
  }
  in(region: RegionKey) {
    if (this.inRegion[region]) { return this.inRegion[region]; }
    throw new Error(`Region '${region}' is not active for this account for EC2.`);
  }
}
