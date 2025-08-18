import React, { useCallback, useRef, useState } from "react";

function useDebounce(fn, delay){
    const timer = useRef(null)
    return useCallback((...args) => {
        if(timer.current){
            clearTimeout(timer.current)
        }
        timer.current = setTimeout(() => {
            fn(...args)
        }, delay);
    },[fn,delay])
}


export default function Autocomplete(){
    const [query,setQuery] = useState("")
    const [results,setResults] = useState([])
    const [activeIndex,setActiveIndex] = useState(0)
    const [fetchedProduct,setFetchedProduct] = useState(null)
    const cache = useRef(new Map())
    const abortController = useRef(null)

    const fetchSuggestions = useCallback(async(searchTerm) => {
        if(!searchTerm){
            setResults([])
            return
        }
        if(cache.current.has(searchTerm)){
            setResults(cache.current.get(searchTerm))
            return
        }
        if(abortController.current){
            abortController.current.abort()
        }
        abortController.current = new AbortController()
        try{
            const response = await fetch(`https://dummyjson.com/products/search?q=${searchTerm}`, {signal:abortController.current.signal})
            if(!response.ok){throw new Error("API Error")}
            const data = await response.json()
            cache.current.set(searchTerm,data.products)
            setResults(data.products)
            console.log("data.products : ",data.products)

        }catch(error){
            if(error.name !== "AbortError"){
                console.error("Error fetching suggestions:", error)
            }
        }
    },[])
    
    const debounceFetch = useDebounce(fetchSuggestions,500)

    const handleChange = (e) => {
        const value = e.target.value
        setQuery(value)
        debounceFetch(value)
    }

    const handleKeyDown  = (e) => {
        if(e.key === "ArrowDown"){
            setActiveIndex((prevIndex) => Math.min((prevIndex +  1), results.length - 1 ))
        }else if(e.key === "ArrowUp"){
            setActiveIndex((prevIndex) => Math.max((prevIndex - 1) , 0))
        }else if(e.key === "Enter" && activeIndex >= 0){
            setQuery(results[activeIndex].title)
            setResults([])
        }
    }

    return(<div>
        <input type="text" name="searchProduct" id="searchProduct" 
        value={query}
        onChange={handleChange} 
        onKeyDown={handleKeyDown}
        placeholder="Search for a product..."
        style={{width:"25vw",padding:"8px",}}
        />
        {results.length > 0 && (
            <ul>
                {
                    results.map((result,index) => (
                        <li key={result.id} style={{cursor:"pointer",padding:"8px",borderBottom:"1px solid #eee" , backgroundColor: index === activeIndex ? "rgba(0 ,0, 100,0.8)" : ""}} onClick={() => {
                            setQuery("")
                            setFetchedProduct(result)
                            setResults([])
                        }}>{result.title}</li>
                    ))
                }
            </ul>
        )}
        {fetchedProduct && (
            <div style={{width: "25vw",height:"auto", border : "1px solid #eee" , padding:"5px",marginTop:"20px" }}> 
                <p><b>{fetchedProduct.title}</b></p>
                <img src={fetchedProduct.images[0]} alt={fetchedProduct.title} style={{width:"25%",height:"25%"}} />
                <p>{fetchedProduct.description}</p>
                <p>Price: ${fetchedProduct.price}</p>
            </div>
        )}
    </div>)
}