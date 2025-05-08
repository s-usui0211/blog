import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
} from '@mui/material';
import axios from 'axios';

interface Article {
    id: number;
    title: string;
    content: string;
    created_at: string;
    author: {
        username: string;
    };
}

const ArticleList: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/articles');
                setArticles(response.data);
            } catch (error) {
                console.error('Error fetching articles:', error);
                setArticles([]); // エラー時は空の配列を設定
            }
        };

        fetchArticles();
    }, []);

    return (
        <Container>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1">
                    記事一覧
                </Typography>
            </Box>
            <Grid container spacing={3}>
                {articles.map((article) => (
                    <Grid item xs={12} key={article.id}>
                        <Card
                            component={RouterLink}
                            to={`/articles/${article.id}`}
                            sx={{
                                textDecoration: 'none',
                                color: 'inherit',
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <CardContent
                                sx={{
                                    border: '1px solid rgba(0, 0, 0, 0.12)',
                                    borderRadius: '4px',
                                    backgroundColor: 'background.paper',
                                }}>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    {article.title}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    作成者: {article.author?.username || '不明なユーザー'}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    {new Date(article.created_at).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ArticleList;
