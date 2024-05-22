import express from 'express';
import { renderToHtml } from 'jsxte';
import {
  getGroupTransactionWithSplitType,
  getGroupWithMembers,
  getSplitOptions,
} from '../services/group.service';
import { SplitOptionsPage } from '../views/pages/Transfers/SplitOptionsPage';
import { getAllOwedForGroupTransactionWithMemberInfo } from '../services/owed.service';
import { FullSelector } from '../views/pages/Transfers/components/FullSelector';
import { getSplitTypeById } from '../services/transfer.service';

const router = express.Router();

function uppercaseFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

router.get(
  '/splitTransaction/splitOptions/open/:transactionId/:groupId/:selectedType',
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

    const selectedType = splitTypes.find(
      (splitType) => splitType.type === req.params.selectedType
    );

    if (!selectedType) {
      return res.status(404).send('No such split type');
    }

    const html = renderToHtml(
      <div
        hx-get={`/transfer/splitTransaction/splitOptions/closed/${transaction.transaction.id}/${req.params.groupId}/${selectedType.type}`}
        hx-trigger='click'
        hx-target='#split-swapper'
        hx-swap='innerHTML'
        class='w-full'
      >
        <div class='flex py-2 hover:opacity-80 pointer-cursor px-4 justify-between text-left text-font-off-white bg-primary-black rounded-lg mt-2 w-full'>
          <input
            id='select-split-options'
            type='button'
            name='select-split-options'
            value={uppercaseFirstLetter(selectedType.type)}
          />
          <img src='/activeIcons/expand_more.svg' alt='expandable' />
        </div>
        {splitTypes.map((splitType) => (
          <div
            hx-get={`/transfer/fullSelector/${req.params.groupId}/${transaction.transaction.id}/${splitType.id}`}
            hx-trigger='click'
            hx-target='#swap-full-selector'
            hx-swap='innerHTML'
            data-split-option={`${splitType.id}`}
            class='flex items-center p-2 mt-2 bg-card-black rounded-lg hover:bg-primary-faded-black w-full animation-fade-in'
          >
            {uppercaseFirstLetter(splitType.type)}
          </div>
        ))}
      </div>
    );

    res.send(html);
  }
);

router.get(
  '/splitTransaction/splitOptions/closed/:transactionId/:groupId/:splitTypeName',
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

    const selectedSplitType = splitTypes.find(
      (splitType) => splitType.type === req.params.splitTypeName
    );

    if (!selectedSplitType) {
      return res.status(404).send('No such split type');
    }

    const html = renderToHtml(
      <div
        hx-get={`/transfer/splitTransaction/splitOptions/open/${transaction.transaction.id}/${req.params.groupId}/${selectedSplitType.type}`}
        hx-trigger='click'
        hx-target='#split-swapper'
        hx-swap='innerHTML'
        class='w-full'
      >
        <div class='flex py-2 hover:opacity-80 pointer-cursor px-4 justify-between text-left text-font-off-white bg-primary-black rounded-lg mt-2 w-full'>
          <input
            id='select-split-options'
            type='button'
            name='select-split-options'
            value={uppercaseFirstLetter(
              selectedSplitType.type ? selectedSplitType.type : transaction.type
            )}
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
  const groupWithMember = await getGroupWithMembers(groupId);

  if (!groupWithMember) {
    return res.status(404).send('No such group');
  }

  const transactionDetails = await getGroupTransactionWithSplitType(
    groupId,
    transactionId
  );

  if (!transactionDetails) {
    return res.status(404).send('No such transaction');
  }

  const owedInfo = await getAllOwedForGroupTransactionWithMemberInfo(
    groupId,
    transactionId
  );

  if (!owedInfo) {
    return res.status(404).send('No owed info found');
  }

  const html = renderToHtml(
    <SplitOptionsPage
      groupId={groupId}
      transactionId={transactionId}
      transaction={transactionDetails}
      groupWithMembers={groupWithMember}
      owedInfo={owedInfo}
      isOpen={true}
      splitType={transactionDetails.type}
    />
  );

  res.send(html);
});

router.get(
  '/fullSelector/:groupId/:transactionId/:selectedType',
  async (req, res) => {
    const groupId = req.params.groupId;
    const transactionId = req.params.transactionId;
    const groupWithMember = await getGroupWithMembers(groupId);
    const splitTypeId = req.params.selectedType;

    const splitType = await getSplitTypeById(splitTypeId);

    if (!splitType) {
      return res.status(404).send('No such split type');
    }

    if (!groupWithMember) {
      return res.status(404).send('No such group');
    }

    const transactionDetails = await getGroupTransactionWithSplitType(
      groupId,
      transactionId
    );

    if (!transactionDetails) {
      return res.status(404).send('No such transaction');
    }

    const owedInfo = await getAllOwedForGroupTransactionWithMemberInfo(
      groupId,
      transactionId
    );

    if (!owedInfo) {
      return res.status(404).send('No owed info found');
    }

    const html = renderToHtml(
      <FullSelector
        groupId={groupId}
        transactionId={transactionId}
        transaction={transactionDetails}
        groupWithMembers={groupWithMember}
        owedInfo={owedInfo}
        splitType={splitType[0].type}
      />
    );

    res.send(html);
  }
);

router.post('/splitOptions/edit', async (req, res) => {
  const { splitOptions } = req.body;
  console.log(req.body, 'req.body');
  if (!splitOptions) {
    return res.status(400).send('No split options provided');
  }

  // const updatedSplitOptions = await updateSplitOptions(splitOptions);

  // if (!updatedSplitOptions) {
  //   return res.status(500).send('Failed to update split options');
  // }

  // res.send({ updatedSplitOptions });
});

export const transferRouter = router;
