export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'default-secret-key',
  expiresIn: (process.env.JWT_EXPIRES || '1d') as string,
};
