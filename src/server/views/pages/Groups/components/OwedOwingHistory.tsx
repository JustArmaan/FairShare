import { PendingItems } from "./PendingItem";
import { OwedGroup } from "./OwedGroup";
import type {
  UserSchema,
  UserSchemaWithMemberType,
} from "../../../../interface/types";
import type { GroupWithTransactions } from "../../../../services/group.service";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";
import type { getAllOwedForGroupTransactionWithTransactionId } from "../../../../services/owed.service";

export const tabs = ["owed", "owing", "history"] as const;

export const OwedOwingHistory = (props: {
  members: UserSchemaWithMemberType[];
  currentUser: UserSchema;
  transactions: GroupWithTransactions;
  owedPerMember: ExtractFunctionReturnType<
    typeof getAllOwedForGroupTransactionWithTransactionId
  >[];
  groupId: string;
  url: string;
  selectedTab: (typeof tabs)[number];
}) => {
  const buttonBaseClasslist =
    "bg-primary-black hover:-translate-y-0.5 w-[6rem] h-[2rem] transition-transform text-font-off-white px-5 rounded-lg shadow-lg hover:bg-blue-600 flex flex-row justify-center font-normal border-font-off-white  mr-[0.90rem]";
  const buttonSelectedClasslist = "border-[3px]";
  const buttonUnselectedClasslist = "bg-primary-black";

  return (
    <div id="owed-owing-history">
      <div class="flex flex-row mt-[1.90rem]">
        {tabs.map((tab) => (
          <button
            class={`${buttonBaseClasslist} ${props.selectedTab === tab ? buttonSelectedClasslist : buttonUnselectedClasslist}`}
            hx-get={`/groups/view/OwedOwingHistory?groupId=${props.groupId}&tab=${tab}`}
            hx-trigger={props.selectedTab !== tab ? "click" : "none"}
            hx-swap="outerHTML"
            hx-target="#owed-owing-history"
          >
            <p class="self-center my-[0.8rem]">
              {[tab.split("")[0].toUpperCase(), ...tab.split("").slice(1)].join(
                ""
              )}
            </p>
          </button>
        ))}
      </div>
      <div class="my-3 h-[1px] bg-primary-dark-grey rounded w-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"></div>
      <PendingItems
        memberDetails={props.members}
        currentUser={props.currentUser}
        transactions={props.transactions}
        owedPerMember={props.owedPerMember}
        groupId={props.groupId}
      />
      {props.selectedTab !== "history" && (
        <OwedGroup
          owing={props.selectedTab === "owing"}
          memberDetails={props.members}
          currentUser={props.currentUser}
          transactions={props.transactions}
          owedPerMember={props.owedPerMember.filter((owed) => owed.length > 0)}
          groupId={props.groupId}
          url={props.url}
        />
      )}
    </div>
  );
};
