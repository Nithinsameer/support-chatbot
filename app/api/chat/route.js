import dotenv from 'dotenv';
import { NextResponse } from "next/server";
import OpenAI from 'openai';
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from '@pinecone-database/pinecone';
import { TextLoader } from "langchain/document_loaders/fs/text";

dotenv.config({ path: '.env.local' });

const systemprompt = `
You are an AI assistant representing Sameer, based on the information provided in his personal statement. Your role is to answer questions about Sameer's background, experiences, skills, and aspirations as accurately as possible. Use the following guidelines:

1. Provide information only based on the context given from Sameer's personal statement.
2. If asked about something not mentioned in the context, politely state that you don't have that information about Sameer.
3. Maintain a professional and friendly tone, similar to how Sameer would present himself.
4. Focus on Sameer's academic background, projects, internships, extracurricular activities, and future goals as described in the document.
5. If asked about opinions or preferences, base your responses on the interests and values Sameer expresses in his statement.
6. Do not invent or assume any information about Sameer that is not explicitly stated in the provided context.

Given the following context from Sameer's personal statement, please answer the user's question:

Context: {context}

User Question: {question}

Please provide a concise and helpful answer based on the given context and your general knowledge. Do not include any introductory phrases like "Based on the information provided" or "Sure, here's the answer". Start your response directly with the relevant information.

At the end of your response, add a new line and then add: "(Answered by {model})"
`;

const languageInstructions = {
  en: "Please respond in English.",
  fr: "Veuillez répondre en français.",
  de: "Bitte antworten Sie auf Deutsch. Unabhängig von der Sprache, in der der Benutzer antwortet, antworten Sie NUR auf Deutsch"
};

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

let vectorStore;
let fullDocument;

const groq = new OpenAI({ baseURL: "https://api.groq.com/openai/v1", apiKey: GROQ_API_KEY });
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function getVectorStore() {
  if (vectorStore) return vectorStore;

  console.log("Initializing vector store connection...");
  const pc = new Pinecone({
    apiKey: PINECONE_API_KEY,
  });
  const pineconeIndex = pc.index(PINECONE_INDEX_NAME);

  const embeddings = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY });
  vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: "production",
  });
  console.log("Vector store connection established.");

  return vectorStore;
}

async function getFullDocument() {
  if (fullDocument) return fullDocument;

  const loader = new TextLoader("./data/sameer_info.txt");
  const docs = await loader.load();
  fullDocument = docs[0].pageContent;
  return fullDocument;
}

async function determineQueryComplexity(query, relevantDocs) {
  const complexTerms = ['compare', 'analyze', 'explain in detail', 'pros and cons'];
  const isComplex = query.split('?').length > 2 || 
                    complexTerms.some(term => query.toLowerCase().includes(term)) ||
                    relevantDocs.join(' ').length < 100;
  return isComplex;
}

export async function POST(req) {
  try {
    const { messages, language } = await req.json();
    console.log("Received data:", { messageCount: messages.length, language });

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Invalid data format received: messages array is missing or empty");
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || typeof lastMessage.content !== 'string') {
      throw new Error("Invalid message format: last message is missing or has invalid content");
    }

    const userQuestion = lastMessage.content;
    console.log("Received user question:", userQuestion);

    const vectorStore = await getVectorStore();
    console.log("Performing similarity search...");
    const relevantDocs = await vectorStore.similaritySearch(userQuestion, 3);
    console.log("Relevant documents retrieved:", relevantDocs.length);

    const isComplexQuery = await determineQueryComplexity(userQuestion, relevantDocs.map(doc => doc.pageContent));
    
    let context;
    let llm;
    let model;
    let modelName;

    if (isComplexQuery) {
      context = await getFullDocument();
      llm = openai;
      model = "gpt-4o-mini";
      modelName = "GPT-4o";
      console.log("Using full document context and GPT-4 Turbo");
    } else {
      context = relevantDocs.map(doc => doc.pageContent).join('\n\n');
      llm = groq;
      model = "mixtral-8x7b-32768";
      modelName = "Mixtral-8x7B";
      console.log("Using relevant docs context and Groq Mixtral-8x7B");
    }

    const systemPrompt = `${systemprompt.replace("{context}", context).replace("{question}", userQuestion)}\n\n${languageInstructions[language] || languageInstructions.en}\n\nAt the end of your response, add a new line and then add: "(Answered by ${modelName})"`;
    console.log("System prompt:", systemPrompt);

    console.log(`Sending request to ${isComplexQuery ? 'OpenAI' : 'Groq'}...`);
    const completion = await llm.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text);
            }
          }
        } catch (err) {
          console.error("Error in stream processing:", err);
          controller.error(err);
        } finally {
          console.log("Stream completed.");
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


// export async function POST(req){
//     const data = await req.json()
//     const groq = createGroq({
//         baseURL: 'https://api.groq.com/openai/v1',
//         apiKey: process.env.GROQ_API_KEY,
//       });
      
//       const {text} = await generateText({
//         model: groq('llama-3.1-8b-instant'),
//         messages: [{role: "system", content: systemprompt }, ...data]
//       });
//     // console.log(text)
//     return NextResponse.json({message: text},{status: 200},)
//     // return stream.toDataStreamResponse();
// }

// export async function main(){
//     const groq = createGroq({
//         baseURL: 'https://api.groq.com/openai/v1',
//         apiKey: process.env.GROQ_API_KEY,
//       });

//     const result = await streamText({
//         model: groq('llama-3.1-8b-instant'),
//         prompt: "Tell me a very long science fact",
//     })

//     for await (const textPart of result.textStream){
//         process.stdout.write(textPart);
//     }
// }

// main().catch(console.error)