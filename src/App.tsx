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
      <div className="container mx-auto flex h-full max-w-2xl flex-col justify-between px-4 pt-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-4xl font-bold">Secret Sharing</h1>
          <h2 className="text-xl font-bold">Secret To Encode</h2>
          <SecretEncoder />
          <Separator />
          <h2 className="text-xl font-bold">Shares</h2>
          <GeneratedShares />
          <Separator />
          <h2 className="text-xl font-bold">Reconstructed Secret</h2>
          <ReconstructedSecret />
        </div>
        <footer className="text-muted-foreground pt-8 pb-4 text-center text-sm">
          © 2025{" "}
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
