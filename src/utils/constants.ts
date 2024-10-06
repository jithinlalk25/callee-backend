export const Constant =
  process.env.ENV == 'prod'
    ? {
        PLATFORM_FEE: 3,
        CASHFREE_API_URL: 'https://api.cashfree.com/pg',
        CASHFREE_PAYOUT_API_URL: 'https://api.cashfree.com/payout',
      }
    : {
        PLATFORM_FEE: 3,
        CASHFREE_API_URL: 'https://sandbox.cashfree.com/pg',
        CASHFREE_PAYOUT_API_URL: 'https://sandbox.cashfree.com/payout',
      };
