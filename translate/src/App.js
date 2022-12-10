import './App.css';
import {
  Form,
  TextArea,
  Button,
  Icon,
  Label,
  Loader
} from 'semantic-ui-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


function App() {
  const [inputText, setInputText] = useState('');
  const [inputLanguage, setinputLanguage] = useState('en');
  const [outputLanguage, setoutputLanguage] = useState('en');
  const [outputText, setoutputText] = useState('');
  const [languages, setLanguages] = useState([])
  const [isTButtonDisabled, setDisabilityStatus] = useState(true);
  const [isLoading, setLoaderStatus] = useState(false);

  useEffect(() => {
    axios.get(`https://libretranslate.de/languages`)
            .then((response) => {
                let languagesList= [];
                response.data.map((element) => {
                  languagesList.push(element);
                })
              setLanguages(languagesList);
            })
  }, [])

  function encodeQuery()
  {
    let data = {
      'from':inputLanguage,
      'to':outputLanguage,
      'text':inputText
    };

    let query = ""
    for (let d in data)
         query += encodeURIComponent(d) + '=' 
                  + encodeURIComponent(data[d]) + '&'
    return query.slice(0, -1)
  }

  const getTranslatedText = async () =>{
    setLoaderStatus(true);
      let query = encodeQuery()
    query =  `http://165.22.191.215:3000/translate?`+ query;

    fetch(query,{  
        method: 'GET'
    })
    .then(async response => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
            // get error message from body or default to response statusText
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        setLoaderStatus(false);
        setoutputText(data.text)    
    })
    .catch(error => {
      // let errorObj = error.json();
      setoutputText(error);
      setLoaderStatus(false)
    });
  }

  return (
    <div className="App">
      <div className='app-container'>
        <div className='app-heading'>
          <div className='main-heading'>It Translates!</div>
          <div className='submain-heading'>Try it... Its pretty easy! </div>
        </div>
        <div className='app-body'>
          <div className='app-body-container'>
              <Form>
                <div className='spacer-div'>
                  <div className='prompt-style'>
                    <Label pointing='below'>Step 1. Please Select one Input Language.</Label>
                  </div>
                  <select className="input-language-select" onChange={(e) => {setinputLanguage(e.target.value); if ( e.target.value === outputLanguage || inputText=="") {setDisabilityStatus(true)} else {setDisabilityStatus(false)} }}>
                        {languages.map((language) => {
                                  return (
                                      <option value={language.code}>
                                          {language.name}
                                      </option>
                                  )
                              })}
                    </select>
                </div>
                <div className='spacer-div'>
                  <div className='prompt-style'>
                    <Label pointing='below'>Step 2. Please Enter The Text You Wish To Translate.</Label>
                  </div>
                  <Form.Field
                      control={TextArea}
                      placeholder='Type Text to Translate..'
                      onChange={(e) =>{ setInputText(e.target.value);  if (inputLanguage === outputLanguage || e.target.value ==="") {setDisabilityStatus(true)} else {setDisabilityStatus(false)} }}
                      className="spacer-div"
                  />
                </div>
                 
                
                  <div className='spacer-div'>
                    <div className='prompt-style'>
                      <Label pointing='below'>Step 3. Please Select Your Desired Output Langauge</Label>
                    </div>
                    <select className="output-language-select" onChange={(e) => {setoutputLanguage(e.target.value); if (inputLanguage === e.target.value || inputText=="") {setDisabilityStatus(true)} else {setDisabilityStatus(false)} }}>
                        {languages.map((language) => {
                                  return (
                                      <option value={language.code}>
                                          {language.name}
                                      </option>
                                  )
                              })}
                    </select>
                  </div> 
                  
                  <div className='spacer-div'>
                  <div>
                    <Label pointing='below'>Step 4.Get Your Results On This Click!</Label>
                  </div>
                    <Button
                        color="orange"
                        size="large"
                        onClick={getTranslatedText}
                        className="spacer-div"
                        disabled = { isTButtonDisabled }
                    >
                        <Icon name='translate' />
                        Translate</Button>

                  </div>
                  {
                    isLoading?  <div className='loader-style'><Loader active inline className='loading-text'>Translating...</Loader></div>: null
                  } 
                  <div className='spacer-div'>
                    <Form.Field
                        control={TextArea}
                        placeholder='Your Translation Result Will Go Here..'
                        value = {outputText}
                    >
                      <div class="ui active inline loader"></div>
                    </Form.Field>
                  </div>
              </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
