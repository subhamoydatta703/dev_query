import { SignUp } from "@clerk/clerk-react";
import "./Auth.css";

const Signup = () => {
    return (
        <div className="auth-container">
            <div className="auth-box">
                <SignUp path="/signup" routing="path" signInUrl="/login" />
            </div>
        </div>
    );
};

export default Signup;
