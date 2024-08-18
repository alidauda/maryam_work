"use client";
import { usePaystackPayment } from "react-paystack";
import { Button } from "./ui/button";
const config = {
  reference: new Date().getTime().toString(),
  email: "user@example.com",
  amount: 20000, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
  publicKey: "pk_test_37335d37c9fb118d8a917de0a58a8efde1bb96c4",
};

// you can call this function anything
const onSuccess = (reference: any) => {
  // Implementation for whatever you want to do with reference and after success call.
  console.log(reference);
};

// you can call this function anything
const onClose = (e: any) => {
  // implementation for  whatever you want to do when the Paystack dialog closed.
  console.log("closed");
};

const PayButton = () => {
  const initializePayment = usePaystackPayment(config);
  return (
    <div>
      <Button
        variant="default"
        type="button"
        size="sm"
        className="bg-blue-400"
        onClick={() => {
          initializePayment({ onSuccess, onClose });
        }}
      >
        Pay
      </Button>
    </div>
  );
};

export default PayButton;
