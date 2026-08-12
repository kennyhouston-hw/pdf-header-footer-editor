import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ColorFieldProps {
  id: string
  label: string
  value: string
  disabled?: boolean
  onChange: (value: string) => void
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/

export function ColorField({ id, label, value, disabled, onChange }: ColorFieldProps) {
  const swatchValue = HEX_RE.test(value) ? value : "#000000"

  return (
    <div className="flex flex-col items-start justify-between gap-2 w-full">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <div className="flex items-center">
        <div className="h-8 w-8 flex items-center justify-center pl-1 rounded-l-lg  border-input border-r-0 bg-input/30 dark:bg-input/30 has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:bg-input/50 has-disabled:opacity-50 dark:has-disabled:bg-input/80">
        <input
          type="color"
          aria-label={`${label} — выбрать на цветовом круге`}
          value={swatchValue}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-6 shrink-0 cursor-pointer disabled:cursor-not-allowed"
        />
        </div>
        <Input
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full font-mono uppercase pl-2 rounded-l-none border-l-0"
          maxLength={7}
          placeholder="#000000"
        />
      </div>
    </div>
  )
}
