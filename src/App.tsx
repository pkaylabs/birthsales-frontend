import "./App.css";
import LayoutProvider from "./layout";
import NotificationProvider from "./notifications";
import RoutesProvider from "./router";
import ErrorBoundary from "./components/core/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <RoutesProvider>
          <LayoutProvider />
        </RoutesProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
