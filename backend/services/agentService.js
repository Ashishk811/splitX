import OpenAI from "openai";
import dotenv from "dotenv";
import {
  createGroupService,
  addMemberService,
  createGroupExpenseService,
  createIndividualExpenseService,
  performGroupSettlement,
  performIndividualSettlement,
  fetchOweList,
  fetchOwedByList,
  fetchGroupExpenses,
  fetchProfileService
} from "./agentTools.js";

dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Map tool name to implementation
const toolNameMap = {
  create_group: createGroupService,
  add_member: addMemberService,
  create_group_expense: createGroupExpenseService,
  create_individual_expense: createIndividualExpenseService,
  settle_group: performGroupSettlement,
  settle_individual: performIndividualSettlement,
  show_who_i_owe: fetchOweList,
  show_who_owes_me: fetchOwedByList,
  show_group_expenses: fetchGroupExpenses,
  show_my_profile: fetchProfileService
};

// Define tools with required `type: function`
const tools = [
  {
    type: "function",
    function: {
      name: "create_group",
      description: "Create a new group",
      parameters: {
        type: "object",
        properties: {
          groupName: { type: "string" },
          members: { type: "array", items: { type: "string" } }
        },
        required: ["groupName", "members"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "add_member",
      description: "Add a member to a group",
      parameters: {
        type: "object",
        properties: {
          groupId: { type: "string" },
          userIdToAdd: { type: "string" }
        },
        required: ["groupId", "userIdToAdd"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "create_group_expense",
      description: "Create a group expense",
      parameters: {
        type: "object",
        properties: {
          groupId: { type: "string" },
          description: { type: "string" },
          amount: { type: "number" },
          paidUser: { type: "string" },
          users: { type: "array", items: { type: "string" } },
          splitType: { type: "string" },
          values: { type: "array", items: { type: "number" } }
        },
        required: ["groupId", "description", "amount", "paidUser", "users", "splitType"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "create_individual_expense",
      description: "Create an individual expense",
      parameters: {
        type: "object",
        properties: {
          description: { type: "string" },
          amount: { type: "number" },
          paidUser: { type: "string" },
          users: { type: "array", items: { type: "string" } },
          splitType: { type: "string" },
          values: { type: "array", items: { type: "number" } }
        },
        required: ["description", "amount", "paidUser", "users", "splitType"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "settle_group",
      description: "Settle money between two users in a group",
      parameters: {
        type: "object",
        properties: {
          groupId: { type: "string" },
          from: { type: "string" },
          to: { type: "string" },
          amount: { type: "number" }
        },
        required: ["groupId", "from", "to", "amount"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "settle_individual",
      description: "Settle individual debts",
      parameters: {
        type: "object",
        properties: {
          from: { type: "string" },
          to: { type: "string" },
          amount: { type: "number" }
        },
        required: ["from", "to", "amount"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "show_who_i_owe",
      description: "Show all people user owes to",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "show_who_owes_me",
      description: "Show all people who owe to user",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "show_group_expenses",
      description: "Show raw group expenses",
      parameters: {
        type: "object",
        properties: { groupId: { type: "string" } },
        required: ["groupId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "show_my_profile",
      description: "Fetch user profile",
      parameters: { type: "object", properties: {} }
    }
  }
];

/**
 * Agent that interprets natural language and executes tools if required.
 */
export async function runAgent(prompt, userId) {
  const res = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `You are an AI assistant managing group expenses.
You can:
- Create group 
- Add member
- Create expenses (group or individual)
- Settle dues
- Analyze who owes whom
Whenever needed, call one of the provided functions.`
      },
      { role: "user", content: prompt }
    ],
    tools,
    tool_choice: "auto"
  });

  const choice = res.choices[0];
  const msg = choice.message;

  // If tool call is suggested
  if (msg.tool_calls && msg.tool_calls.length > 0) {
    const call = msg.tool_calls[0];
    const fnName = call.function.name;
    const args = JSON.parse(call.function.arguments);

    const fn = toolNameMap[fnName];
    if (!fn) return `No function found for ${fnName}`;

    const result = await fn(args, userId);

    // Re-analyze output nicely through AI:
    const refinement = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `Rewrite the given tool execution result in clean, concise
English for a user. Summarize outcomes and remove JSON noise.`
        },
        {
          role: "user",
          content: `Function executed: ${fnName}\nRaw result:\n${JSON.stringify(
            result,
            null,
            2
          )}`
        }
      ]
    });

    return refinement.choices[0].message.content;
  }

  // No tool required → return model text response
  // But also polish that message
  const refinedFreeText = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `Rewrite the assistant message in clean conversational English.`
      },
      { role: "user", content: msg.content }
    ]
  });

  return refinedFreeText.choices[0].message.content;
}
