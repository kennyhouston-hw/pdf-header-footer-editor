import { MoveHorizontalIcon, MoveVerticalIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { LinkFields } from "@/components/LinkFields"
import { PaddingFields } from "@/components/PaddingFields"
import { ColorField } from "@/components/ColorField"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import type { LastPageConfig } from "@/lib/types"
import { Checkbox } from "./ui/checkbox"

interface LastPageFormProps {
  config: LastPageConfig
  onChange: (patch: Partial<LastPageConfig>) => void
}

export function LastPageForm({ config, onChange }: LastPageFormProps) {
  return (
    <div className="flex flex-col gap-5 px-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="lastpage-enabled">Добавить последнюю страницу</Label>
        <Switch
          id="lastpage-enabled"
          checked={config.enabled}
          onCheckedChange={(checked) => onChange({ enabled: checked })}
        />
      </div>

      <Separator className="min-w-2xl ml-[-16px]"/>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Отступ по краям</Label>
        <div className="flex gap-2">
          <InputGroup>
            <InputGroupAddon>
              <MoveHorizontalIcon />
            </InputGroupAddon>
            <InputGroupInput
              id="lastpage-margin-x"
              type="number"
              min={0}
              disabled={!config.enabled}
              value={config.marginX}
              onChange={(e) => {
                const parsed = Number(e.target.value)
                if (Number.isFinite(parsed)) onChange({ marginX: Math.max(0, parsed) })
              }}
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon>
              <MoveVerticalIcon />
            </InputGroupAddon>
            <InputGroupInput
              id="lastpage-margin-y"
              type="number"
              min={0}
              disabled={!config.enabled}
              value={config.marginY}
              onChange={(e) => {
                const parsed = Number(e.target.value)
                if (Number.isFinite(parsed)) onChange({ marginY: Math.max(0, parsed) })
              }}
            />
          </InputGroup>
        </div>
      </div>

      <div className="flex px-4 py-3 min-w-xl ml-[-16px] bg-muted border-t border-b uppercase tracking-wide font-mono text-xs text-muted-foreground">Левая часть</div>


      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <Label htmlFor="lastpage-left">Текст</Label>
          <Input
            id="lastpage-left"
            value={config.leftText}
            disabled={!config.enabled}
            onChange={(e) => onChange({ leftText: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="lastpage-logo"
            checked={config.showLogo}
            disabled={!config.enabled}
            onCheckedChange={(checked) => onChange({ showLogo: checked })}
          />
          <Label htmlFor="lastpage-logo" className="text-xs">
            Добавить логотип
          </Label>
        </div>
      </div>

      <div className="flex px-4 py-3 min-w-xl ml-[-16px] bg-muted border-t border-b uppercase tracking-wide text-xs font-mono text-muted-foreground">Правая часть</div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <Label htmlFor="lastpage-right">Текст</Label>
          <Input
            id="lastpage-right"
            value={config.rightText}
            disabled={!config.enabled}
            onChange={(e) => onChange({ rightText: e.target.value })}
          />
        </div>
        <div className="flex gap-2 w-full">
          <div className="flex flex-col items-start justify-between gap-2 w-full">
            <Label htmlFor="lastpage-right-fontsize" className="text-xs text-muted-foreground">
              Размер шрифта
            </Label>
            <Input
              id="lastpage-right-fontsize"
              type="number"
              min={6}
              max={24}
              step={1}
              disabled={!config.enabled}
              value={config.rightFontSize}
              onChange={(e) => {
                const parsed = Number(e.target.value)
                if (Number.isFinite(parsed)) onChange({ rightFontSize: parsed })
              }}
              className="w-full"
            />
          </div>

          <ColorField
            id="lastpage-right-color"
            label="Цвет текста"
            value={config.rightColor}
            disabled={!config.enabled}
            onChange={(value) => onChange({ rightColor: value })}
          />
        </div>

        <Separator className="my-1" />

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

        <Separator className="my-1" />

        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <Label htmlFor="lastpage-right-container">Добавить контейнер</Label>
            <Switch
              id="lastpage-right-container"
              checked={config.rightContainerEnabled}
              disabled={!config.enabled}
              onCheckedChange={(checked) => onChange({ rightContainerEnabled: checked })}
            />
          </div>

          <Collapsible open={config.rightContainerEnabled}>
            <CollapsibleContent>
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">Отступы</Label>
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
                        ...(patch.right !== undefined && {
                          rightContainerPaddingRight: patch.right,
                        }),
                        ...(patch.bottom !== undefined && {
                          rightContainerPaddingBottom: patch.bottom,
                        }),
                        ...(patch.left !== undefined && { rightContainerPaddingLeft: patch.left }),
                      })
                    }
                  />
                </div>

                <div className="flex gap-2 pr-10">
                  <div className="flex flex-col items-start justify-between gap-2 w-full">
                    <Label htmlFor="lastpage-right-container-radius" className="text-xs text-muted-foreground">
                      Радиус скругления
                    </Label>
                    <Input
                      id="lastpage-right-container-radius"
                      type="number"
                      min={0}
                      max={20}
                      step={1}
                      disabled={!config.enabled || !config.rightContainerEnabled}
                      value={config.rightContainerBorderRadius}
                      onChange={(e) => {
                        const parsed = Number(e.target.value)
                        if (Number.isFinite(parsed)) onChange({ rightContainerBorderRadius: parsed })
                      }}
                      className="w-full"
                    />
                  </div>
                  <ColorField
                    id="lastpage-right-container-bg"
                    label="Цвет фона"
                    value={config.rightContainerBackground}
                    disabled={!config.enabled || !config.rightContainerEnabled}
                    onChange={(value) => onChange({ rightContainerBackground: value })}
                  />
                </div>

                <div className="flex gap-2 pr-10">
                  <div className="flex flex-col items-start justify-between gap-2 w-full">
                    <Label htmlFor="lastpage-right-container-border-width" className="text-xs text-muted-foreground">
                      Толщина рамки
                    </Label>
                    <Input
                      id="lastpage-right-container-border-width"
                      type="number"
                      min={0}
                      max={4}
                      step={0.5}
                      disabled={!config.enabled || !config.rightContainerEnabled}
                      value={config.rightContainerBorderWidth}
                      onChange={(e) => {
                        const parsed = Number(e.target.value)
                        if (Number.isFinite(parsed)) onChange({ rightContainerBorderWidth: parsed })
                      }}
                      className="w-full"
                    />
                  </div>

                  <ColorField
                    id="lastpage-right-container-border"
                    label="Цвет рамки"
                    value={config.rightContainerBorderColor}
                    disabled={!config.enabled || !config.rightContainerEnabled}
                    onChange={(value) => onChange({ rightContainerBorderColor: value })}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  )
}
