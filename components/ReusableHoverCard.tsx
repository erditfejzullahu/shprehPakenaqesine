import * as React from "react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface HoverCardProps {
  trigger: React.ReactNode
  content: React.ReactNode
  align?: "center" | "start" | "end"
  sideOffset?: number
  className?: string
  contentClassName?: string
  openDelay?: number
  closeDelay?: number
}

const ReusableHoverCard = ({
  trigger,
  content,
  align = "center",
  sideOffset = 4,
  className = "",
  contentClassName = "",
  openDelay = 200,
  closeDelay = 200,
}: HoverCardProps) => {
  return (
    <HoverCard openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild className={className}>
        {trigger}
      </HoverCardTrigger>
      <HoverCardContent
        align={align}
        sideOffset={sideOffset}
        className={contentClassName}
      >
        {content}
      </HoverCardContent>
    </HoverCard>
  )
}

export { ReusableHoverCard }