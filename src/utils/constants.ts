export const Constant =
  process.env.ENV == 'prod'
    ? {
        PLATFORM_FEE: 3,
        RAZORPAY_API_URL: 'https://api.razorpay.com',
      }
    : {
        PLATFORM_FEE: 3,
        RAZORPAY_API_URL: 'https://api.razorpay.com',
      };
