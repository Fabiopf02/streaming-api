import { FastifyRequest } from 'fastify';

export function extractUserName(email: string) {
  return email.split('@').at(0);
}

type UserPayload = {
  sub: number;
  email: string;
};

export function extractUser(req: FastifyRequest) {
  const userData = req.headers.user as unknown as UserPayload;
  return {
    id: userData.sub,
    email: userData.email,
  };
}
