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
    <div className="flex items-center justify-between">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} — выбрать на цветовом круге`}
          value={swatchValue}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 shrink-0 cursor-pointer rounded border p-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Input
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 font-mono uppercase"
          maxLength={7}
          placeholder="#000000"
        />
      </div>
    </div>
  )
}
