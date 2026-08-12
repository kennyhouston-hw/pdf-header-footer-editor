import { useState } from "react"
import { MaximizeIcon, MinimizeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface PaddingFieldsProps {
  idPrefix: string
  disabled?: boolean
  top: number
  right: number
  bottom: number
  left: number
  onChange: (patch: { top?: number; right?: number; bottom?: number; left?: number }) => void
}

function toNumber(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0
}

export function PaddingFields({
  idPrefix,
  disabled,
  top,
  right,
  bottom,
  left,
  onChange,
}: PaddingFieldsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const x = left === right ? left : left
  const y = top === bottom ? top : top

  return (
    <div className="flex items-start gap-2">
      <FieldGroup className="grid w-full grid-cols-2 gap-2">
        {isOpen ? (
          <>
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-padding-left`} className="sr-only">
                Отступ слева
              </FieldLabel>
              <Input
                id={`${idPrefix}-padding-left`}
                type="number"
                min={0}
                disabled={disabled}
                value={left}
                onChange={(e) => onChange({ left: toNumber(e.target.value) })}
                placeholder="Слева"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-padding-top`} className="sr-only">
                Отступ сверху
              </FieldLabel>
              <Input
                id={`${idPrefix}-padding-top`}
                type="number"
                min={0}
                disabled={disabled}
                value={top}
                onChange={(e) => onChange({ top: toNumber(e.target.value) })}
                placeholder="Сверху"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-padding-right`} className="sr-only">
                Отступ справа
              </FieldLabel>
              <Input
                id={`${idPrefix}-padding-right`}
                type="number"
                min={0}
                disabled={disabled}
                value={right}
                onChange={(e) => onChange({ right: toNumber(e.target.value) })}
                placeholder="Справа"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-padding-bottom`} className="sr-only">
                Отступ снизу
              </FieldLabel>
              <Input
                id={`${idPrefix}-padding-bottom`}
                type="number"
                min={0}
                disabled={disabled}
                value={bottom}
                onChange={(e) => onChange({ bottom: toNumber(e.target.value) })}
                placeholder="Снизу"
              />
            </Field>
          </>
        ) : (
          <>
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-padding-x`} className="sr-only">
                Отступ слева и справа
              </FieldLabel>
              <Input
                id={`${idPrefix}-padding-x`}
                type="number"
                min={0}
                disabled={disabled}
                value={x}
                onChange={(e) => {
                  const value = toNumber(e.target.value)
                  onChange({ left: value, right: value })
                }}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-padding-y`} className="sr-only">
                Отступ сверху и снизу
              </FieldLabel>
              <Input
                id={`${idPrefix}-padding-y`}
                type="number"
                min={0}
                disabled={disabled}
                value={y}
                onChange={(e) => {
                  const value = toNumber(e.target.value)
                  onChange({ top: value, bottom: value })
                }}
              />
            </Field>
          </>
        )}
      </FieldGroup>

      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Свернуть до общих отступов" : "Задать отступы по отдельности"}
      >
        {isOpen ? <MinimizeIcon /> : <MaximizeIcon />}
      </Button>
    </div>
  )
}
