import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegionForm } from "@/components/RegionForm"
import { LastPageForm } from "@/components/LastPageForm"
import { useConfigStore } from "@/store/useConfigStore"

export function ConfigPanel() {
  const config = useConfigStore((s) => s.config)
  const updateRegion = useConfigStore((s) => s.updateRegion)
  const updateLastPage = useConfigStore((s) => s.updateLastPage)

  return (
    <Tabs defaultValue="region" className="h-full min-h-0 ">
      <TabsList className="w-[calc(100%-2rem)] shrink-0 mx-auto flex items-center">
        <TabsTrigger value="region">Колонтитул</TabsTrigger>
        <TabsTrigger value="lastpage">Футер</TabsTrigger>
      </TabsList>
      <TabsContent value="region" className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pt-4 scrollbar-none">
        <RegionForm
          idPrefix="region"
          region={config.region}
          onChange={updateRegion}
        />
      </TabsContent>
      <TabsContent value="lastpage" className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pt-4 scrollbar-none">
        <LastPageForm config={config.lastPage} onChange={updateLastPage} />
      </TabsContent>
    </Tabs>
  )
}
