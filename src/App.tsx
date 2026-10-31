import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import CoinDetail from './pages/CoinDetail'
import Dashboard from './pages/Dashboard'
import { Login, Register } from './pages/Auth'
import Markets from './pages/Markets'
import NotFound from './pages/NotFound'
import SettingsPage from './pages/Settings'
import Swap from './pages/Swap'
import Transactions from './pages/Transactions'
import WalletPage from './pages/Wallet'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="markets" element={<Markets />} />
        <Route path="markets/:id" element={<CoinDetail />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="swap" element={<Swap />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
