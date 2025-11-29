import { useState } from "react";
import { CopyIcon, MinusIcon, PlusIcon } from "lucide-react";
import { split, combine } from "shamir-secret-sharing";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function App() {
  const [shares, setShares] = useState<string[]>(["", "", ""]);

  const [threshold, setThreshold] = useState<number>(3);

  const [secret, setSecret] = useState<string>("");

  const [reconstructed, setReconstructed] = useState<string>("");

  const handleTotalShareDecrement = () => {
    setShares((shares) => shares.slice(0, -1));
  };

  const handleTotalShareIncrement = () => {
    setShares((shares) => [...shares, ""]);
  };

  const handleThresholdDecrement = () => {
    setThreshold((count) => count - 1);
  };

  const handleThresholdIncrement = () => {
    setThreshold((count) => count + 1);
  };

  const handleSecretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecret(e.target.value);
  };

  const handleShareGeneration = async () => {
    const encodedSecret = new TextEncoder().encode(secret.normalize("NFKC"));

    const generatedShares = await split(encodedSecret, shares.length, threshold);

    setShares(generatedShares.map((s) => btoa(String.fromCharCode(...s))));
  };

  const handleShareChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setShares((shares) => shares.map((s, i) => (i === index ? e.target.value : s)));
  };

  const handleSecretReconstruction = async () => {
    const reconstructedSecret = await combine(shares.map((s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))));

    setReconstructed(new TextDecoder().decode(reconstructedSecret));
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-center text-4xl font-bold">Secret Sharing</h1>
      <div className="flex flex-col gap-4 py-8">
        <h2 className="text-xl font-bold">Secret To Encode</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="secret">Shares</Label>
          <ButtonGroup>
            <Button variant="outline" size="icon-sm" onClick={handleTotalShareDecrement}>
              <MinusIcon />
            </Button>
            <Button variant="outline" size="sm" className="pointer-events-none">
              {shares.length}
            </Button>
            <Button variant="outline" size="icon-sm" onClick={handleTotalShareIncrement}>
              <PlusIcon />
            </Button>
          </ButtonGroup>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="secret">Threshold</Label>
          <ButtonGroup>
            <Button variant="outline" size="icon-sm" onClick={handleThresholdDecrement}>
              <MinusIcon />
            </Button>
            <Button variant="outline" size="sm" className="pointer-events-none">
              {threshold}
            </Button>
            <Button variant="outline" size="icon-sm" onClick={handleThresholdIncrement}>
              <PlusIcon />
            </Button>
          </ButtonGroup>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="secret">Secret to encode</Label>
          <Input id="secret" onChange={handleSecretChange} value={secret} placeholder="Enter your secret here..." />
        </div>
        <Button onClick={handleShareGeneration}>Generate Shares</Button>
        <Separator />
        <h2 className="text-xl font-bold">Shares</h2>
        {shares.map((share, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Label htmlFor="secret">Share #{i + 1}</Label>
            <InputGroup>
              <InputGroupInput value={share} onChange={handleShareChange(i)} placeholder="" />
              <InputGroupAddon align="inline-end">
                <InputGroupButton aria-label="Copy" title="Copy" size="icon-xs">
                  <CopyIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        ))}
        <Button onClick={handleSecretReconstruction}>Reconstruct Secret</Button>
        <Separator />
        <h2 className="text-xl font-bold">Reconstructed Secret</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="secret">Secret</Label>
          <InputGroup>
            <InputGroupInput value={reconstructed} placeholder="" readOnly />
            <InputGroupAddon align="inline-end">
              <InputGroupButton aria-label="Copy" title="Copy" size="icon-xs">
                <CopyIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    </div>
  );
}

export default App;
