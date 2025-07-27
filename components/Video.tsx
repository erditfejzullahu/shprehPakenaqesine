import React, { memo } from 'react'
import { ClassNameValue } from 'tailwind-merge'

const Video = ({src, className}: {src: string, className?: ClassNameValue | null}) => {
  return (
    <video aria-description='header icon' autoPlay controlsList={undefined} loop muted playsInline disablePictureInPicture disableRemotePlayback width="40" height="40" controls preload="none" className={`object-cover bg-white pointer-events-none select-none ${className}`}>
      <source src={src} type="video/mp4" />
    </video>
  )
}

export default memo(Video)