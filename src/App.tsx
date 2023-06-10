import { useState, useEffect } from "react";
import { Configuration, OpenAIApi } from "openai";
import * as readline from "readline";

import lens from "./assets/lens.png";
import loadingGif from "./assets/loadingSpinner.gif";
import "./App.css";

// Material UI Components
import Button from '@mui/material/Button';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  const [prompt, updatePrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    // Remove answer if no prompt or input is given
    if (prompt != null && prompt.trim() === "") {
      setAnswer('');
    }
  }, [prompt]);

  const sendPrompt = async (event:any) => {
    if (event.key !== "Enter") {
      return;
    }
  
    try {
      setLoading(true);

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      };
  
      const res = await fetch("/api/ask", requestOptions);
      
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
  
      const { message } = await res.json();
      setAnswer(message);
    } catch (err) {
      console.error(err, "err");

      setAnswer('And error ocurred fetching your answer.')
    } finally {
      setLoading(false);
    }

    console.log('prompt', prompt)
  }

  // ChatGTP 
  const configuration = new Configuration({
    organization: "org-qGT4eaYXkuu5cgDJtAv0rz8r",
    apiKey: "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",
  });

  const openai = new OpenAIApi(configuration);

  // userInterface.on("line", async (input) => {
  //   await openai
  //     .createChatCompletion({
  //       model: "gpt-3.5-turbo",
  //       messages: [{ role: "user", content: input }],
  //     })
  //     .then((res:any) => {
  //       console.log(res.data.choices[0].message.content);
  //       userInterface.prompt();
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // });



  //   userInterface.prompt();

  return (
    <div className="app">
      
      <div className="app-container">
        <div className="spotlight__wrapper">
          <div>

          </div>

          <input
            type="text"
            className="spotlight__input"
            placeholder="..."
            disabled={loading}
            style={{
              backgroundImage: loading ? `url(${loadingGif})` : `url(${lens})`,
            }}
            onChange={(e) => updatePrompt(e.target.value)}
            onKeyDown={(e) => sendPrompt(e)}
          />

          <Button>Enviar</Button>

          <div className="spotlight__answer">{answer && <p>{answer}</p>}</div>

        </div>
      </div>

    </div>
  );
}

export default App;