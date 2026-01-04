import { useState, useRef } from "react";
import { CopyIcon } from "lucide-react";
import { combine } from "shamir-secret-sharing";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldError, Field, FieldSet, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

import { useAppDispatch, useAppSelector } from "@/store";
import { incrementShares, setShare, clearShares, setReconstructed } from "@/store/sharing";

export function GeneratedShares() {
  const { shares } = useAppSelector((state) => state.sharing);

  const dispatch = useAppDispatch();

  const [error, setError] = useState<string>("");

  const formRef = useRef<HTMLFormElement>(null);

  const handleTotalShareIncrement = () => {
    dispatch(incrementShares());
  };

  const handleShareChange = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setShare({ index: i, share: e.target.value }));
  };

  const handleClearShares = () => {
    dispatch(clearShares());
  };

  const handleSecretReconstruction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (shares.filter((s) => !!s).length < 2) {
      return;
    }

    setError("");

    try {
      const reconstructedSecret = await combine(
        shares.filter((s) => !!s).map((s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))),
      );

      dispatch(setReconstructed({ reconstructed: new TextDecoder().decode(reconstructedSecret) }));
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      formRef.current?.requestSubmit();
    }
  };

  const handleCopyToClipboard = (s: string) => () => {
    navigator.clipboard.writeText(s);

    toast.success("Copied to clipboard");
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Shares</h2>
      <form ref={formRef} onSubmit={handleSecretReconstruction} className="flex flex-col gap-8">
        <FieldSet className="gap-4">
          {shares.map((share, i) => (
            <Field key={i}>
              <FieldLabel htmlFor={`share-${i}`}>Share #{i + 1}</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id={`share-${i}`}
                  type="text"
                  value={share}
                  onChange={handleShareChange(i)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
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
            </Field>
          ))}
        </FieldSet>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Button variant="outline" type="button" onClick={handleTotalShareIncrement} className="flex-1">
              Add Share
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleClearShares}
              disabled={shares.every((s) => !s)}
              className="flex-1"
            >
              Clear Shares
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={shares.filter((s) => !!s).length < 2}>
              Reconstruct Secret
            </Button>
            <FieldError className="first-letter:uppercase">{error}</FieldError>
          </div>
        </div>
      </form>
    </section>
  );
}
