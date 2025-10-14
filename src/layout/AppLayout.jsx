import { NavLink, Outlet } from 'react-router-dom';
import styles from './AppLayout.module.css';
import sidebarStyles from '../components/Sidebar/Sidebar.module.css';
import Logo from '../shared/ui/Logo/Logo.jsx';
import { MenuItem } from '../components/Sidebar/MenuItem.jsx';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import ExploreIcon from '@mui/icons-material/ExploreOutlined';
import ChatIcon from '@mui/icons-material/ChatBubbleOutline';
import NotificationsIcon from '@mui/icons-material/NotificationsNone';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import PersonIcon from '@mui/icons-material/PersonOutline';

export default function AppLayout() {
  return (
    <div className={styles.shell}>
      <aside className={sidebarStyles.sidebar}>
        <div className={sidebarStyles.inner}>
          <Logo />

          <nav className={sidebarStyles.nav}>
            <MenuItem
              to="/"
              end
              icon={<HomeIcon fontSize="small" />}
              label="Home"
            />
            <MenuItem
              to="/search"
              icon={<SearchIcon fontSize="small" />}
              label="Search"
            />
            <MenuItem
              to="/explore"
              icon={<ExploreIcon fontSize="small" />}
              label="Explore"
            />
            <MenuItem
              to="/messages"
              icon={<ChatIcon fontSize="small" />}
              label="Messages"
            />
            <MenuItem
              to="/notifications"
              icon={<NotificationsIcon fontSize="small" />}
              label="Notifications"
            />
            <MenuItem
              to="/create"
              icon={<AddIcon fontSize="small" />}
              label="Create"
            />
            <MenuItem
              to="/profile"
              icon={<PersonIcon fontSize="small" />}
              label="Profile"
            />
          </nav>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
