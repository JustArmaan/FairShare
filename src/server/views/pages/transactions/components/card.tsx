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
    <div 
    class="bg-primary-red text-font-off-white rounded-lg shadow-lg p-4 relative h-48 overflow-hidden mb-3 max-w-96 ">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center mb-2">
          <img src="/cardAssets/scotiabank.svg" class="h-8 mr-2" />{" "}
          <h2 class="text-xl font-bold">{cardDetails.bankName}</h2>
        </div>
      </div>
      <div class="text-2xl font-semibold tracking-wider">
        {cardDetails.cardNumber}
      </div>
      <div class="flex justify-between items-center mt-6 mr-2 ml-2">
        <div>
          <p class="text-xs text-gray-300">Card Holder</p>
          <p class="font-medium">{cardDetails.cardHolder}</p>
        </div>
        <div>
          <p class="text-xs text-gray-300">Expiry Date</p>
          <p class="font-medium">{cardDetails.expiryDate}</p>
        </div>
        <div class="flex items-center">
          <div class="bg-accent-yellow h-10 w-10 rounded-full"></div>
          <div class="bg-accent-red h-10 w-10 rounded-full -ml-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Card;
