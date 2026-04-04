"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FileSpreadsheet } from "lucide-react"
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'


export default function UploadDropzone() {
  const [uploading, setUploading] = useState(false)
  const router = useRouter()


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log("Accepted files:", acceptedFiles)  

    const file = acceptedFiles[0]
    if (!file) {
      alert("No file detected!")
      return
    }

    setUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/contacts/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errText = await res.text()
        alert("Upload failed: " + errText)
      } else {
        router.refresh()
      }
    } catch (error) {
      alert("Upload failed.")
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"], 
    },
  })

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
        ${isDragActive ? "border-yellow-400 bg-yellow-400/10" : "border-zinc-700"}
        ${uploading ? "opacity-70 cursor-not-allowed" : "hover:border-zinc-500"}
      `}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          <p className="text-xl font-medium">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <FileSpreadsheet className="w-16 h-16 text-zinc-500" />
          {isDragActive ? (
            <p className="text-2xl font-bold text-yellow-400">Drop your CSV here</p>
          ) : (
            <>
              <p className="text-2xl font-bold">Drop CSV here or click to upload</p>
              <p className="text-zinc-500">name,email,company</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}



