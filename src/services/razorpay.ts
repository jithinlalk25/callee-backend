import { InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { Constant } from 'src/utils/constants';

export class RazorpayService {
  private static apiUrl = Constant.RAZORPAY_API_URL;

  private static config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`,
    },
  };

  static async createOrder(
    amount: number,
    notes: any,
    transferAccountId: string,
    transferAmount: number,
  ) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/v1/orders`,
        {
          amount: Math.round(amount * 100),
          currency: 'INR',
          notes,
          transfers: [
            {
              account: transferAccountId,
              amount: Math.round(transferAmount * 100),
              currency: 'INR',
              notes,
              on_hold: 0,
            },
          ],
        },
        this.config,
      );

      return response.data;
    } catch (error) {
      console.error(
        'Error Razorpay createOrder ->',
        error,
        'Data ->',
        error?.response?.data,
      );
      throw new InternalServerErrorException();
    }
  }

  static async getOrder(orderId: string) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/v1/orders/${orderId}`,
        this.config,
      );

      return response.data;
    } catch (error) {
      console.error(
        'Error Razorpay getOrder ->',
        error,
        'Data ->',
        error?.response?.data,
      );
      throw new InternalServerErrorException();
    }
  }

  static async createLinkedAccount(
    email: string,
    phoneNumber: string,
    name: string,
    address: any,
  ) {
    try {
      const data = {
        email,
        phone: phoneNumber,
        legal_business_name: name,
        business_type: 'other',
        type: 'route',
        profile: {
          category: 'not_for_profit',
          subcategory: 'personal',
          addresses: {
            registered: { ...address, country: 'IN' },
          },
        },
      };

      const response = await axios.post(
        `${this.apiUrl}/v2/accounts`,
        data,
        this.config,
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error Razorpay createLinkedAccount ->',
        error,
        'Data ->',
        error?.response?.data,
      );
      throw new InternalServerErrorException();
    }
  }

  static async updateLinkedAccount(accountId: string, address: any) {
    try {
      const data = {
        profile: {
          addresses: {
            registered: { ...address, country: 'IN' },
          },
        },
      };

      const response = await axios.patch(
        `${this.apiUrl}/v2/accounts/${accountId}`,
        data,
        this.config,
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error Razorpay updateLinkedAccount ->',
        error,
        'Data ->',
        error?.response?.data,
      );
      throw new InternalServerErrorException();
    }
  }

  static async createStakeholder(
    accountId: string,
    email: string,
    name: string,
  ) {
    try {
      const data = {
        email,
        name,
      };

      const response = await axios.post(
        `${this.apiUrl}/v2/accounts/${accountId}/stakeholders`,
        data,
        this.config,
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error Razorpay createStakeholder ->',
        error,
        'Data ->',
        error?.response?.data,
      );
      throw new InternalServerErrorException();
    }
  }

  static async requestProductConfig(accountId: string) {
    try {
      const data = {
        product_name: 'route',
        tnc_accepted: true,
      };

      const response = await axios.post(
        `${this.apiUrl}/v2/accounts/${accountId}/products`,
        data,
        this.config,
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error Razorpay requestProductConfig ->',
        error,
        'Data ->',
        error?.response?.data,
      );
      throw new InternalServerErrorException();
    }
  }

  static async updateProductConfig(
    accountId: string,
    productId: string,
    accountNumber: string,
    ifsc: string,
    name: string,
  ) {
    try {
      const data = {
        settlements: {
          account_number: accountNumber,
          ifsc_code: ifsc,
          beneficiary_name: name,
        },
        tnc_accepted: true,
      };

      const response = await axios.patch(
        `${this.apiUrl}/v2/accounts/${accountId}/products/${productId}`,
        data,
        this.config,
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error Razorpay updateProductConfig ->',
        error,
        'Data ->',
        error?.response?.data,
      );
      throw new InternalServerErrorException();
    }
  }

  static async getLinkedAccountPayments(accountId: string, page: number = 1) {
    try {
      const count = 30;
      const skip = (page - 1) * count;
      const response = await axios.get(
        `${this.apiUrl}/v1/payments?skip=${skip}&count=${count}`,
        {
          headers: { ...this.config.headers, 'X-Razorpay-Account': accountId },
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        'Error Razorpay getLinkedAccountPayments ->',
        error,
        'Data ->',
        error?.response?.data,
      );
      throw new InternalServerErrorException();
    }
  }
}
