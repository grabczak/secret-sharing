import { useState, useRef } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { split } from "shamir-secret-sharing";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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

  const [error, setError] = useState<string>("");

  const formRef = useRef<HTMLFormElement>(null);

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

  const handleShareGeneration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!secret) {
      return;
    }

    setError("");

    try {
      const encodedSecret = new TextEncoder().encode(secret.normalize("NFKC"));

      const generatedShares = await split(encodedSecret, shares.length, threshold);

      dispatch(setShares({ shares: generatedShares.map((s) => btoa(String.fromCharCode(...s))) }));
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

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Secret To Encode</h2>
      <form ref={formRef} onSubmit={handleShareGeneration} className="flex flex-col gap-4">
        <FieldSet className="gap-4">
          <Field>
            <FieldLabel>Threshold (k)</FieldLabel>
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
          </Field>
          <Field>
            <FieldLabel>Shares (n)</FieldLabel>
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
          </Field>
          <Field>
            <FieldLabel htmlFor="secretToEncode">Secret</FieldLabel>
            <Input
              id="secretToEncode"
              type="text"
              value={secret}
              onChange={handleSecretChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your secret here..."
              autoComplete="off"
              className="font-mono"
            />
          </Field>
        </FieldSet>
        <div className="flex flex-col gap-2">
          <Button type="submit" disabled={!secret}>
            Generate Shares
          </Button>
          {error && <FieldError className="first-letter:uppercase">{error}</FieldError>}
        </div>
      </form>
    </section>
  );
}
