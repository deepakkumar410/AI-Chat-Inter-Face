import { useEffect, useRef, useState } from 'react';
import './App.css';
import { URL } from './constants';
import RecentSearch from './components/RecentSearch';
import QuestionAnswer from './components/QuestionAnswer';
import { MdDarkMode, MdLightMode, MdSend } from 'react-icons/md';
import { PiNotePencilBold } from 'react-icons/pi';

function App() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(JSON.parse(localStorage.getItem('history')));
  const [selectedHistory, setSelectedHistory] = useState('');
  const [loader, setLoader] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [clearData, setClearData] = useState(false);
  const scrollToAns = useRef();

  const askQuestion = async () => {
    if (!question && !selectedHistory) return;

    try {
      setLoader(true);

      if (question) {
        let history = JSON.parse(localStorage.getItem('history')) || [];
        history = [question, ...history];
        localStorage.setItem('history', JSON.stringify(history));
        setRecentHistory(history);
      }

      const payloadData = question || selectedHistory;
      const payload = {
        contents: [{ parts: [{ text: payloadData }] }],
      };

      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      let dataString = responseData.candidates[0].content.parts[0].text;
      dataString = dataString.split('* ').map((item) => item.trim());

      setResult((prev) => [
        ...prev,
        { type: 'q', text: payloadData },
        { type: 'a', text: dataString },
      ]);

      setQuestion('');

      setTimeout(() => {
        scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
      }, 500);
    } catch (error) {
      console.error('Error fetching answer:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoader(false);
    }
  };


  const isEnter = (event) => {
    if (event.key === 'Enter') askQuestion();
  };

  useEffect(() => {
    if (selectedHistory) askQuestion();
  }, [selectedHistory]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (clearData) {
      window.location.reload();
    }
  }, [clearData]);

  return (
    <>
      <div className={darkMode ? 'dark' : 'light'}>
        <div className="flex  w-full text-center">

          <div className="flex top-3  absolute z-40 h-18 ">
            <RecentSearch
              darkMode={darkMode}
              recentHistory={recentHistory}
              setRecentHistory={setRecentHistory}
              setSelectedHistory={setSelectedHistory}
            />


            <div className="relative  group top-2">
              <button
                onClick={() => setClearData(true)}
                className={` ${darkMode ? "text-white" : "text-black"}  py-2 transition cursor-pointer`}
              >
                <PiNotePencilBold size={25} />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full  hidden group-hover:block bg-black text-white text-sm px-2 py-1 rounded whitespace-nowrap z-10">
                New Chat
              </div>
            </div>
          </div>


          <div className="flex flex-col flex-1 h-[80vh] w-full relative px-2 sm:px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-[500] mt-6  max-[700px]:mt-18 bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700 mb-4">
              Welcome! How can I assist you today ?
            </h1>


            {loader && (
              <div role="status" className="flex justify-center h-50 items-center mb-4">
                <img className='h-[100px] ' src="https://d3lzcn6mbbadaf.cloudfront.net/static/img/search-loader.gif" alt="" />
                <span className="sr-only">Loading...</span>
              </div>
            )}


            <div
              ref={scrollToAns}
              className="flex-1 overflow-auto scroll-smooth scroll-hide dark:text-zinc-300 text-zinc-800"
            >
              <ul>
                {result.map((item, index) => (
                  <QuestionAnswer key={index} item={item} index={index} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`${darkMode ? 'bg-[#ffffff33]' : 'bg-[#000000b5]'
          }  py-2 px-4 mt-4 rounded-xl cursor-pointer absolute  flex text-white top-2 right-5 z-10`}
      >
        {darkMode ? <MdDarkMode size={25} /> : <MdLightMode size={25} />}
      </button>
      <div className="  absolute bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 sm:w-4/5 md:w-3/8 rounded-2xl border border-zinc-700 flex items-center h-14 px-2 dark:bg-zinc-800 bg-white dark:text-white text-gray-800">
        <input
          type="text"
          value={question}
          onKeyDown={isEnter}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full h-full p-3 outline-none font-[400]"
          placeholder="Ask anything . . ."
        />
        <button onClick={askQuestion}>
          <MdSend size={25} />
        </button>
      </div>
    </>
  );
}

export default App;
