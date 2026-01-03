export class PaymentService {
  static async processPayment(amount: number) {
    // Stub for now (Firebase backend later)
    return {
      success: true,
      reference: `PAY-${Date.now()}`
    };
  }
}
