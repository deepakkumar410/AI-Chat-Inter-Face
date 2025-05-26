import Answer from './Answers';
const QuestionAnswer=({item,index})=>{
    return(
        <>
            <div key={index + Math.random()} className={`${item.type == 'q' ? 'flex justify-end' : ''}  `}>
                    {
                      item.type == 'q' ?
                        <li key={index + Math.random()}
                          className='text-right p-1  flex  dark:bg-zinc-700 b dark:border-zinc-700 bg-zinc-300 px-4 py-2   rounded-tl-3xl rounded-br-3xl rounded-bl-3xl w-fit
                   '
                        ><Answer  ans={item.text} totalResult={1} index={index} type={item.type} /></li>
                        : item.text.map((ansItem, ansIndex) => (
                          <li key={ansIndex + Math.random()} className='text-left   p-1  mt-2 mb-2 rounded-2xl  '><Answer ans={ansItem} totalResult={item.length} type={item.type} index={ansIndex} /></li>

                        ))
                    }
                  </div>
        </>
    )
}

export default QuestionAnswer;