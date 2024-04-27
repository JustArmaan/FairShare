export interface Transaction {
    id: number;
    type: "deposit" | "withdrawal";
    amount: number;
  }
  