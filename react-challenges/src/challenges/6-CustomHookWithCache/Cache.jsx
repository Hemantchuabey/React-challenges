import React, { useEffect } from "react";
import { useFetch} from "./hooks/useFetch";

export default function Cache(){
    const {data,loading,error} = useFetch("https://jsonplaceholder.typicode.com/posts");

    if(loading) return <p>Loading...</p>
    if(error) return (<p>Error: {error}</p>)
console.log("Data : ", data)
    return (
        <div>
            <h2>Posts</h2>
            <ul>
                {data?.map((post) => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    )
}
