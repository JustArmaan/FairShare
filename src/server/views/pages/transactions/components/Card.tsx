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
    <div class="bg-card-red text-font-off-white rounded-xl shadow-lg py-4 px-2 relative h-48 overflow-hidden mb-3 w-full">
      <div class="flex justify-between items-center mb-1">
        <div class="flex items-center mb-2">
          <img src="/cardAssets/scotiabank.svg" class="h-9 w-9 mr-1" />{' '}
          <h2 class="text-xl font-medium">{cardDetails.bankName}</h2>
        </div>
      </div>
      <div class="ml-10 mr-4 text-xl font-semibold">
        <p>{cardDetails.cardNumber}</p>
        <div class="flex justify-between items-center mt-6 mr-2">
          <div>
            <p class="text-sm">Card Holder</p>
            <p class="font-medium text-sm">{cardDetails.cardHolder}</p>
          </div>
          <div>
            <p class="text-sm">Expiry Date</p>
            <p class="font-medium text-sm">{cardDetails.expiryDate}</p>
          </div>
          <div class="flex items-center">
            <div class="bg-accent-red h-8 w-8 rounded-full"></div>
            <div class="bg-accent-yellow h-8 w-8 rounded-full -ml-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
