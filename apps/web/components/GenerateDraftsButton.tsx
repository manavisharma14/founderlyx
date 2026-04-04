"use client"
import { Button } from '@/components/ui/button'
import { useState } from 'react'
export default function GenerateDraftsButton({userId} : {userId: string}){
  const id = userId;
  if(!id){
    throw new Error("no user")
  }
  const [generating, setGenerating] = useState(false);

  const onSubmit = async () => {

    setGenerating(true);
    try{
      const res = await fetch('/api/drafts/generate', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({ userId })
      })
      
      if (!res.ok) throw new Error("API error")
      if(res.ok){
        alert("Magic complete! Refreshing...")
      }
    } catch(err){
      console.log(err)
    } finally{
      setGenerating(false);
    }
  }

  return(
    <div>
      <Button onClick={() => onSubmit()} 
       className={`px-6 py-3 text-sm ${
        generating
          ? "bg-zinc-200 text-zinc-500"
          : "bg-yellow-400 text-black hover:bg-yellow-300"
      }`}
      >
        {generating ? "Writing emails (30–90s)" : "Generate Drafts"}
      </Button>
    </div>
  )
}