import axios, { AxiosRequestConfig } from 'axios';

export async function sendWhatsAppMessageSuccess(
  phoneNumber: string,
  amount: number,
  title: string,
): Promise<void> {
  const url =
    'https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/';

  const payload = {
    integrated_number: '917356245819',
    content_type: 'template',
    payload: {
      messaging_product: 'whatsapp',
      type: 'template',
      template: {
        name: 'payment_success',
        language: {
          code: 'en',
          policy: 'deterministic',
        },
        namespace: null,
        to_and_components: [
          {
            to: [phoneNumber],
            components: {
              body_1: {
                type: 'text',
                value: amount.toString(),
              },
              body_2: {
                type: 'text',
                value: title,
              },
            },
          },
        ],
      },
    },
  };

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      authkey: process.env.MSG91_AUTHKEY,
    },
  };

  try {
    const response = await axios.post(url, payload, config);
    console.log(response.data);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}
