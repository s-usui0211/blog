import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Box,
    Divider,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../../contexts/AuthContext';
import DeleteDialog from './DeleteDialog';

interface Article {
    id: number;
    title: string;
    content: string;
    created_at: string;
    author?: {
        id: number;
        username: string;
    };
}

const ArticleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [article, setArticle] = useState<Article | null>(null);
    const [error, setError] = useState<string>('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchArticle = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/articles/${id}`);
            setArticle(response.data);
        } catch (error) {
            console.error('Error fetching article:', error);
            setError('記事の取得に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArticle();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/articles/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            navigate('/');
        } catch (error) {
            console.error('Error deleting article:', error);
            setError('記事の削除に失敗しました。');
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    const isAuthor = user && article && user.id === article.author?.id;

    if (isLoading) {
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
        <Container>
            <Paper sx={{ p: 4, mt: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {article.title}
                    </Typography>
                    {isAuthor && (
                        <Box>
                            <Tooltip title="記事を編集">
                                <IconButton 
                                    onClick={() => navigate(`/articles/${id}/edit`)}
                                    color="primary"
                                    aria-label="edit"
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="記事を削除">
                                <IconButton 
                                    onClick={() => setDeleteDialogOpen(true)}
                                    color="error"
                                    aria-label="delete"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Box>
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

            <DeleteDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title={article.title}
            />
        </Container>
    );
};

export default ArticleDetail;
