import Link from "next/link";

const Header = () => {
  return (
    <header>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="logo">Commute Portal</div>
        <nav>
          <Link href="/" legacyBehavior>
            <a>Home</a>
          </Link>
          <Link href="/login" legacyBehavior>
            <a>Login</a>
          </Link>
          <Link href="/register" legacyBehavior>
            <a>Register</a>
          </Link>
          <Link href="/commute" legacyBehavior>
            <a>Plan Commute</a>
          </Link>
          <Link href="/history" legacyBehavior>
            <a>History</a>
          </Link>
          <Link href="/dashboard" legacyBehavior>
            <a>Dashboard</a>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
