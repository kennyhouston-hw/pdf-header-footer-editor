import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegionForm } from "@/components/RegionForm"
import { LastPageForm } from "@/components/LastPageForm"
import { useConfigStore } from "@/store/useConfigStore"

export function ConfigPanel() {
  const config = useConfigStore((s) => s.config)
  const updateRegion = useConfigStore((s) => s.updateRegion)
  const updateLastPage = useConfigStore((s) => s.updateLastPage)

  return (
    <Tabs defaultValue="header" className="h-full min-h-0">
      <TabsList className="w-full shrink-0">
        <TabsTrigger value="header">Header</TabsTrigger>
        <TabsTrigger value="footer">Footer</TabsTrigger>
        <TabsTrigger value="lastpage">Last Page</TabsTrigger>
      </TabsList>
      <TabsContent value="header" className="min-h-0 flex-1 overflow-y-auto pt-4 scrollbar-none">
        <RegionForm
          idPrefix="header"
          enabledLabel="Добавить хэдер"
          region={config.header}
          onChange={(patch) => updateRegion("header", patch)}
        />
      </TabsContent>
      <TabsContent value="footer" className="min-h-0 flex-1 overflow-y-auto pt-4 scrollbar-none">
        <RegionForm
          idPrefix="footer"
          enabledLabel="Добавить футер"
          region={config.footer}
          onChange={(patch) => updateRegion("footer", patch)}
        />
      </TabsContent>
      <TabsContent value="lastpage" className="min-h-0 flex-1 overflow-y-auto pt-4 scrollbar-none">
        <LastPageForm config={config.lastPage} onChange={updateLastPage} />
      </TabsContent>
    </Tabs>
  )
}
