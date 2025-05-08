import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

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
    const { isAuthenticated } = useAuth();

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
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1">
                    記事一覧
                </Typography>
                {isAuthenticated && (
                    <Button
                        component={RouterLink}
                        to="/articles/create"
                        variant="contained"
                        color="primary"
                    >
                        新規記事作成
                    </Button>
                )}
            </Box>
            <Grid container spacing={3}>
                {articles.map((article) => (
                    <Grid item xs={12} sm={6} md={4} key={article.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    {article.title}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    作成者: {article.author?.username || '匿名ユーザー'}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    {new Date(article.created_at).toLocaleDateString()}
                                </Typography>
                                <Button
                                    component={RouterLink}
                                    to={`/articles/${article.id}`}
                                    variant="outlined"
                                    color="primary"
                                    sx={{ mt: 1 }}
                                >
                                    詳細を見る
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ArticleList;
