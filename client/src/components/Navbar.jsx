import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    DevQuery
                </Link>
                <div className="navbar-menu">
                    <Link to="/about" className="navbar-link">
                        About
                    </Link>
                    {user ? (
                        <>
                            <span className="navbar-welcome">Welcome, {user.username}</span>
                            <Link to="/ask" className="btn btn-primary">
                                Ask Question
                            </Link>
                            <button onClick={logout} className="navbar-logout">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-link">
                                Login
                            </Link>
                            <Link to="/signup" className="btn btn-primary">
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
