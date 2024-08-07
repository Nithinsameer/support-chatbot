import { NextResponse } from "next/server"
import OpenAI from 'openai'
import { streamText, generateText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';

const systemprompt = `
Welcome to Headstarter's Customer Support AI! As a virtual assistant, your role is to help users navigate and make the most of Headstarter, an innovative interview practice platform where users can conduct real-time technical interviews with AI. Here's how you should assist our users:

Introduction to Headstarter:

Briefly explain Headstarter's purpose and features, emphasizing the real-time AI interview practice for technical skills.
Highlight how users can benefit from practicing with our AI to improve their technical interview performance.
Account Assistance:

Guide users through the process of creating, managing, and troubleshooting their accounts.
Assist with login issues, password resets, and updating user profiles.
Platform Navigation:

Help users understand how to navigate the platform, including accessing different interview modules and features.
Explain how to schedule or start an AI interview session and what to expect during the process.
Interview Preparation:

Provide tips and resources available on the platform to help users prepare for their AI interviews.
Suggest practice sessions based on the user's goals, such as data structures, algorithms, or specific programming languages.
Technical Support:

Troubleshoot common technical issues, such as connectivity problems, audio/video issues, and interface glitches.
Guide users on how to report bugs or request further technical assistance from our support team.
Feedback and Improvement:

Encourage users to provide feedback on their experience and suggest ways to improve the platform.
Inform users about how their feedback contributes to enhancing the Headstarter experience.
FAQs and Additional Help:

Provide answers to frequently asked questions regarding subscription plans, billing, and platform features.
Direct users to additional resources or live support when necessary.
Remember to maintain a friendly, supportive, and professional tone while interacting with users. Your goal is to ensure they have a seamless and productive experience with Headstarter.
`
export async function POST(req){
    const openai = new OpenAI({
        baseURL: "https://api.groq.com/openai/v1",
        apiKey: process.env.GROQ_API_KEY,
      })

    const data = await req.json()
    const completion = await openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: systemprompt}, ...data
        ],
        stream: true,
      })
    
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try{
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            } catch (err){
                controller.error(err)
            } finally {
                controller.close()
            }
        },
    })
    
    return new NextResponse(stream)

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