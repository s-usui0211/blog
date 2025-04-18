import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

function ArticleList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/articles/');
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {articles.map((article) => (
          <Grid item xs={12} md={6} key={article.id}>
            <Card>
              <CardActionArea component={RouterLink} to={`/articles/${article.id}`}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(article.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ArticleList;
