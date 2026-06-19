'use client'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

export default function ProgressBarProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ProgressBar
        height="5px"
        color="#C8E53A"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  )
}