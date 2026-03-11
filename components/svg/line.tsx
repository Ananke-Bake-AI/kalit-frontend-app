interface LineProps {
  className?: string
  viewBox: string
  children: React.ReactNode
}

export const Line = ({ className, viewBox, children }: LineProps) => {
  return (
    <svg viewBox={viewBox} className={className}>
      {children}
    </svg>
  )
}
