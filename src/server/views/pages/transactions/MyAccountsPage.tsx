export const MyAccountsPage = (props: {
  accountIds: string[];
  selectedAccountId: string;
  username: string;
}) => {
  // function addTransactionsFromWebSocket() {
  //   socket.on('newTransaction', (data) => {
  //     try {
  //       console.log('New transaction received:', data);
  //       handleWebSocketMessage(data);
  //     } catch (error) {
  //       console.error(
  //         'Error handling new transaction from WebSocket server:',
  //         error
  //       );
  //     }
  //   });
  // }

  // function handleWebSocketMessage(accountIdWithNewTransactions: string) {
  //   if (accountIdWithNewTransactions) {
  //     return (
  //       <div
  //         hx-get={`/home/accountOverview/${accountIdWithNewTransactions}`}
  //         hx-swap='innerHTML'
  //         hx-trigger='load'
  //         hx-target='app'
  //       ></div>
  //     );
  //   } else {
  //     console.error(
  //       'Unexpected message format from WebSocket server',
  //       accountIdWithNewTransactions
  //     );
  //   }
  // }

  return (
    <div class='p-6 animate-fade-in pb-24'>
      <div
        hx-get={`/home/itemPicker/${props.selectedAccountId}`}
        hx-target='.account-selector-form'
        hx-swap='innerHTML'
        class='mb-2 flex justify-start w-fit items-center hover:-translate-y-0.5 transition-transform cursor-pointer'
      >
        <p class='text-font-off-white mr-3 text-xl'>Change Institution</p>
        <img
          class='h-3'
          src='/images/right-triangle.svg'
          alt='triangle icon'
          id='account-select-image'
        />
      </div>
      <div class='header flex items-center mb-2 mt-4 justify-between'>
        <h1 class='text-xl text-font-off-white h-fit font-semibold'>
          {' '}
          Welcome, {props.username}
        </h1>{' '}
        <h1 class='text-font-off-white font-semibold text-xl mr-2 h-fit'>
          My Accounts
        </h1>
      </div>
      {props.accountIds.map((id) => (
        <div
          hx-get={`/home/accountOverview/${id}`}
          hx-trigger='load'
          hx-swap='outerHTML'
        ></div>
      ))}
      <div class='account-selector-form' />
    </div>
  );
};

export default MyAccountsPage;
