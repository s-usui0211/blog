import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Box,
    Divider,
} from '@mui/material';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Article {
    id: number;
    title: string;
    content: string;
    created_at: string;
    author?: {
        username: string;
    };
}

const ArticleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/articles/${id}`);
                setArticle(response.data);
            } catch (error) {
                console.error('Error fetching article:', error);
                setError('記事の取得に失敗しました。');
            }
        };

        fetchArticle();
    }, [id]);

    if (error) {
        return (
            <Container>
                <Typography color="error" sx={{ mt: 4 }}>
                    {error}
                </Typography>
            </Container>
        );
    }

    if (!article) {
        return (
            <Container>
                <Typography sx={{ mt: 4 }}>読み込み中...</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {article.title}
                </Typography>
                <Box sx={{ mb: 3 }}>
                    <Typography color="textSecondary">
                        作成者: {article.author?.username || '不明なユーザー'}
                    </Typography>
                    <Typography color="textSecondary">
                        {new Date(article.created_at).toLocaleDateString()}
                    </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{
                    typography: 'body1',
                    '& table': {
                        borderCollapse: 'collapse',
                        width: '100%',
                        margin: '1rem 0',
                        border: '1px solid #dee2e6',
                    },
                    '& th, & td': {
                        border: '1px solid #dee2e6',
                        padding: '0.5rem',
                        textAlign: 'left',
                    },
                    '& th': {
                        backgroundColor: '#f8f9fa',
                        fontWeight: 600,
                    },
                }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
                </Box>
            </Paper>
        </Container>
    );
};

export default ArticleDetail;
