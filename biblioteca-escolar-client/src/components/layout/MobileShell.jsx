import { Outlet } from 'react-router-dom';
import { AppBar } from './AppBar';
import { BottomNav } from './BottomNav';

export function MobileShell() {
  return (
    <div className="app-frame">
      <AppBar />
      <div className="app-scroll">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
