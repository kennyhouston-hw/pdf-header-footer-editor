import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegionForm } from "@/components/RegionForm"
import { LastPageForm } from "@/components/LastPageForm"
import { useConfigStore } from "@/store/useConfigStore"

export function ConfigPanel() {
  const config = useConfigStore((s) => s.config)
  const updateRegion = useConfigStore((s) => s.updateRegion)
  const updateLastPage = useConfigStore((s) => s.updateLastPage)

  return (
    <Tabs defaultValue="header">
      <TabsList className="w-full">
        <TabsTrigger value="header">Header</TabsTrigger>
        <TabsTrigger value="footer">Footer</TabsTrigger>
        <TabsTrigger value="lastpage">Last Page</TabsTrigger>
      </TabsList>
      <TabsContent value="header" className="pt-4">
        <RegionForm
          idPrefix="header"
          enabledLabel="Добавить хэдер"
          region={config.header}
          onChange={(patch) => updateRegion("header", patch)}
        />
      </TabsContent>
      <TabsContent value="footer" className="pt-4">
        <RegionForm
          idPrefix="footer"
          enabledLabel="Добавить футер"
          region={config.footer}
          onChange={(patch) => updateRegion("footer", patch)}
        />
      </TabsContent>
      <TabsContent value="lastpage" className="pt-4">
        <LastPageForm config={config.lastPage} onChange={updateLastPage} />
      </TabsContent>
    </Tabs>
  )
}
