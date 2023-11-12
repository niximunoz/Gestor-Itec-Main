export const getUser = (proyecto: string) => {
  return {
    UserName: process.env.USER_TOKEN,
    KeyAccess: process.env.PASS_TOKEN
  }
}
