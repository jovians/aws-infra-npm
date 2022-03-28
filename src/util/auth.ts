/*
 * Copyright 2014-2021 Jovian; all rights reserved.
 */

import { Credentials, CredentialProvider } from "@aws-sdk/types";
import { DefaultRegionKey } from "../region";
export { Credentials, CredentialProvider }

export interface ClientAuth<RegionKey, T> {
  new(arg: { region: RegionKey, credentials: CredentialProvider }): T;
}

export interface AWSAccount {
  key: string;
  credentialsResolver: CredentialProvider;
  activeRegions?: string[];
  role?: any;
}

export interface AWSServiceConnector<RegionKey = DefaultRegionKey> {
  region: RegionKey;
  account: AWSAccount;
}

export function prefetchedCreds(cred: Credentials) {
  return () => new Promise<Credentials>(resolve => { return resolve(cred); });
}

/**
 * interface Credentials
 * readonly accessKeyId: string;      // AWS access key ID
 * readonly secretAccessKey: string;  // AWS secret access key
 * readonly sessionToken?: string;    // A security or session token to use with these credentials. Usually present for temporary credentials.
 * readonly expiration?: Date;        // A {Date} when these credentials will no longer be accepted.
 */
