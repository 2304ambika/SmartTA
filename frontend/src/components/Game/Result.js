import React, { useState, useEffect, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Result = () => {
    const location = useLocation();
    const [state, setState] = useState({
        score: 0,
        numberOfQuestions: 0,
        numberOfAnsweredQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        hintsUsed: 0,
        fiftyFiftyUsed: 0
    });

    useEffect(() => {
        const locationState = location.state;
        if (locationState) {
            setState({
                score: (locationState.score / locationState.numberOfQuestions) * 100,
                numberOfQuestions: locationState.numberOfQuestions,
                numberOfAnsweredQuestions: locationState.numberOfAnsweredQuestions,
                correctAnswers: locationState.correctAnswers,
                wrongAnswers: locationState.wrongAnswers,
                hintsUsed: locationState.hintsUsed,
                fiftyFiftyUsed: locationState.fiftyFiftyUsed
            });
        }
    }, [location.state]);

    console.log(state.numberOfQuestions);
    const userScore = state.score;
    let remark;

    if (userScore <= 30) {
        remark = 'You need more practice!';
    } else if (userScore > 30 && userScore <= 50) {
        remark = 'Better luck next time!';
    } else if (userScore <= 70 && userScore > 50) {
        remark = 'You can do better!';
    } else if (userScore >= 71 && userScore <= 84) {
        remark = 'You did great!';
    } else {
        remark = 'You\'re an absolute genius!';
    }

    const stats = location.state ? (
        <Fragment>
            <Box textAlign="center">
                <CheckCircleOutlineIcon style={{ fontSize: 80, color: '#4caf50' }} />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Quiz has ended
            </Typography>
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    {remark}
                </Typography>
                <Typography variant="h4" component="h2" gutterBottom>
                    Your Score: {state.score.toFixed(0)}%
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="Total number of questions" secondary={state.numberOfQuestions} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="Number of attempted questions" secondary={state.numberOfAnsweredQuestions} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="Number of Correct Answers" secondary={state.correctAnswers} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="Number of Wrong Answers" secondary={state.wrongAnswers} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="Hints Used" secondary={state.hintsUsed} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="50-50 Used" secondary={state.fiftyFiftyUsed} />
                    </ListItem>
                </List>
            </Paper>
            <Box>
                <Button variant="contained" color="primary" component={Link} to="/play/game" sx={{ marginRight: 2 }}>
                    Play Again
                </Button>
                <Button variant="outlined" color="secondary" component={Link} to="/attempt-game">
                    Back to Start Page
                </Button>
            </Box>
        </Fragment>
    ) : (
        <Box textAlign="center">
            <Typography variant="h4" component="h1" gutterBottom>
                No Statistics Available
            </Typography>
            <Box>
                <Button variant="contained" color="primary" component={Link} to="/play/game" sx={{ marginRight: 2 }}>
                    Take a Quiz
                </Button>
                <Button variant="outlined" color="secondary" component={Link} to="/attempt-game">
                    Back to Start Page
                </Button>
            </Box>
        </Box>
    );

    return (
        <Fragment>
            <Helmet><title>Game Report</title></Helmet>
            <div className="game-report">
                {stats}
            </div>
        </Fragment>
    );
};

export default Result;
