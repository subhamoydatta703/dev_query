import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import "./Navbar.css";

const Navbar = () => {
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

                    <SignedIn>
                        <Link to="/ask" className="btn btn-primary">
                            Ask Question
                        </Link>
                        <div style={{ marginLeft: "1rem" }}>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </SignedIn>

                    <SignedOut>
                        <Link to="/login" className="navbar-link">
                            Login
                        </Link>
                        <Link to="/signup" className="btn btn-primary">
                            Signup
                        </Link>
                    </SignedOut>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
