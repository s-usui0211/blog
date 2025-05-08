import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import PrivateRoute from './components/auth/PrivateRoute';
import ArticleList from './components/articles/ArticleList';
import ArticleDetail from './components/articles/ArticleDetail';
import CreateArticle from './components/articles/CreateArticle';
import Layout from './components/layout/Layout';

const App: React.FC = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/" element={<ArticleList />} />
                <Route path="/articles/:id" element={<ArticleDetail />} />
                <Route
                    path="/articles/create"
                    element={
                        <PrivateRoute>
                            <CreateArticle />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Layout>
    );
};

export default App;
