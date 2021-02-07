import { PaystackVerificationResponse } from "./paymentInterface";
import { httpReq } from "../../utils";

export class PaymentsService {
    public async verifyPayment(transactionRef: string) {
        console.log(transactionRef)
        return await httpReq<PaystackVerificationResponse>(
            `https://api.paystack.co/transaction/verify/${transactionRef}`,
            {
                method: "get",
                headers: {
                    Authorization: `Bearer sk_test_94628a4899bc1f11113899784610ad83616d1689`,
                },
            },
        );
    }
}