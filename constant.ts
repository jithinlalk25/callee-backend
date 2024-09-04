export const Constant =
  process.env.ENV == 'prod'
    ? {
        CASHFREE_API_URL: 'https://api.cashfree.com/pg',
      }
    : {
        CASHFREE_API_URL: 'https://sandbox.cashfree.com/pg',
      };
