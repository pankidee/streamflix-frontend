export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h3 className="brand">StreamFlix</h3>
          <p className="footer-tagline">Stream your favorite VJ-hosted movies, anytime.</p>
        </div>

        <div className="footer-col">
          <h4>Developer</h4>
          <p>Pankidee</p>
          <p><a href="mailto:pankidee256@gmail.com">pankidee256@gmail.com</a></p>
        </div>

        <div className="footer-col">
          <h4>Socials</h4>
          <div className="footer-socials">
            <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://instagram.com/yourhandle" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://github.com/yourhandle" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <p>Have a request or found a bug?</p>
          <a href="mailto:pankidee256@gmail.com" className="footer-contact-btn">Get in touch</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} StreamFlix. All rights reserved @Pankidee #Developer.</p>
      </div>
    </footer>
  );
}