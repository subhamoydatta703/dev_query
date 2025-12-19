import { SignUp } from "@clerk/clerk-react";
import "./Auth.css";

const Signup = () => {
    return (
        <div className="auth-container">
            <SignUp path="/signup" routing="path" signInUrl="/login" />
        </div>
    );
};

export default Signup;
