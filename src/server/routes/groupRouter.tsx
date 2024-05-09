import express from "express";
import { GroupPage } from "../views/pages/Groups/GroupPage";
import { renderToHtml } from "jsxte";
import { getUser } from "@kinde-oss/kinde-node-express";
import {
  checkUserInGroup,
  getCategories,
  type GroupSchema,
} from "../services/group.service";
import { createUser, findUser } from "../services/user.service.ts";
import { AddedMember } from "../views/pages/Groups/components/Member.tsx";
import {
  createGroup,
  addMember,
  getGroupWithMembers,
  getGroupsForUserWithMembers,
  updateGroup,
} from "../services/group.service.ts";
import { getUserByEmail } from "../services/user.service.ts";
import { seedFakeTransactions } from "../database/seedFakeTransations.ts";
import { env } from "../../../env.ts";
import CreateGroup from "../views/pages/Groups/components/CreateGroup.tsx";
import { EditGroupPage } from "../views/pages/Groups/components/EditGroup.tsx";

const router = express.Router();

router.get("/page", getUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.set("HX-Redirect", `${env.baseUrl}/login`).send();
    }

    const groups = await getGroupsForUserWithMembers(req.user.id);
    const html = renderToHtml(<GroupPage groups={groups ? groups : []} />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.get("/create", getUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.set("HX-Redirect", `${env.baseUrl}/login`).send();
    }

    const { id, given_name, family_name } = req.user;

    let databaseUser = await findUser(id);
    if (!databaseUser) {
      await createUser({
        ...req.user,
        firstName: given_name,
        lastName: family_name,
      });
      await seedFakeTransactions(id, 20);
      databaseUser = await findUser(id);
      if (!databaseUser) throw new Error("failed to create user");
    }

    const allCategories = (await getCategories()) || [];

    const html = renderToHtml(
      <CreateGroup categories={allCategories} currentUser={databaseUser} />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get("/addMember", getUser, async (req, res) => {
  try {
    const email = req.query.addEmail as string;
    const member = await getUserByEmail(email);

    if (!member) {
      return res.status(400).send("User not found.");
    }

    const inGroup = await checkUserInGroup(
      member.id,
      req.query.groupId as string
    );

    console.log(inGroup, "inGroup");

    let content;

    if (inGroup) {
      return res.status(400).send("User is already in the group.");
    }

    if (!member) {
      return res.status(400).send("User not found.");
    } else {
      content = (
        <AddedMember
          user={{
            type: "member",
            id: member.email,
            firstName: member.firstName,
            email: member.email,
          }}
        />
      );
    }
    let html = renderToHtml(content);
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.post("/create", getUser, async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) {
      return res.set("HX-Redirect", "/login").send();
    }

    const {
      groupName,
      selectedCategoryId,
      memberEmails,
      temporaryGroup,
      selectedColor,
    } = req.body;

    if (
      !groupName ||
      groupName === "" ||
      !selectedCategoryId ||
      selectedCategoryId === "" ||
      !memberEmails ||
      memberEmails === "" ||
      !selectedColor ||
      selectedColor === ""
    ) {
      res.status(400).send("Please fill out all fields.");
    }

    const isTemp = temporaryGroup === "on";

    const group = await createGroup(
      groupName,
      selectedColor,
      selectedCategoryId,
      isTemp.toString()
    );

    if (!group) {
      return res.status(500).send("Failed to create group.");
    }

    const groupMembers = memberEmails.split(",");
    for (const memberEmail of groupMembers) {
      const user = await getUserByEmail(memberEmail);
      if (user) {
        await addMember(group.id, user.id);
      } else {
        return res
          .status(400)
          .send(`User with email ${memberEmail} not found.`);
      }
    }
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the group.");
  }
});

router.get("/edit", getUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.set("HX-Redirect", `${env.baseUrl}/login`).send();
    }
    const groups = await getGroupsForUserWithMembers(req.user.id);
    const html = renderToHtml(<GroupPage groups={groups ? groups : []} edit />);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

export type UserGroupSchema = NonNullable<
  Awaited<ReturnType<typeof getGroupWithMembers>>
>;

router.get("/edit/:groupId", getUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.set("HX-Redirect", `${env.baseUrl}/login`).send();
    }

    const currentUser = await findUser(req.user.id);
    if (!currentUser) {
      return res.status(500).send("Failed to get user");
    }

    const categories = await getCategories();
    if (!categories) return res.status(500).send("Failed to get categories");

    const group = await getGroupWithMembers(req.params.groupId);

    if (!group) return res.status(404).send("No such group");
    const html = renderToHtml(
      <EditGroupPage
        categories={categories}
        currentUser={currentUser}
        group={group}
      />
    );
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

router.post("/update/:groupId", getUser, async (req, res) => {
  try {
    const {
      groupName,
      selectedCategoryId,
      selectedColor,
      memberEmails,
      temporaryGroup,
    } = req.body;

    const isTemp = temporaryGroup === "on";
    const currentGroup = await getGroupWithMembers(req.params.groupId);

    if (!currentGroup) {
      return res.status(404).send("Group not found");
    }

    const updates: {
      name?: string;
      color?: string;
      icon?: string;
      temporary?: string;
    } = {};
    if (groupName !== currentGroup.name && groupName !== "")
      updates.name = groupName;
    if (selectedColor !== currentGroup.color && selectedColor !== "")
      updates.color = selectedColor;
    if (selectedCategoryId !== currentGroup.icon && selectedCategoryId !== "")
      updates.icon = selectedCategoryId;
    if (
      isTemp.toString() !== currentGroup.temporary &&
      isTemp.toString() !== ""
    )
      updates.temporary = isTemp.toString();

    const groupMembers = memberEmails
      ? memberEmails.split(",").map((email: string) => email.trim())
      : [];
    const existingEmails = new Set(
      currentGroup.members.map((member) => member.email)
    );
    const newMembers = groupMembers.filter(
      (email: string) => !existingEmails.has(email)
    );

    if (Object.keys(updates).length === 0 && newMembers.length === 0) {
      return res.status(400).send("No changes detected");
    }

    if (Object.keys(updates).length > 0) {
      const updatedGroup = await updateGroup(
        req.params.groupId,
        updates.name,
        updates.color,
        updates.icon,
        updates.temporary
      );

      if (!updatedGroup) {
        return res.status(500).send("Failed to update group");
      }
    }

    for (const memberEmail of newMembers) {
      const user = await getUserByEmail(memberEmail);
      if (user) {
        await addMember(currentGroup.id, user.id);
      } else {
        return res.status(400).send(`User with email ${memberEmail} not found`);
      }
    }

    res.send("Changes Saved");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the group");
  }
});

router.get("/transactions/:groupId", getUser, async (req, res) => {
  // unfinished
  if (!req.user) {
    return res.set("HX-Redirect", `${env.baseUrl}/login`).send();
  }
  const group = await getGroupWithMembers(req.params.groupId);
  if (!group) return res.status(404).send("No such group");
  const { id } = req.user;
});

export const groupRouter = router;
