/*
 * Copyright 2014-2021 Jovian; all rights reserved.
 */
import { prefetchedCreds } from '../src/util/auth';
import { AWSAccountsCollator } from '../src/collator';
import * as secrets from '../.secrets.json';

(async () => {
  const aws = new AWSAccountsCollator();
  await aws.addAccount({ key: 'test-aws-acc', credentialsResolver: prefetchedCreds(secrets.profiles.jovian) });
  const res = await aws.acc('test-aws-acc').ec2.in('us-west-1').listKeyPairs();
  console.log(res);
})();
