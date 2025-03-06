'use client'
import { useAuth, useUser } from "@clerk/clerk-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function Ask() {

  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const { user } = useUser();
  console.log(user?.publicMetadata.preference);
  const preference = user?.publicMetadata.preference;

  useEffect(() => {
    if(isLoaded && !userId){
      router.push("/sign-in");
    }
    if(!user?.publicMetadata.formSubmitted){
      router.push("/questionnaire");
      alert("Please fill out the questionnaire first");
    }
    if(isLoaded && userId && user?.publicMetadata.preference){
      router.push(`/${preference}`);
    } 
  }, [userId, isLoaded,router, preference, user]);

  return (
    <div>
      
    </div>
  )
}

export default Ask
