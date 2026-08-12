import { useEffect, useRef, useState } from "react"
import { useConfigStore } from "@/store/useConfigStore"
import { applyHeaderFooter } from "@/lib/pdf"

interface FilePreviewProps {
  file: File
}

const DEBOUNCE_MS = 400

export function FilePreview({ file }: FilePreviewProps) {
  const config = useConfigStore((s) => s.config)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const urlRef = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    const timer = setTimeout(async () => {
      try {
        const bytes = await file.arrayBuffer()
        const result = await applyHeaderFooter(bytes, config)
        if (cancelled) return
        const blob = new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" })
        const url = URL.createObjectURL(blob)
        if (urlRef.current) URL.revokeObjectURL(urlRef.current)
        urlRef.current = url
        setPreviewUrl(url)
        setError(null)
      } catch (err) {
        if (!cancelled) {
          console.error(err)
          setError("Не удалось построить предпросмотр. Проверьте, что файл не повреждён.")
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [file, config])

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    }
  }, [])

  return (
    <div className="relative min-h-[400px] flex-1 overflow-hidden rounded-lg border md:min-h-0">
      {previewUrl && <iframe src={previewUrl} title="Предпросмотр PDF" className="h-full w-full" />}

      {!error && (isLoading || !previewUrl) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 text-sm text-muted-foreground">
          Строим предпросмотр…
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 p-4 text-center text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  )
}
