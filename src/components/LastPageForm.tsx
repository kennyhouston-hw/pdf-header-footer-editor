import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { LinkFields } from "@/components/LinkFields"
import { PaddingFields } from "@/components/PaddingFields"
import { ColorField } from "@/components/ColorField"
import type { LastPageConfig } from "@/lib/types"

interface LastPageFormProps {
  config: LastPageConfig
  onChange: (patch: Partial<LastPageConfig>) => void
}

export function LastPageForm({ config, onChange }: LastPageFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="lastpage-enabled">Добавить последнюю страницу</Label>
        <Switch
          id="lastpage-enabled"
          checked={config.enabled}
          onCheckedChange={(checked) => onChange({ enabled: checked })}
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

      <div className="flex items-center justify-between">
        <Label htmlFor="lastpage-logo">Логотип</Label>
        <Switch
          id="lastpage-logo"
          checked={config.showLogo}
          disabled={!config.enabled}
          onCheckedChange={(checked) => onChange({ showLogo: checked })}
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

      <Collapsible>
        <CollapsibleTrigger>Дополнительные настройки</CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-5 pt-4 pb-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="lastpage-margin">Отступ по краям</Label>
                <span className="text-sm text-muted-foreground">{config.marginPt}pt</span>
              </div>
              <Slider
                id="lastpage-margin"
                value={[config.marginPt]}
                min={10}
                max={72}
                step={1}
                disabled={!config.enabled}
                onValueChange={(val) => onChange({ marginPt: Array.isArray(val) ? val[0] : val })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="lastpage-right-fontsize">Размер шрифта</Label>
                <span className="text-sm text-muted-foreground">{config.rightFontSize}pt</span>
              </div>
              <Slider
                id="lastpage-right-fontsize"
                value={[config.rightFontSize]}
                min={6}
                max={24}
                step={1}
                disabled={!config.enabled}
                onValueChange={(val) =>
                  onChange({ rightFontSize: Array.isArray(val) ? val[0] : val })
                }
              />
            </div>

            <ColorField
              id="lastpage-right-color"
              label="Цвет текста"
              value={config.rightColor}
              disabled={!config.enabled}
              onChange={(value) => onChange({ rightColor: value })}
            />

            <div className="flex items-center justify-between">
              <Label htmlFor="lastpage-right-container">Контейнер</Label>
              <Switch
                id="lastpage-right-container"
                checked={config.rightContainerEnabled}
                disabled={!config.enabled}
                onCheckedChange={(checked) => onChange({ rightContainerEnabled: checked })}
              />
            </div>

            <ColorField
              id="lastpage-right-container-bg"
              label="Цвет фона"
              value={config.rightContainerBackground}
              disabled={!config.enabled || !config.rightContainerEnabled}
              onChange={(value) => onChange({ rightContainerBackground: value })}
            />

            <ColorField
              id="lastpage-right-container-border"
              label="Цвет рамки"
              value={config.rightContainerBorderColor}
              disabled={!config.enabled || !config.rightContainerEnabled}
              onChange={(value) => onChange({ rightContainerBorderColor: value })}
            />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="lastpage-right-container-border-width">Толщина рамки</Label>
                <span className="text-sm text-muted-foreground">
                  {config.rightContainerBorderWidth}pt
                </span>
              </div>
              <Slider
                id="lastpage-right-container-border-width"
                value={[config.rightContainerBorderWidth]}
                min={0}
                max={4}
                step={0.5}
                disabled={!config.enabled || !config.rightContainerEnabled}
                onValueChange={(val) =>
                  onChange({ rightContainerBorderWidth: Array.isArray(val) ? val[0] : val })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="lastpage-right-container-radius">Радиус скругления</Label>
                <span className="text-sm text-muted-foreground">
                  {config.rightContainerBorderRadius}pt
                </span>
              </div>
              <Slider
                id="lastpage-right-container-radius"
                value={[config.rightContainerBorderRadius]}
                min={0}
                max={20}
                step={1}
                disabled={!config.enabled || !config.rightContainerEnabled}
                onValueChange={(val) =>
                  onChange({ rightContainerBorderRadius: Array.isArray(val) ? val[0] : val })
                }
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label>Отступы</Label>
              <PaddingFields
                idPrefix="lastpage-right-container-padding"
                disabled={!config.enabled || !config.rightContainerEnabled}
                top={config.rightContainerPaddingTop}
                right={config.rightContainerPaddingRight}
                bottom={config.rightContainerPaddingBottom}
                left={config.rightContainerPaddingLeft}
                onChange={(patch) =>
                  onChange({
                    ...(patch.top !== undefined && { rightContainerPaddingTop: patch.top }),
                    ...(patch.right !== undefined && { rightContainerPaddingRight: patch.right }),
                    ...(patch.bottom !== undefined && {
                      rightContainerPaddingBottom: patch.bottom,
                    }),
                    ...(patch.left !== undefined && { rightContainerPaddingLeft: patch.left }),
                  })
                }
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
