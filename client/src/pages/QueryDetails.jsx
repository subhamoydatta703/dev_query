import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import "./QueryDetails.css";

const QueryDetails = () => {
    const { id: queryId } = useParams();
    const [query, setQuery] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [newAnswer, setNewAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        fetchQueryDetails();
    }, [queryId]);

    const fetchQueryDetails = async () => {
        try {
            const [queryRes, answersRes] = await Promise.all([
                axios.get(`/queries/${queryId}`),
                axios.get(`/queries/${queryId}/answers`),
            ]);
            setQuery(queryRes.data);
            setAnswers(answersRes.data);
        } catch (err) {
            setError("Failed to load query details");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if (!newAnswer.trim()) return;

        try {
            const { data } = await axios.post(`/queries/${queryId}/answers`, { content: newAnswer });
            setAnswers([...answers, data]);
            setNewAnswer("");
        } catch (err) {
            alert("Failed to post answer");
        }
    };

    const handleDeleteQuery = async () => {
        try {
            await axios.delete(`/queries/${queryId}`);
            navigate("/");
        } catch (error) {
            console.error("Error deleting query:", error);
            alert("Failed to delete query");
        }
    };

    const handleDeleteAnswer = async (answerId) => {
        try {
            await axios.delete(`/queries/${queryId}/answers/${answerId}`);
            setAnswers(answers.filter((a) => a._id !== answerId));
        } catch (error) {
            console.error("Error deleting answer:", error);
            alert("Failed to delete answer");
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!query) return <div className="text-center mt-10">Query not found</div>;

    return (
        <div className="query-details-container">
            <div className="query-header-card">
                <div className="query-header">
                    <h1 className="query-main-title">{query.title}</h1>
                    {user && user._id === query.author._id && (
                        <button onClick={handleDeleteQuery} className="delete-button">
                            Delete
                        </button>
                    )}
                </div>
                <p className="query-main-description">{query.description}</p>
                <div className="query-tags-container">
                    {query.tags.map((tag, index) => (
                        <span key={index} className="query-tag">
                            #{tag}
                        </span>
                    ))}
                </div>
                <div className="query-author-info">
                    Asked by <span className="author-name">{query.author.userId || query.author.username}</span> on {new Date(query.createdAt).toLocaleDateString()}
                </div>
            </div>

            <h2 className="answers-heading">{answers.length} Answers</h2>

            <div className="answers-list">
                {answers.map((answer) => (
                    <div key={answer._id} className="answer-card">
                        <p className="answer-content">{answer.content}</p>
                        <div className="answer-footer">
                            <span>Answered by <span className="author-name">{answer.author.userId || answer.author.username}</span></span>
                            {user && user._id === answer.author._id && (
                                <button onClick={() => handleDeleteAnswer(answer._id)} className="delete-button">
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {user ? (
                <div className="answer-form-card">
                    <h3 className="answer-form-title">Your Answer</h3>
                    <form onSubmit={handleAnswerSubmit}>
                        <textarea
                            className="input-field textarea-large"
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            placeholder="Write your answer here..."
                            required
                        ></textarea>
                        <button type="submit" className="btn btn-primary submit-answer-btn">
                            Post Answer
                        </button>
                    </form>
                </div>
            ) : (
                <div className="login-prompt">
                    <p>Please <a href="/login" className="login-link">login</a> to answer this query.</p>
                </div>
            )}
        </div>
    );
};

export default QueryDetails;
