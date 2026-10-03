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

        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="dev/components" element={<ComponentsPreview />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
