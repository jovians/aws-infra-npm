/*
 * Copyright 2014-2021 Jovian; all rights reserved.
 */
import { ix } from '@jovian/type-tools';
import { AWSAccount, AWSServiceConnector } from './util/auth';
import { EC2RegionsCollator } from './services/ec2/ec2';
import { DefaultRegionKey, RegionsProvider } from './region';

export class AWSAccountServicesCollator<RegionKey extends string = DefaultRegionKey> extends ix.Entity {
  static async newInstacne<RegionKey extends string>(globalCollator: AWSAccountsCollator<RegionKey>, acc: AWSAccount) {
    const svcCollator = new AWSAccountServicesCollator<RegionKey>(globalCollator, acc);
    await svcCollator.initialize();
    return svcCollator;
  }
  account: AWSAccount;
  globalCollator: AWSAccountsCollator<RegionKey>;
  ec2: EC2RegionsCollator<RegionKey>;
  constructor(globalCollator: AWSAccountsCollator<RegionKey>, acc: AWSAccount) {
    super('aws-account-services-collator');
    this.globalCollator = globalCollator;
    this.account = acc;
  }
  async initialize() {
    this.ec2 = await EC2RegionsCollator.newInstance<RegionKey>(this);
  }
}

export interface AWSGlobalCollatorConfig<RegionKey> {
  regionProvider: RegionsProvider<RegionKey>;
}

export class AWSAccountsCollator<RegionKey extends string = DefaultRegionKey> extends ix.Entity {
  regionsList: RegionKey[];
  config: AWSGlobalCollatorConfig<RegionKey>;
  accountsPending: { [accountKey: string]: boolean } = {};
  accounts: { [accountKey: string]: AWSAccountServicesCollator<RegionKey> } = {};
  constructor(config?: AWSGlobalCollatorConfig<RegionKey>) {
    super('aws-global-collator');
    if (!config) {
      config = {
        regionProvider: new RegionsProvider(),
      };
    }
    this.config = config;
    this.regionsList = this.config.regionProvider.regionsList;
  }
  async addAccount(acc: AWSAccount) {
    this.accountsPending[acc.key] = true;
    const svcCollator = await AWSAccountServicesCollator.newInstacne<RegionKey>(this, acc);
    delete this.accountsPending[acc.key];
    this.accounts[acc.key] = svcCollator;
    return svcCollator;
  }
  getAccount(accountKey: string) {
    if (this.accountsPending[accountKey]) {
      throw new Error(`Account '${accountKey}' is still being initialized.`);
    }
    if (!this.accounts[accountKey]) {
      throw new Error(`Account '${accountKey}' does not exist in this collation.`);
    }
    return this.accounts[accountKey];
  }
  acc(accountKey: string) { return this.getAccount(accountKey); }
}
