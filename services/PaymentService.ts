export class PaymentService {
  private static STRIPE_API_KEY = 'pk_test_51234567890abcdef';
  private static PAYPAL_CLIENT_ID = 'test_paypal_client_id';

  static async processStripePayment(paymentData: {
    amount: number;
    cardNumber: string;
    cardExpiry: string;
    cardCVV: string;
  }) {
    try {
      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.STRIPE_API_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: (paymentData.amount * 100).toString(),
          currency: 'zar',
          confirm: 'true'
        }).toString()
      });

      const result = await response.json();
      return {
        success: result.status === 'succeeded',
        transactionId: result.id,
        provider: 'stripe'
      };
    } catch (error) {
      return { success: false, error: 'Payment failed' };
    }
  }

  static async processPayPalPayment(amount: number) {
    try {
      const response = await fetch('https://api.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getPayPalToken()}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'ZAR',
              value: amount.toFixed(2)
            }
          }]
        })
      });

      const order = await response.json();
      return {
        success: !!order.id,
        transactionId: order.id,
        provider: 'paypal'
      };
    } catch (error) {
      return { success: false, error: 'PayPal payment failed' };
    }
  }

  private static async getPayPalToken(): Promise<string> {
    const response = await fetch('https://api.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.PAYPAL_CLIENT_ID}:test_secret`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    return data.access_token;
  }

  static validateVCCCard(cardNumber: string): boolean {
    const vccPrefixes = ['4111', '4000', '5555', '3782'];
    return vccPrefixes.some(prefix => cardNumber.startsWith(prefix));
  }

  static async processPayment(paymentData: {
    amount: number;
    cardNumber: string;
    cardExpiry: string;
    cardCVV: string;
    provider: 'stripe' | 'paypal' | 'mock';
  }) {
    if (this.validateVCCCard(paymentData.cardNumber)) {
      return new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            transactionId: `vcc_${Date.now()}`,
            provider: 'vcc'
          });
        }, 2000);
      });
    }

    switch (paymentData.provider) {
      case 'stripe':
        return this.processStripePayment(paymentData);
      case 'paypal':
        return this.processPayPalPayment(paymentData.amount);
      default:
        return new Promise<any>((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              transactionId: `mock_${Date.now()}`,
              provider: 'mock'
            });
          }, 2000);
        });
    }
  }
}