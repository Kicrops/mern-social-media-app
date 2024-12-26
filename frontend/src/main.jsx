import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "./components/ui/provider";
import { defaultSystem } from "@chakra-ui/react";

import App from "./App";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider value={defaultSystem}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</StrictMode>
);
