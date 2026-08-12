import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { LinkFields } from "@/components/LinkFields"
import { PaddingFields } from "@/components/PaddingFields"
import { ColorField } from "@/components/ColorField"
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

      <div className="flex items-center justify-between">
        <Label htmlFor={`${idPrefix}-logo`}>Логотип</Label>
        <Switch
          id={`${idPrefix}-logo`}
          checked={region.showLogo}
          disabled={!region.enabled}
          onCheckedChange={(checked) => onChange({ showLogo: checked })}
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

      <div className="flex flex-col gap-6 pb-2">
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

            <ColorField
              id={`${idPrefix}-color`}
              label="Цвет текста"
              value={region.color}
              disabled={!region.enabled}
              onChange={(value) => onChange({ color: value })}
            />
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

            <ColorField
              id={`${idPrefix}-container-bg`}
              label="Цвет фона"
              value={region.containerBackground}
              disabled={!region.enabled || !region.containerEnabled}
              onChange={(value) => onChange({ containerBackground: value })}
            />

            <ColorField
              id={`${idPrefix}-container-border`}
              label="Цвет рамки"
              value={region.containerBorderColor}
              disabled={!region.enabled || !region.containerEnabled}
              onChange={(value) => onChange({ containerBorderColor: value })}
            />

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

            <div className="flex flex-col gap-3">
              <Label>Отступы</Label>
              <PaddingFields
                idPrefix={`${idPrefix}-container-padding`}
                disabled={!region.enabled || !region.containerEnabled}
                top={region.containerPaddingTop}
                right={region.containerPaddingRight}
                bottom={region.containerPaddingBottom}
                left={region.containerPaddingLeft}
                onChange={(patch) =>
                  onChange({
                    ...(patch.top !== undefined && { containerPaddingTop: patch.top }),
                    ...(patch.right !== undefined && { containerPaddingRight: patch.right }),
                    ...(patch.bottom !== undefined && { containerPaddingBottom: patch.bottom }),
                    ...(patch.left !== undefined && { containerPaddingLeft: patch.left }),
                  })
                }
              />
            </div>
          </div>
    </div>
  )
}
