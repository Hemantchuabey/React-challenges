import React, { useEffect, useMemo, useRef, useState } from "react";

const api = (() => {
  // Simulating a large dataset with 100,000 items and represent total number of items available in the mock database
  const total = 100000;

  // function to help to create a product object given id, title and price
  const make = (id) => ({
    id,
    title: `Product -> ${id}`,
    price: (id % 97) + 1,
  });

// async function to simulate fetching a page of products 
  async function fetchPage(page, pageSize) {
    // simulating network latency by waiting for 100ms before returning data
    await new Promise((resolve) => setTimeout(resolve, 100));
    // calculating the starting index for the requested page
    const start = page * pageSize;
    // calculating the ending index, ensuring it does not exceed the total
    const end = Math.min(start + pageSize, total);

    // Generate an array of product objects for the requested page
    // the array length is the number of items in the page (could be less than the pageSize at the end)
    // Each product id starts from start + 1 up to the end
    const items = Array.from({ length: Math.max(0, end - start) }, (_, i) =>
      make(start + i + 1)
    );
    // return the fetched items and the total count
    return { items, total: total };
  }
  // return an object with the fetchPage function
  return { fetchPage };
})();

export default function VirtualizedInfiniteScroll() {
  const Item_Height = 72
  const Page_Size = 50 

  const scrollerRef = useRef(null)
  const [items,setItems] = useState([])
  const [page,setPage] = useState(0)
  const [loading,setLoading] = useState(false)
  const [hasMore,setHasMore] = useState(true)

  const [scrollTop,setScrollTop] = useState(0)
  const [viewPortHeight,setViewPortHeight] = useState(600)
  const rafRef = useRef(null)

  useEffect(() => {loadMore()},[])

  async function loadMore(){
    // if loading or load is already in progress or no more items to load, return early
    if(loading  || !hasMore)return
    // set loading state to true to prevent multiple concurrent loads
    setLoading(true)
    // fetch the next page of items
    const res = await api.fetchPage(page,Page_Size)
    // update the items state with the newly fetched items
    // append the new items to the existing items
    setItems(prev => [...prev, ...res.items])
    // update the page number and hasMore state
    setPage(prev => prev + 1)
    // Update hasMore : only when if the last fetched returned a full page of items (means more items may exist)
    setHasMore(prev => prev && res.items.length === Page_Size)
    // Mark loading as finished
    setLoading(false)
  }


useEffect(() => {
  // get reference to the scrollable container dom element 
  const el = scrollerRef.current 
  // if the element is not found, return early
  if(!el) return
  // define scroll event handler 
  const onScroll = () => {
    // if previous animation frame is progress or scheduled, cancel it to avoid duplication of update
    if(rafRef.current)cancelAnimationFrame(rafRef.current)

      // schedule an update to the scrolle top using requestAnimationFrame for smooth UI performance
      
    rafRef.current = requestAnimationFrame(() => {
      setScrollTop(el.scrollTop)
    })
  }

  // define resize event handler
  const onResize = () => {
    setViewPortHeight(el.clientHeight) //update viewport height with the container current height
  }
  // call onResize once to initialize the viewport height when the component mounts
  onResize()
  // attach the scroll event listener to the scrollable container
  el.addEventListener('scroll',onScroll,{passive :true})
// attach the resize event listener to the window object to handle browser resizing
  window.addEventListener("resize",onResize)
  // clean up function remove event listeners and cancel animation frame
  return () => {
    el.removeEventListener('scroll',onScroll)
    window.removeEventListener("resize",onResize)
    if(rafRef.current)cancelAnimationFrame(rafRef.current)
  }
}, [])

const overScan = 0 
const {startIndex,endIndex,offSetY,totalHeightY} = useMemo(() => {
  const first =  Math.floor(scrollTop  / Item_Height)
  const visibleCount = Math.ceil(viewPortHeight/Item_Height)
  const start = Math.max(0,first - overScan)
  const end = Math.min(items.length -1 ,first + visibleCount + overScan)
  const offSet = start * Item_Height

  return{
    startIndex : start,
    endIndex :end,
    offSetY : offSet,
    totalHeight: items.length * Item_Height
  }

},[scrollTop,viewPortHeight,items.length])

  return <div>Virtualized Infinite Scroll Component</div>;
}
