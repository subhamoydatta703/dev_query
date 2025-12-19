import { SignIn } from "@clerk/clerk-react";
import "./Auth.css";

const Login = () => {
    return (
        <div className="auth-container">
            <SignIn path="/login" routing="path" signUpUrl="/signup" />
        </div>
    );
};

export default Login;
