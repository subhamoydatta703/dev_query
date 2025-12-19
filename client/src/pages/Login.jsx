import { SignIn } from "@clerk/clerk-react";
import "./Auth.css";

const Login = () => {
    return (
        <div className="auth-container">
            <div className="auth-box">
                <SignIn path="/login" routing="path" signUpUrl="/signup" />
            </div>
        </div>
    );
};

export default Login;
