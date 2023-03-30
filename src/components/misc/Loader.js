import { useEffect, useState, useRef } from "react";

const Loader = (props) => {

  const [animation, setAnimation] = useState();
  const loader = useRef()

  useEffect(() => {
    if(loader?.current?.clientWidth < loader?.current?.parentElement?.clientWidth){
      progress();
    }
  }, [loader])

  function progress(){
    let widthCSS = loader.current.style.width || "0px";
    let width = Number(widthCSS.substring(0, widthCSS.length - 2))
    if(width < (loader?.current?.parentElement?.clientWidth - 100)){
      const delay = Math.random() * (500 - 300) + 300;
      setTimeout(() => {
        if(loader?.current){
          const addition = Math.random() * (100 - 5) + 5;
          const newWidth = width + addition;
          loader.current.style.width = `${newWidth}px`;
          progress();
        }
      }, delay)
    }
  }
  
  return (
    <div className="loaderContainer">
      <div ref={loader} className="loader"></div>
    </div>
  )

}

export default Loader;
