"use client"

import { useState, useEffect } from 'react'
import { useCallback } from 'react'
import {useDropzone} from 'react-dropzone'
import { FileSpreadsheet } from "lucide-react"


export default function UploadDropZoneTest(){
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback( async (acceptedFiles : File[]) => {
        const file = acceptedFiles[0];

        if (!file) return

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch('/api/contacts/upload', {
                method: 'POST',
                body: formData
            })
            if(!res.ok){
                const errText = await res.text()
                alert("Upload failed : " + errText);
            }
            else {
                window.location.reload();
            } }
            catch (error) {
                alert("Upload failed.")
              } finally {
                setUploading(false)
              }
            }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop})

    return(
        <div {...getRootProps()}
            className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                    ${isDragActive ? "border-yellow-400 bg-yellow-400/10" : "border-zinc-700"}
                    ${uploading ? "opacity-70 cursor-not-allowed" : "hover:border-zinc-500"}
            `}>
            <input {...getInputProps()} />

            {uploading ? (
                <div>
                    <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-yellow-400"></div>
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center">
                    <FileSpreadsheet className="h-16 w-16 text-gray-500 justify-center"/>
                    { isDragActive ? (
                        <p>Drop your csv here</p>
                    ) : (
                        <div>
                            <p>Drop csv here or click to upload</p>
                            <p>name, email, company</p>
                        </div>
                    )}
                </div>
            )}
        

        </div>
    )
} 