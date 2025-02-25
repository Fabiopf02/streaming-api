import * as ytdl from '@distube/ytdl-core';
import cookies from 'src/cookies/cookies';

export function getAgent() {
  const agent = ytdl.createAgent(cookies, { localAddress: '', pipelining: 3 });
  return agent;
}
