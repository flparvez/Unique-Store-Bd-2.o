import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface IStats {
  name: string;
  value: string;
  change: string;
  changeType: string;
}

export function CardStats({ stats }: { stats: IStats[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats?.map((stat) => (
        <Card key={stat.name}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="mt-2">
              <Badge
                variant={stat.changeType === "positive" ? "default" : "destructive"}
              >
                {stat.change}
              </Badge>
              <span className="ml-1 text-xs text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}