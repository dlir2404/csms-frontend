import React from 'react'
import Image from 'next/image'

export default function PaymentMethod({
  thumbnail,
  name,
  onClick,
}: {
  thumbnail: string
  name: string
  onClick: () => void
}) {
  return (
    <div
      className="w-full my-4 cursor-pointer flex gap-4 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md"
      onClick={onClick}
    >
      <Image width={80} height={80} src={thumbnail} alt={'Mehthod thumbnail'}></Image>
      <div className="h-20 flex items-center text-lg">{name}</div>
    </div>
  )
}
