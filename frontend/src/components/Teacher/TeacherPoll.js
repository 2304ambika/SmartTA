// TeacherPoll.jsx
import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Grid, Button, TextField, Typography, Card, CardContent, IconButton } from '@mui/material';
import Sidebar from './Sidebar';
import io from 'socket.io-client';
import { BarChart } from '@mui/x-charts/BarChart';
import RolloverTooltip from '../RolloverTooltip';
import InfoIcon from '@mui/icons-material/Info';
import { generateNewQuizTooltips, pollCreationContent } from '../content';
import { url_backend } from '../../constant';

const socket = io(url_backend);

const TeacherPoll = () => {
  const [polls, setPolls] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState(1);

  useEffect(() => {
    const fetchPolls = async () => {
      const response = await fetch(url_backend+'/latest-polls');
      const data = await response.json();
      setPolls(data);
    };

    fetchPolls();

    socket.on('pollCreated', (newPolls) => {
      setPolls((prevPolls) => [...prevPolls, ...newPolls]);
    });

    socket.on('pollUpdated', (updatedPoll) => {
      setPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
      );
    });

    socket.on('pollEnded', (pollId) => {
      setPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === pollId ? { ...poll, status: 'ended' } : poll))
      );
    });

    return () => {
      socket.off('pollCreated');
      socket.off('pollUpdated');
      socket.off('pollEnded');
    };
  }, []);

  const handleCreatePoll = async () => {
    if (!prompt.trim()) {
      alert('Please enter a poll topic.');
      return;
    }

    const response = await fetch(url_backend+'/generate-poll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, count }),
    });

    const { polls } = await response.json();
    setPolls((prevPolls) => [...prevPolls, ...polls]);
  };

  const handleEndPoll = async (pollId) => {
    await fetch(url_backend+'/end-poll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pollId }),
    });
  };

  const renderBarChart = (poll) => {
    const totalResponses = Object.values(poll.responses).reduce((acc, val) => acc + val, 0);

    return (
      <Box sx={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <BarChart
          width={800}
          height={350}
          series={[
            {
              data: Object.values(poll.responses),
              id: 'responses',
              label: 'Responses',
            },
          ]}
          xAxis={[
            {
              data: Object.keys(poll.options).map((optionKey) => poll.options[optionKey]),
              scaleType: 'band',
            },
          ]}
        />
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-around' }}>
          {Object.values(poll.responses).map((value, index) => {
            const percentage = totalResponses > 0 ? ((value / totalResponses) * 100).toFixed(1) : 0;
            return (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2">{value} ({percentage}%)</Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Grid container>
        <Grid item xs={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={10}>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4">Poll Creation</Typography>
            <br></br>
            {/* <Typography variant="h6">Provide the topic/content for creating poll.</Typography> */}
            <Box>
            {/* <RolloverTooltip content={pollCreationContent.pollTopicField} arrow> */}
              <TextField
                label="Poll Topic"
                variant="outlined"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                fullWidth
              />
              {/* </RolloverTooltip> */}
              {/* <RolloverTooltip content={pollCreationContent.numberOfQuestionsField} arrow> */}
              <TextField
                label="Number of Questions"
                type="number"
                variant="outlined"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
              {/* </RolloverTooltip> */}
              {/* <RolloverTooltip content={pollCreationContent.generatePollButton} arrow> */}
              <Button variant="contained" color="primary" onClick={handleCreatePoll} sx={{ mt: 2 }}>
                Generate Poll
              </Button>
              <RolloverTooltip content={pollCreationContent.generatePollButton}>
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </RolloverTooltip>
              {/* </RolloverTooltip> */}
            </Box>
            {/* <RolloverTooltip content={pollCreationContent.pollCard} arrow> */}
            {polls.map((poll) => (
              <Card key={poll._id} sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h5">{poll.question}</Typography>
                  <Typography variant="subtitle1">
                    {poll.responses
                      ? `Total Responses: ${Object.values(poll.responses).reduce((a, b) => a + b, 0)}`
                      : 'No responses yet'}
                  </Typography>
                  {renderBarChart(poll)}
                  {poll.status === 'active' && (
                    // <RolloverTooltip content={pollCreationContent.endPollButton} arrow>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleEndPoll(poll._id)}
                      sx={{ mt: 2 }}
                    >
                      End Poll
                    </Button>
                    // </RolloverTooltip>
                  )}
                </CardContent>
              </Card>
            ))}
            {/* </RolloverTooltip> */}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherPoll;
