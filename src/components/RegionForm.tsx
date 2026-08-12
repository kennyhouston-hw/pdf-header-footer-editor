import { AlignCenterVertical, AlignEndVertical, AlignStartVertical } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { LinkFields } from "@/components/LinkFields"
import { PaddingFields } from "@/components/PaddingFields"
import { ColorField } from "@/components/ColorField"
import type { RegionConfig } from "@/lib/types"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"

const alignLabels: Record<RegionConfig["align"], string> = {
  left: "Слева",
  center: "По центру",
  right: "Справа",
}

interface RegionFormProps {
  region: RegionConfig
  onChange: (patch: Partial<RegionConfig>) => void
  idPrefix: string
  enabledLabel: string
}

export function RegionForm({ region, onChange, idPrefix, enabledLabel }: RegionFormProps) {
  return (
    <div className="flex flex-col gap-5 px-4">
      <div className="flex items-center justify-between">
        <Label htmlFor={`${idPrefix}-enabled`}>{enabledLabel}</Label>
        <Switch
          id={`${idPrefix}-enabled`}
          checked={region.enabled}
          onCheckedChange={(checked) => onChange({ enabled: checked })}
        />
      </div>

      <Separator className="min-w-2xl ml-[-16px]" />

      <div className="flex gap-3">
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor={`${idPrefix}-align`} className="text-xs text-muted-foreground">
            Выравнивание
          </Label>
          <ToggleGroup
            className="w-full "
            value={[region.align]}
            disabled={!region.enabled}
            onValueChange={(value) => {
              const next = value[0] as RegionConfig["align"] | undefined
              if (next) onChange({ align: next })
            }}
          >
            <ToggleGroupItem className="h-[26px]" value="left" aria-label={alignLabels.left}>
              <AlignStartVertical />
            </ToggleGroupItem>
            <ToggleGroupItem className="h-[26px]" value="center" aria-label={alignLabels.center}>
              <AlignCenterVertical />
            </ToggleGroupItem>
            <ToggleGroupItem className="h-[26px]" value="right" aria-label={alignLabels.right}>
              <AlignEndVertical />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex flex-col items-start gap-2 w-36">
          <Label htmlFor={`${idPrefix}-margin`} className="text-xs text-muted-foreground">
            Отступ от края
          </Label>
          <Input
            id={`${idPrefix}-margin`}
            type="number"
            min={10}
            max={72}
            step={1}
            disabled={!region.enabled}
            value={region.marginPt}
            onChange={(e) => {
              const parsed = Number(e.target.value)
              if (Number.isFinite(parsed)) onChange({ marginPt: parsed })
            }}
            className="w-full"
          />
        </div>
      </div>

      <Separator className="min-w-2xl ml-[-16px]" />


      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <Label htmlFor={`${idPrefix}-text`}>Контент (текст)</Label>
          <Input
            id={`${idPrefix}-text`}
            value={region.text}
            disabled={!region.enabled}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Например: ООО «Компания» — конфиденциально"
          />
        </div>

        <div className="flex gap-2 w-full">
          <div className="flex flex-col items-start justify-between gap-2 w-full">
            <Label htmlFor={`${idPrefix}-fontsize`} className="text-xs text-muted-foreground">
              Размер шрифта
            </Label>
            <Input
              id={`${idPrefix}-fontsize`}
              type="number"
              min={6}
              max={24}
              step={1}
              disabled={!region.enabled}
              value={region.fontSize}
              onChange={(e) => {
                const parsed = Number(e.target.value)
                if (Number.isFinite(parsed)) onChange({ fontSize: parsed })
              }}
              className="w-full"
            />
          </div>

          <ColorField
            id={`${idPrefix}-color`}
            label="Цвет текста"
            value={region.color}
            disabled={!region.enabled}
            onChange={(value) => onChange({ color: value })}
          />
        </div>


        <div className="flex items-center gap-2">
          <Checkbox
            id={`${idPrefix}-logo`}
            checked={region.showLogo}
            disabled={!region.enabled}
            onCheckedChange={(checked) => onChange({ showLogo: checked })}
          />
          <Label htmlFor={`${idPrefix}-logo`} className="text-xs ">
            Добавить логотип
          </Label>
        </div>
      </div>

      <Separator className="min-w-2xl ml-[-16px]" />

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

      <Separator className="min-w-2xl ml-[-16px]" />

      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${idPrefix}-container`}>Добавить контейнер</Label>
          <Switch
            id={`${idPrefix}-container`}
            checked={region.containerEnabled}
            disabled={!region.enabled}
            onCheckedChange={(checked) => onChange({ containerEnabled: checked })}
          />
        </div>

        <Collapsible open={region.containerEnabled}>
          <CollapsibleContent>
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col gap-2">
                <Label className="text-xs text-muted-foreground">Отступы</Label>
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

              <div className="flex gap-2 pr-10">
                <div className="flex flex-col items-start justify-between gap-2 w-full">
                  <Label htmlFor={`${idPrefix}-container-radius`} className="text-xs text-muted-foreground">
                    Радиус скругления
                  </Label>
                  <Input
                    id={`${idPrefix}-container-radius`}
                    type="number"
                    min={0}
                    max={20}
                    step={1}
                    disabled={!region.enabled || !region.containerEnabled}
                    value={region.containerBorderRadius}
                    onChange={(e) => {
                      const parsed = Number(e.target.value)
                      if (Number.isFinite(parsed)) onChange({ containerBorderRadius: parsed })
                    }}
                    className="w-full"
                  />
                </div>
                <ColorField
                  id={`${idPrefix}-container-bg`}
                  label="Цвет фона"
                  value={region.containerBackground}
                  disabled={!region.enabled || !region.containerEnabled}
                  onChange={(value) => onChange({ containerBackground: value })}
                />
              </div>

              <div className="flex gap-2 pr-10">
                <div className="flex flex-col items-start justify-between gap-2 w-full">
                  <Label htmlFor={`${idPrefix}-container-border-width`} className="text-xs text-muted-foreground">Толщина рамки</Label>
                  <Input
                    id={`${idPrefix}-container-border-width`}
                    type="number"
                    min={0}
                    max={4}
                    step={0.5}
                    disabled={!region.enabled || !region.containerEnabled}
                    value={region.containerBorderWidth}
                    onChange={(e) => {
                      const parsed = Number(e.target.value)
                      if (Number.isFinite(parsed)) onChange({ containerBorderWidth: parsed })
                    }}
                    className="w-full"
                  />
                </div>

                <ColorField
                  id={`${idPrefix}-container-border`}
                  label="Цвет рамки"
                  value={region.containerBorderColor}
                  disabled={!region.enabled || !region.containerEnabled}
                  onChange={(value) => onChange({ containerBorderColor: value })}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
