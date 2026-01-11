import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { BufferMemory } from "@langchain/classic/memory";
import { ConversationChain } from "@langchain/classic/chains";
import { auth } from "@clerk/nextjs/server";
import amazonHR from "@/data/amazon-hr.json";

// 🧠 Global memory map for all users
const userMemories = new Map();

// 🧠 Load Amazon HR data
const hr_data_text = JSON.stringify(amazonHR, null, 2);

// 💬 Initialize Gemini model (once)
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  temperature: 0.9,
  apiKey: process.env.GOOGLE_API_KEY,
});

// 🧩 Prompt template (once)
const prompt = new PromptTemplate({
  template: `
You are an **Amazon HR interviewer** conducting a 15-minute mock interview.

Use the following:
- Candidate Resume: {resume}
- Amazon HR Dataset (Examples of Amazon HR tone, values, and leadership principles): {hr_data}
- Interview so far: {history}
- Candidate's latest answer: {input}

Your task:
- Ask ONE *new* HR-style question that reflects Amazon's leadership principles (like customer obsession, ownership, invent & simplify, bias for action, etc.)
- Make it feel natural and specific to Amazon.
- Do NOT repeat questions from the dataset — create new but Amazon-style questions.
- Build on the candidate’s background and previous responses.

Now, ask the next HR question.
`,
  inputVariables: ["resume", "hr_data", "history", "input"],
});

// 🚀 POST API Route
export async function POST(req: Request) {
  try {
    // ✅ Get authenticated user
    let { userId } = await auth();
console.log("🔐 Authenticated user ID:", userId);

// TEMPORARY bypass for Postman testing
if (!userId) {
  console.log("⚠️ No Clerk user detected. Using test user.");
  userId = "test-user-123"; 
}


    const { input, resumeText } = await req.json();
    const resume = resumeText || "No resume provided yet.";

    // 🎯 Get or create user-specific memory
    let memory = userMemories.get(userId);
    if (!memory) {
      memory = new BufferMemory({
        memoryKey: "history",
        inputKey: "input",
      });
      userMemories.set(userId, memory);
    }

    // 🧠 Log memory BEFORE AI call
    console.log("📜 Memory BEFORE AI call for user:", userId);
    console.log(await memory.loadMemoryVariables({ input }));

    // 🧠 Create conversation chain per user
    const chain = new ConversationChain({
      llm: model,
      memory,
      prompt,
    });

    // 💬 Call AI
    const response = await chain.call({
      input,
      resume,
      hr_data: hr_data_text,
    });

    // 🧾 Log memory AFTER AI call
    console.log("📜 Memory AFTER AI call for user:", userId);
    console.log(await memory.loadMemoryVariables({ input }));

    return Response.json({
      question: response.response,
    });
  } catch (error) {
    console.error("❌ Error in Amazon HR interview route:", error);
    return Response.json(
      { error: "Something went wrong generating the question." },
      { status: 500 }
    );
  }
}