export const Constant =
  process.env.ENV == 'prod'
    ? {
        PLATFORM_FEE: 3,
        CASHFREE_API_URL: 'https://api.cashfree.com/pg',
      }
    : {
        PLATFORM_FEE: 3,
        CASHFREE_API_URL: 'https://sandbox.cashfree.com/pg',
      };
