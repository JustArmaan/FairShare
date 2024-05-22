import express from 'express';
import { renderToHtml } from 'jsxte';
import {
  getGroupTransactionWithSplitType,
  getGroupWithMembers,
  getSplitOptions,
} from '../services/group.service';
import { SplitOptionsPage } from '../views/pages/Transfers/SplitOptionsPage';

const router = express.Router();

function uppercaseFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

router.get(
  '/splitTransaction/splitOptions/open/:transactionId/:groupId',
  async (req, res) => {
    const splitTypes = await getSplitOptions();
    const transaction = await getGroupTransactionWithSplitType(
      req.params.groupId,
      req.params.transactionId
    );

    if (!transaction) {
      return res.status(404).send('No such transaction');
    }

    if (!splitTypes) {
      return res.status(404).send('No split options found');
    }

    const html = renderToHtml(
      <div
        hx-get={`/transfer/splitTransaction/splitOptions/closed/${transaction.transaction.id}/${req.params.groupId}`}
        hx-trigger='click'
        hx-target='this'
        hx-swap='outerHTML'
      >
        <div class='flex py-2 hover:opacity-80 pointer-cursor px-4 justify-between text-left text-font-off-white bg-primary-black rounded-lg mt-2 w-full'>
          <input
            id='select-split-options'
            type='button'
            name='select-split-options'
            value={uppercaseFirstLetter(transaction.type)}
          />
          <img src='/activeIcons/expand_more.svg' alt='expandable' />
        </div>
        {splitTypes.map((splitType) => (
          <div
            data-split-option={`${splitType.id}`}
            class='flex items-center p-2 mt-2 bg-primary-black rounded-lg hover:bg-primary-faded-black w-full animation-fade-in text-font-off-white'
          >
            {splitType.type}
          </div>
        ))}
      </div>
    );

    res.send(html);
  }
);

router.get(
  '/splitTransaction/splitOptions/closed/:transactionId/:groupId',
  async (req, res) => {
    const splitTypes = await getSplitOptions();
    const transaction = await getGroupTransactionWithSplitType(
      req.params.groupId,
      req.params.transactionId
    );

    if (!transaction) {
      return res.status(404).send('No such transaction');
    }

    if (!splitTypes) {
      return res.status(404).send('No split options found');
    }

    const html = renderToHtml(
      <div
        hx-get={`/transfer/splitTransaction/splitOptions/open/${transaction.transaction.id}/${req.params.groupId}`}
        hx-trigger='click'
        hx-target='this'
        hx-swap='outerHTML'
      >
        <div class='flex py-2 hover:opacity-80 pointer-cursor px-4 justify-between text-left text-font-off-white bg-primary-black rounded-lg mt-2 w-full'>
          <input
            id='select-split-options'
            type='button'
            name='select-split-options'
            value={uppercaseFirstLetter(transaction.type)}
          />
          <img src='/activeIcons/expand_more.svg' alt='expandable' />
        </div>
      </div>
    );

    res.send(html);
  }
);

router.get('/splitTransaction/:groupId/:transactionId', async (req, res) => {
  const groupId = req.params.groupId;
  const transactionId = req.params.transactionId;
  const groupWithMembers = await getGroupWithMembers(groupId);

  if (!groupWithMembers) {
    return res.status(404).send('No such group');
  }

  const transactionDetails = await getGroupTransactionWithSplitType(
    groupId,
    transactionId
  );

  if (!transactionDetails) {
    return res.status(404).send('No such transaction');
  }

  const html = renderToHtml(
    <SplitOptionsPage
      groupId={groupId}
      transactionId={transactionId}
      transaction={transactionDetails}
      groupWithMembers={groupWithMembers}
      isOpen={true}
    />
  );

  res.send(html);
});

export const transferRouter = router;
