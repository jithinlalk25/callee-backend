import axios from 'axios';

export async function sendEmail(email: string, otp: string) {
  const data = {
    recipients: [
      {
        to: [
          {
            email,
          },
        ],
        variables: {
          company_name: 'Callee',
          otp,
        },
      },
    ],
    from: {
      email: 'no-reply@mail.callee.app',
    },
    domain: 'mail.callee.app',
    template_id: 'global_otp',
  };

  try {
    const response = await axios.post(
      'https://control.msg91.com/api/v5/email/send',
      data,
      {
        headers: {
          authkey: process.env.MSG91_AUTHKEY,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log(response.data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
