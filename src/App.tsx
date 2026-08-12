import { useState } from "react"
import { toast } from "sonner"
import { zipSync } from "fflate"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDropzone } from "@/components/FileDropzone"
import { ConfigPanel } from "@/components/ConfigPanel"
import { useConfigStore } from "@/store/useConfigStore"
import { applyHeaderFooter } from "@/lib/pdf"

function downloadBlob(bytes: Uint8Array, filename: string, mimeType: string) {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function dedupeName(usedNames: Set<string>, name: string) {
  if (!usedNames.has(name)) {
    usedNames.add(name)
    return name
  }
  const match = /^(.*?)(\.[^.]*)?$/.exec(name)
  const base = match?.[1] ?? name
  const ext = match?.[2] ?? ""
  let idx = 2
  let candidate = `${base} (${idx})${ext}`
  while (usedNames.has(candidate)) {
    idx += 1
    candidate = `${base} (${idx})${ext}`
  }
  usedNames.add(candidate)
  return candidate
}

function App() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const config = useConfigStore((s) => s.config)

  const canExport =
    files.length > 0 && (config.header.enabled || config.footer.enabled || config.lastPage.enabled)

  const handleExport = async () => {
    if (files.length === 0) return
    setIsProcessing(true)
    try {
      const results: { name: string; bytes: Uint8Array }[] = []
      const failedNames: string[] = []

      for (const file of files) {
        try {
          const bytes = await file.arrayBuffer()
          const result = await applyHeaderFooter(bytes, config)
          results.push({ name: file.name.replace(/\.pdf$/i, "") + "-edited.pdf", bytes: result })
        } catch (err) {
          console.error(err)
          failedNames.push(file.name)
        }
      }

      if (results.length === 0) {
        toast.error("Не удалось обработать ни один файл. Проверьте, что файлы не повреждены.")
        return
      }

      if (results.length === 1) {
        downloadBlob(results[0].bytes, results[0].name, "application/pdf")
      } else {
        const usedNames = new Set<string>()
        const zipEntries: Record<string, Uint8Array> = {}
        for (const { name, bytes } of results) {
          zipEntries[dedupeName(usedNames, name)] = bytes
        }
        downloadBlob(zipSync(zipEntries), "edited-pdfs.zip", "application/zip")
      }

      if (failedNames.length > 0) {
        toast.warning(`Готово, но не удалось обработать: ${failedNames.join(", ")}`)
      } else {
        toast.success(
          results.length === 1 ? "Готово! Файл скачан." : `Готово! Скачано файлов: ${results.length}.`,
        )
      }

      setFiles([])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-full flex-col gap-6 p-6">
      {/* <header>
        <h1 className="text-2xl font-semibold">PDF Header / Footer Editor</h1>
        <p className="text-sm text-muted-foreground">
          Добавьте header и footer в существующий PDF и скачайте результат. Всё обрабатывается локально в браузере.
        </p>
      </header> */}

      <div className="grid gap-6 md:grid-cols-[1fr_480px] md:items-start">
        <Card className="md:h-[calc(100svh-3rem)]">
          <CardHeader>
            <CardTitle>Файлы</CardTitle>
          </CardHeader>
          <CardContent className="h-full flex-1">
            <FileDropzone files={files} onFilesChange={setFiles} />
          </CardContent>
        </Card>

        <Card className="md:sticky md:top-6 md:h-[calc(100svh-3rem)]">
          <CardHeader>
            <CardTitle>Настройки</CardTitle>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 overflow-y-auto">
            <ConfigPanel />
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              className="w-full"
              disabled={!canExport || isProcessing}
              onClick={handleExport}
            >
              {isProcessing ? "Обработка..." : files.length > 1 ? "Скачать ZIP" : "Скачать PDF"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default App
