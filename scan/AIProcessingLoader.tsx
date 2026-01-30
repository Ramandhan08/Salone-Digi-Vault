export function AIProcessingLoader({ label = "Processing with AI..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-blue-200" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
