import { useState } from "react";
import { CopyIcon, MinusIcon, PlusIcon } from "lucide-react";
import { split, combine } from "shamir-secret-sharing";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { FieldError } from "./components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";

type TState = {
  shares: string[];
  threshold: number;
  secret: string;
  reconstructed: string;
  error: string;
};

const initialState: TState = {
  shares: ["", "", ""],
  threshold: 3,
  secret: "",
  reconstructed: "",
  error: "",
};

function App() {
  const [state, setState] = useState<TState>(initialState);

  const handleTotalShareDecrement = () => {
    setState((s) => ({
      ...s,
      shares: s.shares.slice(0, -1),
      threshold: Math.min(s.shares.length - 1, s.threshold),
      error: "",
    }));
  };

  const handleTotalShareIncrement = () => {
    setState((s) => ({ ...s, shares: [...s.shares, ""], error: "" }));
  };

  const handleThresholdDecrement = () => {
    setState((s) => ({ ...s, threshold: s.threshold - 1, error: "" }));
  };

  const handleThresholdIncrement = () => {
    setState((s) => ({ ...s, threshold: s.threshold + 1, error: "" }));
  };

  const handleSecretChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState((s) => ({ ...s, secret: e.target.value, error: "" }));
  };

  const handleShareGeneration = async () => {
    const encodedSecret = new TextEncoder().encode(state.secret.normalize("NFKC"));

    const generatedShares = await split(encodedSecret, state.shares.length, state.threshold);

    setState((s) => ({
      ...s,
      shares: generatedShares.map((s) => btoa(String.fromCharCode(...s))),
      error: "",
    }));
  };

  const handleShareChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((s) => ({
      ...s,
      shares: s.shares.map((s, i) => (i === index ? e.target.value : s)),
      error: "",
    }));
  };

  const handleClearShares = () => {
    setState((s) => ({
      ...s,
      shares: s.shares.map(() => ""),
    }));
  };

  const handleSecretReconstruction = async () => {
    setState((s) => ({ ...s, error: "" }));

    try {
      const reconstructedSecret = await combine(
        state.shares.filter((s) => !!s).map((s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))),
      );

      setState((s) => ({
        ...s,
        reconstructed: new TextDecoder().decode(reconstructedSecret),
      }));
    } catch (e) {
      if (e instanceof Error) {
        setState((s) => ({ ...s, error: e.message }));
      }
    }
  };

  const handleCopyToClipboard = (s: string) => () => {
    navigator.clipboard.writeText(s);

    toast.success("Copied to clipboard");
  };

  return (
    <>
      <Toaster />
      <div className="container mx-auto flex h-full max-w-2xl flex-col justify-between px-4 pt-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-4xl font-bold">Secret Sharing</h1>
          <h2 className="text-xl font-bold">Secret To Encode</h2>
          <div className="flex flex-col gap-2">
            <Label>Shares</Label>
            <ButtonGroup>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={handleTotalShareDecrement}
                disabled={state.shares.length < 3}
              >
                <MinusIcon />
              </Button>
              <Button variant="outline" size="sm" className="text-md pointer-events-none font-mono">
                {state.shares.length}
              </Button>
              <Button variant="outline" size="icon-sm" onClick={handleTotalShareIncrement}>
                <PlusIcon />
              </Button>
            </ButtonGroup>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Threshold</Label>
            <ButtonGroup>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={handleThresholdDecrement}
                disabled={state.threshold < 3}
              >
                <MinusIcon />
              </Button>
              <Button variant="outline" size="sm" className="text-md pointer-events-none font-mono">
                {state.threshold}
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={handleThresholdIncrement}
                disabled={state.threshold >= state.shares.length}
              >
                <PlusIcon />
              </Button>
            </ButtonGroup>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="secretToEncode">Secret</Label>
            <Textarea
              id="secretToEncode"
              value={state.secret}
              onChange={handleSecretChange}
              placeholder="Enter your secret here..."
              className="font-mono"
            />
          </div>
          <Button onClick={handleShareGeneration} disabled={!state.secret}>
            Generate Shares
          </Button>
          <Separator />
          <h2 className="text-xl font-bold">Shares</h2>
          {state.shares.map((share, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Label htmlFor={`share-${i}`}>Share #{i + 1}</Label>
              <InputGroup>
                <InputGroupInput
                  id={`share-${i}`}
                  value={share}
                  onChange={handleShareChange(i)}
                  className="font-mono"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Copy"
                    title="Copy"
                    size="icon-xs"
                    onClick={handleCopyToClipboard(share)}
                    disabled={!share}
                  >
                    <CopyIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
          ))}
          <div className="mt-4 flex gap-4">
            <Button variant="outline" onClick={handleTotalShareIncrement} className="flex-1">
              Add Share
            </Button>
            <Button
              variant="outline"
              onClick={handleClearShares}
              disabled={state.shares.every((s) => !s)}
              className="flex-1"
            >
              Clear Shares
            </Button>
          </div>
          <Button onClick={handleSecretReconstruction} disabled={state.shares.filter((s) => !!s).length < 2}>
            Reconstruct Secret
          </Button>
          <FieldError className="first-letter:uppercase">{state.error}</FieldError>
          <Separator />
          <h2 className="text-xl font-bold">Reconstructed Secret</h2>
          <div className="flex flex-col gap-2">
            <Label htmlFor="reconstructedSecret">Secret</Label>
            <Textarea id="reconstructedSecret" value={state.reconstructed} readOnly className="font-mono" />
          </div>
        </div>
        <footer className="text-muted-foreground pt-8 pb-4 text-center text-sm">
          © 2025{" "}
          <a href="https://github.com/grabczak" target="_blank">
            grabczak
          </a>{" "}
          — GPLv3
        </footer>
      </div>
    </>
  );
}

export default App;
