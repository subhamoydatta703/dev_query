import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateQuery.css";

const EditQuery = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuery();
    }, [id]);

    const fetchQuery = async () => {
        try {
            const { data } = await axios.get(`/queries/${id}`);
            setTitle(data.title);
            setDescription(data.description);
            setTags(data.tags.join(", "));
            setLoading(false);
        } catch (err) {
            setError("Failed to load query");
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const tagsArray = tags.split(",").map((tag) => tag.trim()).filter(tag => tag);
            await axios.put(`/queries/${id}`, { title, description, tags: tagsArray });
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update query");
        }
    };

    if (loading) return <div className="create-query-container">Loading...</div>;

    return (
        <div className="create-query-container">
            <div className="create-query-box">
                <h1 className="create-query-title">Edit Question</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="input-field"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What's your question?"
                            required
                            maxLength={150}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="input-field textarea-large"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide more details..."
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Tags (comma separated)</label>
                        <input
                            type="text"
                            className="input-field"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="react, javascript, css"
                        />
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="btn-cancel"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Update Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditQuery;
