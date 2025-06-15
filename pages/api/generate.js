// pages/api/generate.js
import dbConnect from "@/lib/dbConnect";
import Chat from "@/models/Chat";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { prompt, chatId, messages } = req.body;

  console.log(`Generate API called with chatId: ${chatId}`);
  console.log(`History messages count: ${messages?.length || 0}`);

  if (!prompt || !chatId) {
    return res.status(400).json({ message: "Prompt and chatId are required" });
  }

  try {
    await dbConnect();

    let chat = await Chat.findOne({ chatId });

    if (!chat) {
      chat = new Chat({
        chatId,
        title: prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt,
        messages: [],
      });
      console.log(`Created new chat with ID ${chatId}`);
    } else {
      console.log(
        `Found chat with ID ${chatId}, message count: ${
          chat?.messages?.length || 0
        }`
      );
    }

    if (
      !chat.messages.some(
        (m) =>
          m.role === "user" &&
          m.content === prompt &&
          new Date(m.timestamp).getTime() > Date.now() - 60000 // Within the last minute
      )
    ) {
      chat.messages.push({
        role: "user",
        content: prompt,
        timestamp: new Date(),
      });
      await chat.save();
      console.log(`Added user message to chat: ${prompt.substring(0, 50)}...`);
    }

    if (chat.messages.length <= 1 || chat.title === "New Chat") {
      const title =
        prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt;
      chat.title = title;
      await chat.save();
      console.log(`Updated chat title to: ${title}`);
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("Google API Key is missing");
    }

    const maxHistoryMessages = 10;

    const recentMessages = messages.slice(-maxHistoryMessages);

    const history = recentMessages.map((msg) => {
      if (msg.role === "user") {
        return {
          role: "user",
          parts: [{ text: msg.content }],
        };
      }

      return {
        role: "model",
        parts: [{ text: msg.explanation || msg.content }],
      };
    });

    if (messages.length > 0) {
      history.unshift({
        role: "user",
        parts: [
          {
            text: `This is a follow-up question in our conversation about Solana smart contracts. Please remember the context of our previous discussion when answering.`,
          },
        ],
      });
    }

    console.log(`Prepared ${history.length} messages for Gemini API`);

    const systemPrompt = `You are Solana Sage, an AI assistant specialized in creating Solana smart contracts using the Anchor framework.

    For each user request, you must:
    1. Generate complete, working Anchor (Rust) code for Solana
    2. Provide a detailed explanation of how the code works
    3. Organize code into a logical file structure

    Your explanation should include:
    - Solana Program Features: A clear description of what the program does
    - How to set up and deploy the code
    - Detailed explanation of key functions and their purpose

    IMPORTANT FORMATTING INSTRUCTIONS:
    - Each code block MUST begin with a filename comment line
    - Use this exact format for each file: "// filename: path/to/file.rs"
    - Place the filename comment as the FIRST line inside the code block
    - Use complete, descriptive file paths (e.g., "programs/counter/src/lib.rs")

    Example correct format:
    \`\`\`rust
    // filename: programs/counter/src/lib.rs
    use anchor_lang::prelude::*;

    #[program]
    pub mod counter {
        // code here
    }
    \`\`\`

    \`\`\`toml
    // filename: Cargo.toml
    [package]
    name = "counter"
    // dependencies here
    \`\`\`

    DO NOT ABBREVIATE CODE. Generate complete, fully functional code for all files.
    DO NOT create empty or placeholder files.
    Each file must have meaningful, working code.`;

    let aiMessage;

    console.log(
      `Making request to Gemini API with prompt length: ${prompt.length}`
    );

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
          apiKey,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: systemPrompt }] },
              ...history,
              { role: "user", parts: [{ text: prompt }] },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8192,
            },
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Gemini API response:",
        JSON.stringify(data).substring(0, 200) + "..."
      );

      if (data.error) {
        throw new Error(
          `Gemini API error: ${
            data.error.message || JSON.stringify(data.error)
          }`
        );
      }

      if (!data.candidates || data.candidates.length === 0) {
        console.error("No candidates in Gemini response:", data);
        throw new Error("No response generated from Gemini API");
      }

      const responseText = data.candidates[0].content.parts[0].text;
      console.log(
        `Received response from Gemini API with length: ${responseText.length}`
      );

      let code = "";
      let explanation = "";
      let files = {};

      try {
        explanation = responseText
          .replace(/```(?:rust|toml|json|sh|bash)?[\s\S]*?```/g, "")
          .trim();

        const codeBlockRegex = /```(rust|toml|json|sh|bash)?\n([\s\S]*?)```/g;
        let match;
        let defaultFileCount = 0;

        while ((match = codeBlockRegex.exec(responseText)) !== null) {
          const language = match[1] || "rust";
          const codeContent = match[2].trim();

          if (!codeContent || codeContent.length < 5) {
            continue;
          }

          const filePathMatch = codeContent.match(
            /^\s*(?:\/\/|#)\s*(?:filename:?|file:?)?\s*(.+\.(?:rs|toml|json|sh|js|ts))/i
          );

          if (filePathMatch) {
            const filePath = filePathMatch[1].trim();

            const cleanedCode = codeContent.replace(
              /^\s*(?:\/\/|#)\s*(?:filename:?|file:?)?\s*(.+\.(?:rs|toml|json|sh|js|ts))\s*\n/i,
              ""
            );

            if (cleanedCode && cleanedCode.length > 5 && !files[filePath]) {
              files[filePath] = cleanedCode;
            }
          } else {
            let fileName = "";

            if (language === "toml" || codeContent.includes("[package]")) {
              if (
                codeContent.includes('name = "anchor"') ||
                codeContent.includes("anchor-lang")
              ) {
                fileName = "Anchor.toml";
              } else {
                fileName = "Cargo.toml";
              }
            } else if (codeContent.includes("#[program]")) {
              const programNameMatch = codeContent.match(/pub mod (\w+)/);
              const programName = programNameMatch
                ? programNameMatch[1]
                : "counter";
              fileName = `programs/${programName}/src/lib.rs`;
            } else if (
              language === "json" ||
              (codeContent.includes("dependencies") &&
                codeContent.includes("{") &&
                codeContent.includes("}"))
            ) {
              fileName = "package.json";
            } else if (
              language === "typescript" ||
              language === "ts" ||
              (codeContent.includes("describe(") && codeContent.includes("it("))
            ) {
              fileName = "tests/test.ts";
            } else if (
              language === "bash" ||
              language === "sh" ||
              codeContent.includes("#!/bin/bash")
            ) {
              fileName = "scripts/deploy.sh";
            } else if (
              language === "rust" &&
              codeContent.includes("struct") &&
              !codeContent.includes("#[program]")
            ) {
              const existingLibFile = Object.keys(files).find((file) =>
                file.includes("/lib.rs")
              );
              if (existingLibFile) {
                const programPath = existingLibFile.split("/src/")[0];
                fileName = `${programPath}/src/state.rs`;
              } else {
                fileName = "programs/counter/src/state.rs";
              }
            } else if (
              language === "rust" &&
              codeContent.includes("use anchor_lang")
            ) {
              defaultFileCount++;

              if (codeContent.includes("error")) {
                fileName = "programs/counter/src/errors.rs";
              } else if (codeContent.includes("fn initialize")) {
                fileName = "programs/counter/src/instructions/initialize.rs";
              } else if (codeContent.includes("fn deposit")) {
                fileName = "programs/counter/src/instructions/deposit.rs";
              } else if (codeContent.includes("fn withdraw")) {
                fileName = "programs/counter/src/instructions/withdraw.rs";
              } else if (codeContent.includes("instructions")) {
                fileName = "programs/counter/src/instructions/mod.rs";
              } else {
                if (
                  !Object.keys(files).some((file) => file.includes("/lib.rs"))
                ) {
                  fileName = "programs/counter/src/lib.rs";
                } else {
                  fileName = `programs/counter/src/additional${defaultFileCount}.rs`;
                }
              }
            } else {
              continue;
            }

            if (files[fileName]) {
              if (
                fileName.includes("/lib.rs") &&
                files[fileName] &&
                !files[fileName].includes(codeContent)
              ) {
                files[fileName] += "\n\n" + codeContent;
              } else {
                let counter = 1;
                while (files[fileName + counter]) {
                  counter++;
                }
                fileName = fileName.replace(/\.([^.]+)$/, `${counter}.$1`);
              }
            }

            if (codeContent && codeContent.length > 5) {
              files[fileName] = codeContent;
            }
          }
        }

        if (Object.keys(files).length === 0) {
          const mainCode = responseText
            .replace(/^[\s\S]*?```(?:rust|toml)?\n/m, "")
            .replace(/```[\s\S]*$/m, "");
          if (mainCode && mainCode.length > 5) {
            files["programs/counter/src/lib.rs"] = mainCode;
          }
        }

        if (
          !Object.keys(files).some((file) => file.includes("/lib.rs")) &&
          Object.keys(files).length > 0
        ) {
          const programContent = Object.values(files).find((content) =>
            content.includes("#[program]")
          );
          if (programContent) {
            files["programs/counter/src/lib.rs"] = programContent;
            const duplicateFile = Object.keys(files).find(
              (file) => files[file] === programContent
            );
            if (duplicateFile) {
              delete files[duplicateFile];
            }
          }
        }

        Object.keys(files).forEach((filePath) => {
          if (
            !files[filePath] ||
            files[filePath].length < 5 ||
            files[filePath].trim() === ""
          ) {
            delete files[filePath];
          }
        });

        code = JSON.stringify(files);
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        explanation =
          "There was an error parsing the response. Here's the raw output:";
        code = JSON.stringify({ "programs/counter/src/lib.rs": responseText });
      }

      aiMessage = {
        role: "ai",
        content: responseText,
        code,
        explanation,
        timestamp: new Date(),
      };

      console.log(
        `Created AI message with code length: ${code.length} and explanation length: ${explanation.length}`
      );
    } catch (apiError) {
      console.error("Gemini API error:", apiError);

      aiMessage = {
        role: "ai",
        content:
          "I'm currently having trouble connecting to the Gemini API. Here's a simple counter example instead.",
        code: '// lib.rs\nuse anchor_lang::prelude::*;\n\n#[program]\npub mod counter {\n    use super::*;\n    \n    pub fn initialize(ctx: Context<Initialize>, start_value: u64) -> Result<()> {\n        ctx.accounts.counter.value = start_value;\n        Ok(())\n    }\n    \n    pub fn increment(ctx: Context<Increment>) -> Result<()> {\n        ctx.accounts.counter.value += 1;\n        Ok(())\n    }\n}\n\n#[derive(Accounts)]\npub struct Initialize<\'info> {\n    #[account(init, payer = user, space = 8 + 8)]\n    pub counter: Account<\'info, Counter>,\n    #[account(mut)]\n    pub user: Signer<\'info>,\n    pub system_program: Program<\'info, System>,\n}\n\n#[derive(Accounts)]\npub struct Increment<\'info> {\n    #[account(mut)]\n    pub counter: Account<\'info, Counter>,\n}\n\n#[account]\npub struct Counter {\n    pub value: u64,\n}\n\n// Cargo.toml\n[package]\nname = "counter"\nversion = "0.1.0"\ndescription = "Counter program"\nedition = "2021"\n\n[lib]\ncrate-type = ["cdylib", "lib"]\n\n[dependencies]\nanchor-lang = "0.28.0"',
        explanation:
          "This is a simple counter smart contract for Solana using the Anchor framework. It has two main functions:\n\n1. `initialize` - Creates a new counter with a starting value\n2. `increment` - Adds 1 to the counter's current value\n\nThe contract defines account structures for both operations and a Counter account that stores the actual value.",
        timestamp: new Date(),
      };

      console.log("Using fallback AI message due to API error");
    }

    if (chat.messages.length > 2) {
      const lastAiMessage = chat.messages.filter((m) => m.role === "ai").pop();

      if (lastAiMessage && aiMessage.code === lastAiMessage.code) {
        aiMessage.explanation =
          "Based on your request, the code remains the same as before. " +
          aiMessage.explanation;
      }
    }

    chat.messages.push(aiMessage);
    await chat.save();
    console.log(`Saved AI response to chat ${chatId}`);

    res.status(200).json({ message: aiMessage });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({
      message: "Error generating response",
      error: error.message || String(error),
    });
  }
}
