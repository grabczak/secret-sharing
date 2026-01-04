import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAppSelector } from "@/store";

export function ReconstructedSecret() {
  const { reconstructedSecret } = useAppSelector((state) => state.sharing);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="reconstructedSecret">Secret</Label>
      <Input id="reconstructedSecret" value={reconstructedSecret} readOnly className="font-mono" />
    </div>
  );
}
