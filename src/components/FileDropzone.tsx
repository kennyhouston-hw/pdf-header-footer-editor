import { useCallback, useRef, useState } from "react"
import { FileText, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FilePreview } from "@/components/FilePreview"
import { cn } from "@/lib/utils"

export type FileMode = "single" | "multiple"

interface FileDropzoneProps {
  mode: FileMode
  onModeChange: (mode: FileMode) => void
  singleFile: File | null
  onSingleFileChange: (file: File | null) => void
  multipleFiles: File[]
  onMultipleFilesChange: (files: File[]) => void
}

export function FileDropzone({
  mode,
  onModeChange,
  singleFile,
  onSingleFileChange,
  multipleFiles,
  onMultipleFilesChange,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const files = mode === "single" ? (singleFile ? [singleFile] : []) : multipleFiles

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return
      const picked = Array.from(fileList).filter((f) => f.type === "application/pdf")
      if (picked.length === 0) return
      if (mode === "single") {
        onSingleFileChange(picked[0])
      } else {
        onMultipleFilesChange([...multipleFiles, ...picked])
      }
    },
    [mode, multipleFiles, onSingleFileChange, onMultipleFilesChange],
  )

  const removeFile = (index: number) => {
    if (mode === "single") {
      onSingleFileChange(null)
    } else {
      onMultipleFilesChange(multipleFiles.filter((_, i) => i !== index))
    }
  }

  const showDropzone = mode === "multiple" || files.length === 0

  return (
    <div className="flex flex-col gap-3 md:h-full">
      <div className="flex items-center justify-between">
        <span className="text-base font-medium">Файлы</span>
      <Tabs value={mode} onValueChange={(value) => onModeChange(value as FileMode)}>
        <TabsList>
          <TabsTrigger value="single" className="px-3">Один файл</TabsTrigger>
          <TabsTrigger value="multiple" className="px-3">Несколько файлов</TabsTrigger>
        </TabsList>
      </Tabs>
      </div>

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

      {showDropzone && (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors md:h-full",
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
            {mode === "multiple" && files.length > 0
              ? "Добавить ещё PDF"
              : "Перетащите PDF сюда или нажмите, чтобы выбрать"}
          </p>
          <p className="text-xs text-muted-foreground">
            {mode === "multiple" ? "Можно выбрать сразу несколько файлов" : "Только один файл"}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple={mode === "multiple"}
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files)
              e.target.value = ""
            }}
          />
        </div>
      )}

      {!showDropzone && singleFile && <FilePreview file={singleFile} />}
    </div>
  )
}
