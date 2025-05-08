import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Box,
    Alert,
} from '@mui/material';
import axios from 'axios';

const CreateArticle: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('認証が必要です');
            }

            await axios.post(
                'http://localhost:8000/api/articles',
                {
                    title,
                    content,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.detail || '記事の作成に失敗しました');
        }
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    新規記事作成
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="タイトル"
                        variant="outlined"
                        fullWidth
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        label="本文"
                        variant="outlined"
                        fullWidth
                        required
                        multiline
                        rows={10}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        sx={{ mb: 3 }}
                        helperText="Markdown形式で記述できます"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        投稿する
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateArticle;
