import { Provider } from "react-redux";
import { store } from "@/store";

import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";

import { SecretEncoder } from "@/components/SecretEncoder";
import { GeneratedShares } from "@/components/GeneratedShares";
import { ReconstructedSecret } from "@/components/ReconstructedSecret";

function App() {
  return (
    <Provider store={store}>
      <Toaster />
      <div className="container mx-auto flex min-h-full max-w-2xl flex-col justify-between px-4">
        <div className="flex flex-col gap-4 pt-8">
          <h1 className="text-center text-4xl font-bold">Secret Sharing</h1>
          <p className="text-center">Securely split a secret into shares and recover it only with enough parts.</p>
          <SecretEncoder />
          <Separator />
          <GeneratedShares />
          <Separator />
          <ReconstructedSecret />
        </div>
        <footer className="text-muted-foreground py-8 text-center text-sm">
          © 2026{" "}
          <a href="https://github.com/grabczak" target="_blank">
            grabczak
          </a>{" "}
          — GPLv3
        </footer>
      </div>
    </Provider>
  );
}

export default App;
