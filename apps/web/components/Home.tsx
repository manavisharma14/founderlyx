"use client"
import { useSession } from "next-auth/react"
import Image from "next/image"

export default function Home(){
    const { data :  session, status } = useSession();

    if(status === "authenticated"){
        const userEmail = session.user?.email;
        const userImage = session.user?.image;

        return (
            <div>
                <p>Signed in as {userEmail}</p>
                <Image src={userImage || "/default-image.png"} alt="user_image" height={50} width={50}/>
            </div>
        )
    }
    return(
        <p>not signed in</p>
    )

    
}