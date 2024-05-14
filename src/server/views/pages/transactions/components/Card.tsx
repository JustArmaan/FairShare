interface CardDetails {
  primaryColor: string;
  textColor: string;
  accentColor1: string;
  accentColor2: string;
  bankLogo: string;
  bankName: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
}

interface CardProps {
  cardDetails: CardDetails;
}

export const Card = ({ cardDetails }: CardProps) => {
  return (
    <div class="bg-card-black text-pure-white p-5 rounded-lg border-2 border-primary-dark-grey shadow-lg max-w-md mx-auto my-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-font-grey">Card Holder:</span>
        <span class="text-lg">{cardDetails.cardHolder}</span>
      </div>
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-font-grey">Card Number:</span>
        <span class="text-lg">{cardDetails.cardNumber}</span>
      </div>
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-font-grey">Expiry Date:</span>
        <span class="text-lg">{cardDetails.expiryDate}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-font-grey">Bank Name:</span>
        <span class="text-lg">{cardDetails.bankName}</span>
      </div>
    </div>
  );
};

export default Card;
