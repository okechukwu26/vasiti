export interface PaystackVerificationResponse {
    status: boolean;
    message: "Verification successful";
    data: {
        amount: number
        currency: string
        transaction_date: Date;
        status: "success" | "failed"
        reference: string
        domain: string
        metadata: any
        gateway_response: string
        message: string
        channel: string
        ip_address: string
        fees: number
        plan: string
    };
}
