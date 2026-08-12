import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { LinkFields } from "@/components/LinkFields"
import type { LastPageConfig } from "@/lib/types"
import { Separator } from "@/components/ui/separator"

interface LastPageFormProps {
  config: LastPageConfig
  onChange: (patch: Partial<LastPageConfig>) => void
}

export function LastPageForm({ config, onChange }: LastPageFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Label htmlFor="lastpage-enabled">Добавить последнюю страницу</Label>
        <Switch
          id="lastpage-enabled"
          checked={config.enabled}
          onCheckedChange={(checked) => onChange({ enabled: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="lastpage-logo">Показывать логотип</Label>
        <Switch
          id="lastpage-logo"
          checked={config.showLogo}
          disabled={!config.enabled}
          onCheckedChange={(checked) => onChange({ showLogo: checked })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lastpage-left">Текст слева</Label>
        <Input
          id="lastpage-left"
          value={config.leftText}
          disabled={!config.enabled}
          onChange={(e) => onChange({ leftText: e.target.value })}
        />
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <Label htmlFor="lastpage-right">Текст справа</Label>
        <Input
          id="lastpage-right"
          value={config.rightText}
          disabled={!config.enabled}
          onChange={(e) => onChange({ rightText: e.target.value })}
        />
      </div>

      <LinkFields
        idPrefix="lastpage-right"
        disabled={!config.enabled}
        url={config.rightLinkUrl}
        utmSource={config.rightUtmSource}
        utmMedium={config.rightUtmMedium}
        onUrlChange={(value) => onChange({ rightLinkUrl: value })}
        onUtmSourceChange={(value) => onChange({ rightUtmSource: value })}
        onUtmMediumChange={(value) => onChange({ rightUtmMedium: value })}
      />
    </div>
  )
}
