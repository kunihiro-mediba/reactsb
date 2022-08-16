import { createRoot } from "react-dom/client";

import { App } from "./app";

export async function main() {
    const root = createRoot(document.getElementById("container")!);
    root.render(<App />);
}

addEventListener("load", main);
