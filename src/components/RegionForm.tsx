import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { LinkFields } from "@/components/LinkFields"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { RegionConfig } from "@/lib/types"

const alignLabels: Record<RegionConfig["align"], string> = {
  left: "Слева",
  center: "По центру",
  right: "Справа",
}

interface RegionFormProps {
  region: RegionConfig
  onChange: (patch: Partial<RegionConfig>) => void
  idPrefix: string
}

export function RegionForm({ region, onChange, idPrefix }: RegionFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 justify-between w-full items-center">
          <ToggleGroup
            value={[region.align]}
            disabled={!region.enabled}
            onValueChange={(value) => {
              const next = value[0] as RegionConfig["align"] | undefined
              if (next) onChange({ align: next })
            }}
          >
            <ToggleGroupItem value="left" aria-label={alignLabels.left}>
              <AlignLeft />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label={alignLabels.center}>
              <AlignCenter />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label={alignLabels.right}>
              <AlignRight />
            </ToggleGroupItem>
          </ToggleGroup>
          <Switch
            id={`${idPrefix}-enabled`}
            checked={region.enabled}
            onCheckedChange={(checked) => onChange({ enabled: checked })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-text`}>Текст</Label>
        <Input
          id={`${idPrefix}-text`}
          value={region.text}
          disabled={!region.enabled}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Например: ООО «Компания» — конфиденциально"
        />
      </div>
      <Separator />
      <LinkFields
        idPrefix={idPrefix}
        disabled={!region.enabled}
        url={region.linkUrl}
        utmSource={region.utmSource}
        utmMedium={region.utmMedium}
        onUrlChange={(value) => onChange({ linkUrl: value })}
        onUtmSourceChange={(value) => onChange({ utmSource: value })}
        onUtmMediumChange={(value) => onChange({ utmMedium: value })}
      />

      <Separator />
      <Collapsible>
        <CollapsibleTrigger>Дополнительные настройки</CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-5 pt-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${idPrefix}-fontsize`}>Размер шрифта</Label>
                <span className="text-sm text-muted-foreground">{region.fontSize}pt</span>
              </div>
              <Slider
                id={`${idPrefix}-fontsize`}
                value={[region.fontSize]}
                min={6}
                max={24}
                step={1}
                disabled={!region.enabled}
                onValueChange={(val) => onChange({ fontSize: Array.isArray(val) ? val[0] : val })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${idPrefix}-margin`}>Отступ от края</Label>
                <span className="text-sm text-muted-foreground">{region.marginPt}pt</span>
              </div>
              <Slider
                id={`${idPrefix}-margin`}
                value={[region.marginPt]}
                min={10}
                max={72}
                step={1}
                disabled={!region.enabled}
                onValueChange={(val) => onChange({ marginPt: Array.isArray(val) ? val[0] : val })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor={`${idPrefix}-color`}>Цвет текста</Label>
              <input
                id={`${idPrefix}-color`}
                type="color"
                value={region.color}
                disabled={!region.enabled}
                onChange={(e) => onChange({ color: e.target.value })}
                className="h-8 w-14 cursor-pointer rounded border disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor={`${idPrefix}-container`}>Контейнер</Label>
              <Switch
                id={`${idPrefix}-container`}
                checked={region.containerEnabled}
                disabled={!region.enabled}
                onCheckedChange={(checked) => onChange({ containerEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor={`${idPrefix}-container-bg`}>Цвет фона</Label>
              <input
                id={`${idPrefix}-container-bg`}
                type="color"
                value={region.containerBackground}
                disabled={!region.enabled || !region.containerEnabled}
                onChange={(e) => onChange({ containerBackground: e.target.value })}
                className="h-8 w-14 cursor-pointer rounded border disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor={`${idPrefix}-container-border`}>Цвет рамки</Label>
              <input
                id={`${idPrefix}-container-border`}
                type="color"
                value={region.containerBorderColor}
                disabled={!region.enabled || !region.containerEnabled}
                onChange={(e) => onChange({ containerBorderColor: e.target.value })}
                className="h-8 w-14 cursor-pointer rounded border disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${idPrefix}-container-border-width`}>Толщина рамки</Label>
                <span className="text-sm text-muted-foreground">{region.containerBorderWidth}pt</span>
              </div>
              <Slider
                id={`${idPrefix}-container-border-width`}
                value={[region.containerBorderWidth]}
                min={0}
                max={4}
                step={0.5}
                disabled={!region.enabled || !region.containerEnabled}
                onValueChange={(val) =>
                  onChange({ containerBorderWidth: Array.isArray(val) ? val[0] : val })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${idPrefix}-container-radius`}>Радиус скругления</Label>
                <span className="text-sm text-muted-foreground">{region.containerBorderRadius}pt</span>
              </div>
              <Slider
                id={`${idPrefix}-container-radius`}
                value={[region.containerBorderRadius]}
                min={0}
                max={20}
                step={1}
                disabled={!region.enabled || !region.containerEnabled}
                onValueChange={(val) =>
                  onChange({ containerBorderRadius: Array.isArray(val) ? val[0] : val })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${idPrefix}-container-padding`}>Внутренний отступ</Label>
                <span className="text-sm text-muted-foreground">{region.containerPaddingPt}pt</span>
              </div>
              <Slider
                id={`${idPrefix}-container-padding`}
                value={[region.containerPaddingPt]}
                min={0}
                max={20}
                step={1}
                disabled={!region.enabled || !region.containerEnabled}
                onValueChange={(val) =>
                  onChange({ containerPaddingPt: Array.isArray(val) ? val[0] : val })
                }
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
