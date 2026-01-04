import { CopyIcon } from "lucide-react";
import { combine } from "shamir-secret-sharing";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

import { useAppDispatch, useAppSelector } from "@/store";
import { incrementShares, setShare, clearShares, setError, setReconstructedSecret } from "@/store/sharing";

export function GeneratedShares() {
  const { shares, error } = useAppSelector((state) => state.sharing);

  const dispatch = useAppDispatch();

  const handleTotalShareIncrement = () => {
    dispatch(incrementShares());
  };

  const handleShareChange = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setShare({ index: i, share: e.target.value }));
  };

  const handleClearShares = () => {
    dispatch(clearShares());
  };

  const handleSecretReconstruction = async () => {
    dispatch(setError({ error: "" }));

    try {
      const reconstructedSecret = await combine(
        shares.filter((s) => !!s).map((s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))),
      );

      dispatch(setReconstructedSecret({ reconstructedSecret: new TextDecoder().decode(reconstructedSecret) }));
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setError({ error: e.message }));
      }
    }
  };

  const handleCopyToClipboard = (s: string) => () => {
    navigator.clipboard.writeText(s);

    toast.success("Copied to clipboard");
  };

  return (
    <>
      {shares.map((share, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Label htmlFor={`share-${i}`}>Share #{i + 1}</Label>
          <InputGroup>
            <InputGroupInput id={`share-${i}`} value={share} onChange={handleShareChange(i)} className="font-mono" />
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
        <Button variant="outline" onClick={handleClearShares} disabled={shares.every((s) => !s)} className="flex-1">
          Clear Shares
        </Button>
      </div>
      <Button onClick={handleSecretReconstruction} disabled={shares.filter((s) => !!s).length < 2}>
        Reconstruct Secret
      </Button>
      <FieldError className="first-letter:uppercase">{error}</FieldError>
    </>
  );
}
