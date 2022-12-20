import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
`
Write me an explantaion in detail by a professional developer for coding and tasks.

`

const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.8,
    max_tokens: 1250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();
   // I build Prompt #2.
   const secondPrompt = 
   `
   Explain in detail what the code means and offer an explanation regarding the task.

   Title: ${req.body.userInput}
 
   Example: ${basePromptOutput.text}
 
   Results:
   `
   
   // I call the OpenAI API a second time with Prompt #2
   const secondPromptCompletion = await openai.createCompletion({
     model: 'text-davinci-003',
     prompt: `${secondPrompt}`,
     // I set a higher temperature for this one. Up to you!
     temperature: 0.8,
     // I also increase max_tokens.
     max_tokens: 1250,
   });
   
   // Get the output
   const secondPromptOutput = secondPromptCompletion.data.choices.pop();
 
   // Send over the Prompt #2's output to our UI instead of Prompt #1's.
   res.status(200).json({ output: secondPromptOutput });
 };
 
 export default generateAction;

  
