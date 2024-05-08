import express from "express";
import { GroupPage } from "../views/pages/Groups/components/CreateGroup";
import { renderToHtml } from "jsxte";
import { getDB } from "../database/client.ts";
import { getUser } from "@kinde-oss/kinde-node-express";
import { type GroupSchema } from "../services/group.service";
import { groups } from "../database/schema/group";
import { getCategories } from "../services/group.service";
import { findUser } from "../services/user.service.ts";
import { AddedMember } from "../views/pages/Groups/components/Member.tsx";
import { createGroup, addMember } from "../services/group.service.ts";
import { getUserByEmail } from "../services/user.service.ts";

let db = getDB();

const groupData = {
  id: "randomid1234",
  name: "Family👪",
};

const groupMembers = [
  {
    id: "randomid1234",
    name: "Sandy",
    email: "sandy@gmail.com",
  },
  {
    id: "randomid1234",
    name: "Bob",
    email: "bob@gmail.com",
  },
  {
    id: "randomid1234",
    name: "Alice",
    email: "alice@gmail.com",
  },
];

const router = express.Router();

router.get("/page", getUser, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.set("HX-Redirect", "/login").send();
    }

    const user = await findUser(userId);

    const allCategories = (await getCategories()) || [];

    const html = renderToHtml(
      <GroupPage categories={allCategories} currentUser={user} />
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
    let content;

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
    const userId = req.user?.id;
    if (!userId) {
      return res.set("HX-Redirect", "/login").send();
    }
    const {
      groupName,
      selectedCategoryId,
      memberEmails,
      temporaryGroup,
      selectedColor,
    } = req.body;

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
      }
    }
  } catch (error) {
    console.error(error);
  }
});

export const groupRouter = router;
