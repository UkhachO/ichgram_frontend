import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

export function MenuItem({ to, label, icon, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [styles.link, isActive ? styles.active : ''].join(' ')
      }
    >
      <span className={styles.icon} aria-hidden>
        {icon}
      </span>
      <span>{label}</span>
    </NavLink>
  );
}
