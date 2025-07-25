"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"

const ShowToasterInCaseFromPasswordReset = ({
  fromResetPassword
}: {
  fromResetPassword: boolean
}) => {
  const [showedOnce, setShowedOnce] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (fromResetPassword && !showedOnce) {
      setShowedOnce(true)
      const params = new URLSearchParams(searchParams.toString())
      params.delete("redirected")
      router.replace(`/profili`, { scroll: false })
      toast.warning("Ju jeni të kycur! Mund të ndyshoni të dhënat tuaj personale nga dritarja e Profilit")
    }
  }, [fromResetPassword, showedOnce, searchParams, router])

  return null
}

export default ShowToasterInCaseFromPasswordReset