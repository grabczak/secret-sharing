import { MinusIcon, PlusIcon } from "lucide-react";
import { split } from "shamir-secret-sharing";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAppDispatch, useAppSelector } from "@/store";

import {
  decrementThreshold,
  incrementThreshold,
  decrementShares,
  incrementShares,
  setSecret,
  setShares,
} from "@/store/sharing";

export function SecretEncoder() {
  const { threshold, shares, secret } = useAppSelector((state) => state.sharing);

  const dispatch = useAppDispatch();

  const handleTotalShareDecrement = () => {
    dispatch(decrementShares());
  };

  const handleTotalShareIncrement = () => {
    dispatch(incrementShares());
  };

  const handleThresholdDecrement = () => {
    dispatch(decrementThreshold());
  };

  const handleThresholdIncrement = () => {
    dispatch(incrementThreshold());
  };

  const handleSecretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSecret({ secret: e.target.value }));
  };

  const handleShareGeneration = async () => {
    const encodedSecret = new TextEncoder().encode(secret.normalize("NFKC"));

    const generatedShares = await split(encodedSecret, shares.length, threshold);

    dispatch(setShares({ shares: generatedShares.map((s) => btoa(String.fromCharCode(...s))) }));
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label>Shares</Label>
        <ButtonGroup>
          <Button variant="outline" size="icon-sm" onClick={handleTotalShareDecrement} disabled={shares.length < 3}>
            <MinusIcon />
          </Button>
          <Button variant="outline" size="sm" className="text-md pointer-events-none font-mono">
            {shares.length}
          </Button>
          <Button variant="outline" size="icon-sm" onClick={handleTotalShareIncrement}>
            <PlusIcon />
          </Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Threshold</Label>
        <ButtonGroup>
          <Button variant="outline" size="icon-sm" onClick={handleThresholdDecrement} disabled={threshold < 3}>
            <MinusIcon />
          </Button>
          <Button variant="outline" size="sm" className="text-md pointer-events-none font-mono">
            {threshold}
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleThresholdIncrement}
            disabled={threshold >= shares.length}
          >
            <PlusIcon />
          </Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="secretToEncode">Secret</Label>
        <Input
          id="secretToEncode"
          value={secret}
          onChange={handleSecretChange}
          placeholder="Enter your secret here..."
          className="font-mono"
        />
      </div>
      <Button onClick={handleShareGeneration} disabled={!secret}>
        Generate Shares
      </Button>
    </>
  );
}
