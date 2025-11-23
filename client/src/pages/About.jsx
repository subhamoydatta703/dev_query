import "./About.css";

const About = () => {
    return (
        <div className="about-container">
            <div className="about-content">
                <h1 className="about-title">About DevQuery</h1>

                <section className="about-section">
                    <h2>What is DevQuery?</h2>
                    <p>
                        DevQuery is a community-driven platform where developers can ask questions,
                        share knowledge, and help each other solve coding challenges. Whether you're
                        a beginner or an experienced developer, DevQuery is the place to learn and grow.
                    </p>
                </section>

                <section className="about-section">
                    <h2>How It Works</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">❓</div>
                            <h3>Ask Questions</h3>
                            <p>Post your coding queries with detailed descriptions and relevant tags.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💡</div>
                            <h3>Get Answers</h3>
                            <p>Receive helpful answers from experienced developers in the community.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🤝</div>
                            <h3>Help Others</h3>
                            <p>Share your knowledge by answering questions from fellow developers.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🚀</div>
                            <h3>Grow Together</h3>
                            <p>Learn from real-world problems and build your development skills.</p>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Features</h2>
                    <ul className="features-list">
                        <li> Ask and answer technical questions</li>
                        <li> Tag-based organization for easy discovery</li>
                        <li> User authentication and profile management</li>
                        <li> Edit and delete your own content</li>
                        <li> Clean and modern user interface</li>
                    </ul>
                </section>

                <section className="about-section">
                    <h2>Get Started</h2>
                    <p>
                        Ready to join the community? <a href="/signup" className="about-link">Sign up</a> now
                        and start asking questions or helping others with their coding challenges!
                    </p>
                </section>
            </div>
        </div>
    );
};

export default About;
