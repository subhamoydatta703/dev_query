import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const { data } = await axios.get("/queries");
            setQueries(data);
        } catch (error) {
            console.error("Error fetching queries:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuery = async (queryId, e) => {
        e.preventDefault(); // Prevent navigation to query details

        try {
            await axios.delete(`/queries/${queryId}`);
            // Remove the deleted query from the list
            setQueries(queries.filter((q) => q._id !== queryId));
        } catch (err) {
            console.error("Delete error:", err);
            alert(`Failed to delete query: ${err.response?.data?.message || err.message}`);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="home-container">
            <h1 className="home-title">Community Queries</h1>
            <div className="queries-grid">
                {queries.map((query) => (
                    <div key={query._id} className="query-card">
                        <Link to={`/query/${query._id}`}>
                            <h2 className="query-title">{query.title}</h2>
                        </Link>
                        <p className="query-description">{query.description}</p>
                        <div className="query-meta">
                            <span>By {query.author?.username || "Unknown"}</span>
                            <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="query-tags">
                            {query.tags.map((tag, index) => (
                                <span key={index} className="tag">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        {user && user._id === query.author?._id && (
                            <div className="query-actions">
                                <button
                                    onClick={() => navigate(`/edit-query/${query._id}`)}
                                    className="edit-button"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => handleDeleteQuery(query._id, e)}
                                    className="delete-button query-card-delete"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {queries.length === 0 && (
                    <p className="no-queries">No queries found. Be the first to ask!</p>
                )}
            </div>
        </div>
    );
};

export default Home;
