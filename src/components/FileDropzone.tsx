import { useCallback, useRef, useState } from "react"
import { FileText, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileDropzoneProps {
  files: File[]
  onFilesChange: (files: File[]) => void
}

export function FileDropzone({ files, onFilesChange }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return
      const picked = Array.from(fileList).filter((f) => f.type === "application/pdf")
      if (picked.length === 0) return
      onFilesChange([...files, ...picked])
    },
    [files, onFilesChange],
  )

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-3">
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((f, i) => (
            <div key={`${f.name}-${f.size}-${i}`} className="flex items-center gap-3 rounded-lg border p-3">
              <FileText className="size-6 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{f.name}</p>
                <p className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(0)} КБ</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFile(i)}>
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragging ? "border-primary bg-accent" : "border-border",
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          addFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <Upload className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium">
          {files.length > 0 ? "Добавить ещё PDF" : "Перетащите PDF сюда или нажмите, чтобы выбрать"}
        </p>
        <p className="text-xs text-muted-foreground">Можно выбрать сразу несколько файлов</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ""
          }}
        />
      </div>
    </div>
  )
}
