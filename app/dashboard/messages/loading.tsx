import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MessagesLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">
            <Skeleton className="h-8 w-48" />
          </CardTitle>
          <Skeleton className="h-9 w-32" />
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex max-w-[70%] ${i % 2 === 0 ? "flex-row-reverse" : "flex-row"} items-start space-x-2`}
                >
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className={`flex flex-col ${i % 2 === 0 ? "items-end" : "items-start"}`}>
                    <Skeleton className={`h-24 w-64 rounded-lg`} />
                    <Skeleton className="h-4 w-20 mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-end space-x-2 pt-4 border-t">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="flex-1 h-20" />
            <Skeleton className="h-9 w-9" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
