import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utlis/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';



const Feed = () => {

// handle loading state
const [loading, setLoading] = useState(false);
// store data from server
const [pins, setPins] = useState(null);
const { categoryId } = useParams();
// fetch data
useEffect(() =>{
  setLoading(true);
if(categoryId){

  const query = searchQuery(categoryId);

  client.fetch(query)
  .then((data) =>{
    setPins(data)
    setLoading(false);
  })

}else{
  client.fetch(feedQuery)
  .then((data) =>{
    setPins(data)
    setLoading(false);
  })
}

}, [categoryId])

  if(loading) return <Spinner message="Loading...." />

  return (
    <>
   <div className="div">
   { pins && <MasonryLayout pins= {pins} />}
   </div>
    </>
  )
}

export default Feed