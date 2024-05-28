import { io } from 'socket.io-client';
import htmx from 'htmx.org';

export function setupSocketListener() {
  document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on('connect', () => {
      console.log(socket.id);
    });

    socket.on('disconnect', () => {
      console.log(socket.id);
    });

    socket.on('newTransaction', (data) => {
      const newTransactions: NewTransaction = data.newTransactions;
      const transactionList = document.querySelector(
        `#transactionList-${newTransactions.accountId}`
      );
      const accountOverview = document.querySelector('#accountOverview');

      if (
        transactionList &&
        newTransactions &&
        newTransactions.transactionIds.length > 0
      ) {
        newTransactions.transactionIds.map((id) => {
          htmx.ajax('GET', `/transactions/transaction/${id}`, {
            target: '#transactionList-${newTransactions.accountId}',
            swap: 'afterbegin',
            event: 'load',
          });
        });
      }

      if (accountOverview && newTransactions) {
        htmx.ajax('GET', `/home/accountOverview/${newTransactions.accountId}`, {
          target: `accountOverview-${newTransactions.accountId}`,
          swap: 'outerHTML',
          event: 'load',
        });
      }
    });
  });
}

type NewTransaction = {
  transactionIds: string[];
  accountId: string;
};
