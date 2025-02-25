import * as ytdl from '@distube/ytdl-core';
import cookies from 'src/cookies/cookies.json';

export function getAgent() {
  const agent = ytdl.createAgent(cookies as ytdl.Cookie[]);
  return agent;
}
