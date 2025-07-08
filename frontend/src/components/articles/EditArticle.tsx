import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';

interface Article {
    id: number;
    title: string;
    content: string;
}

const EditArticle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/articles/${id}`);
                setArticle(response.data);
            } catch (err) {
                setError('記事の取得に失敗しました。');
                console.error('Error fetching article:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!article) return;

        try {
            await axios.put(`http://localhost:8000/api/articles/${id}`, {
                title: article.title,
                content: article.content,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            navigate(`/articles/${id}`);
        } catch (err) {
            setError('記事の更新に失敗しました。');
            console.error('Error updating article:', err);
        }
    };

    if (loading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error || !article) {
        return (
            <Container>
                <Typography color="error" sx={{ mt: 4 }}>
                    {error || '記事が見つかりません。'}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    記事を編集
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        label="タイトル"
                        value={article.title}
                        onChange={(e) => setArticle({ ...article, title: e.target.value })}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="本文"
                        value={article.content}
                        onChange={(e) => setArticle({ ...article, content: e.target.value })}
                        margin="normal"
                        multiline
                        rows={10}
                        required
                    />
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(-1)}
                        >
                            キャンセル
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            更新する
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default EditArticle;
