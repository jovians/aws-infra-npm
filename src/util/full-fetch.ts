/*
 * Copyright 2014-2021 Jovian; all rights reserved.
 */
import { HttpHandlerOptions } from "@aws-sdk/types";
import { sleepms } from "@jovian/type-tools";

export interface NextTokenable {
  NextToken: string;
}

export interface ClientWrapper {
  getReason: () => string;
  ready: boolean;
  client: any;
}

export async function getAllPages<S, InputType, OutputType>(
  wrapper: ClientWrapper,
  pageFetcher: (input: InputType, options?: HttpHandlerOptions) => Promise<OutputType>,
  propOrGetter: keyof OutputType | ((output: OutputType) => (S[] | Promise<S[]>)),
  input?: InputType,
  options?: HttpHandlerOptions
): Promise<S[]> {
  const results: S[] = [];
  if (!input) { (input as unknown) = {}; }
  (input as unknown as NextTokenable).NextToken = undefined;
  while (true) {
    let res;
    try {
      res = await pageFetcher.apply(wrapper.client, [input, options]);
      if (typeof propOrGetter === 'string') {
        results.push(...res[propOrGetter]);  
      } else if (propOrGetter) {
        results.push(...(await Promise.resolve((propOrGetter as any)(res))));
      } else {
        break;
      }
    } catch (e) { console.log(e); break; }
    if (!res || !res.NextToken) { break; }
    (input as unknown as NextTokenable) = res.NextToken;
  }
  return results;
}
