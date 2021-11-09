import styles from '../styles/Home.module.css'

const Footer = () => {
  return (
      <footer className={styles.footer}>
        Copyright &copy; {new Date().getFullYear()} Superteam
      </footer> 
    );
}

export default Footer;