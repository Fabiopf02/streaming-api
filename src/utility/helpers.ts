export function extractUserName(email: string) {
  return email.split('@').at(0);
}
