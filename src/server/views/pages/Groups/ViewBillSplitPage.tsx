import type { UserSchema } from "../../../interface/types";
import type { GroupWithMembers } from "../../../services/group.service";
import { BillSplitReceipt } from "./components/BillSplitReceipt";
import Members from "./components/Members";
import LinkTransactionDetails from "./components/LinkTransactionDetails";

type owedPerMember = {
  totalOwed: number;
  member: UserSchema;
};

export const ViewBillSplitPage = (props: {
  transactionDetails: any;
  receiptItems: any;
  groupWithMembers: GroupWithMembers;
  currentUser: UserSchema;
  owedPerMember: owedPerMember[];
}) => {
  const memberDetailsWithOwed = props.groupWithMembers.members.map((member) => {
    const owedMember = props.owedPerMember.find(
      (owed) => owed.member.id === member.id
    );
    return {
      ...member,
      amount: owedMember ? owedMember.totalOwed : 0,
    };
  });

  const owedPerMemberMapped = memberDetailsWithOwed.map((member) => ({
    userId: member.id,
    amount: member.amount,
  }));

  return (
    <div class="animate-fade-in">
      <div class="flex justify-between mb-[0.75rem]">
        <a
          hx-get="/groups/page"
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          hx-push-url="/groups/page"
          class="text-font-off-white text-4xl cursor-pointer w-fit"
        >
          <img
            src="/icons/arrow_back_ios.svg"
            alt="back arrow icon"
            class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
          />
        </a>{" "}
        <a
          hx-get={``}
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          class="text-font-off-white text-4xl cursor-pointer flex "
        >
          <img
            src="/icons/threeDot.svg"
            alt="More Icon"
            class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6 justify-end"
          />
        </a>
      </div>
      <div class="flex flex-col text-font-off-white items-center">
        <h1 class="text-xl">{props.transactionDetails.companyName}</h1>
        <div class="flex font-semibold text-2xl">
          <p class="mr-1">Total:</p>
          <p>$146.76</p>
        </div>
        <p class="text-sm text-font-grey mb-[1.37rem]">
          {props.transactionDetails.date}
        </p>
      </div>
      <LinkTransactionDetails amount={100} />

      <div class="w-full rounded-lg bg-primary-black pt-3">
        <h1 class="text-font-off-white ml-4 mt-1">Split By Items:</h1>
        <div class="flex flex-wrap items-center">
          <Members
            memberDetails={memberDetailsWithOwed}
            currentUser={props.currentUser}
            owedPerMember={[owedPerMemberMapped]}
          />
        </div>
        <BillSplitReceipt
          transactionsDetails={props.transactionDetails}
          receiptItems={props.receiptItems}
        />
      </div>
    </div>
  );
};
