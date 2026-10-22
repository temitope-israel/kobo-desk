import { BrowserRouter, Route, Routes } from 'react-router';
import { AppLayout } from './components/layout/AppLayout';
import { BalancePage } from './pages/BalancePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ComponentsPreview } from './pages/ComponentsPreview';
import { CustomersPage } from './pages/CustomersPage';
import { DisputesPage } from './pages/DisputesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OverviewPage } from './pages/OverviewPage';
import { PaymentLinksPage } from './pages/PaymentLinksPage';
import { SettingsPage } from './pages/SettingsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { FetchDemoPage } from './pages/FetchDemoPage';
import { QueryDemoPage } from './pages/QueryDemoPage';
import { DrawerDemoPage } from './pages/DrawerDemoPage';
import { MockControls } from './components/dev/MockControls';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="balance" element={<BalancePage />} />
          <Route path="disputes" element={<DisputesPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="payment-links" element={<PaymentLinksPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        {/* <Route element={import.meta.env.DEV && <MockControls />}></Route> */}
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="dev/components" element={<ComponentsPreview />} />
        <Route path="dev/fetch-demo" element={<FetchDemoPage />} />
        <Route path="dev/drawer-demo" element={<DrawerDemoPage />} />
        <Route path="dev/query-demo" element={<QueryDemoPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {import.meta.env.DEV && <MockControls />}
    </BrowserRouter>
  );
}

export default App;
