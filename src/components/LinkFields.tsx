import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { buildLinkUrl } from "@/lib/url"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"

interface LinkFieldsProps {
  idPrefix: string
  disabled?: boolean
  url: string
  utmSource: string
  utmMedium: string
  onUrlChange: (value: string) => void
  onUtmSourceChange: (value: string) => void
  onUtmMediumChange: (value: string) => void
}

export function LinkFields({
  idPrefix,
  disabled,
  url,
  utmSource,
  utmMedium,
  onUrlChange,
  onUtmSourceChange,
  onUtmMediumChange,
}: LinkFieldsProps) {
  const finalUrl = buildLinkUrl(url, utmSource, utmMedium)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4">
        <Label htmlFor={`${idPrefix}-link-url`}>Ссылка</Label>
        <Input
          id={`${idPrefix}-link-url`}
          value={url}
          disabled={disabled}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://hwschool.online/"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          <InputGroup>
          <InputGroupAddon className="text-xs">
            utm_source
          </InputGroupAddon>
          <InputGroupInput
            id={`${idPrefix}-utm-source`}
            value={utmSource}
            disabled={disabled}
            onChange={(e) => onUtmSourceChange(e.target.value)}
            placeholder="pdf"
          />
          </InputGroup>
        </div>
        <div className="flex flex-col gap-2">
          <InputGroup>
          <InputGroupAddon className="text-xs">
            utm_medium
          </InputGroupAddon>
          <InputGroupInput
            id={`${idPrefix}-utm-medium`}
            value={utmMedium}
            disabled={disabled}
            onChange={(e) => onUtmMediumChange(e.target.value)}
            placeholder="footer"
          />
          </InputGroup>
        </div>
      </div>

      {finalUrl && <p className="truncate text-xs text-muted-foreground mt-1">{finalUrl}</p>}
    </div>
  )
}
