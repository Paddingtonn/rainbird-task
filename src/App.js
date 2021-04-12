import { useState, useEffect } from 'react';

import './App.css';

const App = () => {

  const [question, setQuestion] = useState(false);
  const [concepts, setConcepts] = useState(false);
  const [userAnswer, setUserAnswer] = useState(false);
  const [result, setResult] = useState(false);

  useEffect(() => {
    (async() => {
      try {
        const session = await fetch(
          'https://api.rainbird.ai/start/bfaab567-6494-4dd3-bbdb-0915a32da0f7',
          {
          method: 'GET',
          headers: {
            Authorization: 'Basic ' + btoa('8490c85c-ec0f-4dfc-94c6-827ee273d3c8:n')
            }
          }
        );

        const getSession = await session.json();

        if(getSession) {

        const resp = await fetch(
          `https://api.rainbird.ai/${getSession.id}/query`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              subject: 'Fred',
              relationship: 'speaks'
            })
          }
        );
        
        const data = await resp.json();
        setConcepts(data.question.concepts);
        setQuestion(data.question.prompt);
        
        if(resp.ok && userAnswer) {
          const answer = await fetch(
            `https://api.rainbird.ai/${getSession.id}/response`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                answers: [
                  {
                    subject: 'Fred',
                    relationship: 'lives in',
                    object: userAnswer,
                    certainty: 100
                  }
                ]
              })
            }
          );
          
          const getAnswer = await answer.json();
          const {subject, object, relationship, certainty} = getAnswer.result[0];
          setResult(`${subject} ${relationship} ${object} (${certainty}% certainty)`);
          }
        }
      } catch(err) {
        console.log(err);
      }
    })();
    
  }, [userAnswer]);

  return (
    <>
      {question && <div>{question}</div>}
      {concepts && (
        concepts.map(el => {
          return (
            <button 
              value={el.value} 
              onClick={({target}) => setUserAnswer(target.value)}
              >
                {el.value}
            </button>
          )
        })
      )}
      {result && (
        <p>{result}</p>
      )}
    </>
  );
}

export default App;
