import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { FieldSet, FieldLabel, Field } from "@/components/ui/field";

import { useAppSelector } from "@/store";

export function ReconstructedSecret() {
  const { reconstructedSecret } = useAppSelector((state) => state.sharing);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(reconstructedSecret);

    toast.success("Copied to clipboard");
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Reconstructed Secret</h2>
      <FieldSet>
        <Field>
          <FieldLabel htmlFor="reconstructedSecret">Secret</FieldLabel>
          <InputGroup>
            <InputGroupInput id="reconstructedSecret" value={reconstructedSecret} readOnly className="font-mono" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label="Copy"
                title="Copy"
                size="icon-xs"
                onClick={handleCopyToClipboard}
                disabled={!reconstructedSecret}
              >
                <CopyIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldSet>
    </section>
  );
}
