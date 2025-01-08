'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import React from 'react'

export const HeaderProgress = ({ isLoading }: { isLoading: boolean }) => {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    let intervalId: any
    if (isLoading) {
      intervalId = setInterval(() => {
        setPercent((prevPercent) => {
          if (prevPercent >= 90) {
            // Slow down progression after 90%
            clearInterval(intervalId)
            return 90
          }
          // Faster progression before 90%
          return prevPercent + 20
        })
      }, 200) // Faster interval
    } else {
      setPercent(100)
      setTimeout(() => setPercent(0), 300)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isLoading])

  if (percent === 0) return null

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div
        className="h-[3px] bg-blue-500 transition-all duration-300 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return (
    <>
      <HeaderProgress isLoading={isLoading} />
      {children}
    </>
  )
}
