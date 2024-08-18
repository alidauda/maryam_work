import dynamic from "next/dynamic";

const PayButton = dynamic(() => import("./paystactk"), { ssr: false });

export default PayButton;
