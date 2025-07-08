import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import PrivateRoute from './components/auth/PrivateRoute';
import ArticleList from './components/articles/ArticleList';
import ArticleDetail from './components/articles/ArticleDetail';
import CreateArticle from './components/articles/CreateArticle';
import EditArticle from './components/articles/EditArticle';

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
            <Layout>
            <Routes>
                <Route path="/" element={<ArticleList />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/articles/:id" element={<ArticleDetail />} />
                <Route
                path="/articles/create"
                element={
                    <PrivateRoute>
                    <CreateArticle />
                    </PrivateRoute>
                }
                />
                <Route
                    path="/articles/:id/edit"
                    element={
                        <PrivateRoute>
                            <EditArticle />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
