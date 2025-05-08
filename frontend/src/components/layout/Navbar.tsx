import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    Container,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <AppBar position="static">
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            color: 'white',
                            textDecoration: 'none',
                        }}
                    >
                        Engineer Blog
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {isAuthenticated ? (
                            <>
                                <Typography
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mr: 2,
                                    }}
                                >
                                    {user?.username}
                                </Typography>
                                <Button
                                    component={RouterLink}
                                    to="/articles/create"
                                    color="inherit"
                                >
                                    記事を書く
                                </Button>
                                <Button color="inherit" onClick={handleLogout}>
                                    ログアウト
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    color="inherit"
                                >
                                    ログイン
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/register"
                                    color="inherit"
                                >
                                    新規登録
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
