// StudentPoll.jsx
import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Grid, Button, Typography, Card, CardContent, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import io from 'socket.io-client';
import { url_backend } from '../../constant';
import RolloverTooltip from '../RolloverTooltip';
import { studentPollParticipationContent } from '../content';
import StudentSidebar from './StudentSidebar';

const socket = io(url_backend);

const StudentPoll = () => {
  const [polls, setPolls] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchPolls = async () => {
      const response = await fetch(url_backend+'/latest-polls');
      const data = await response.json();
      setPolls(data);
    };

    fetchPolls();

    socket.on('pollUpdated', (updatedPoll) => {
      setPolls((prevPolls) => prevPolls.map(poll => poll._id === updatedPoll._id ? updatedPoll : poll));
    });

    socket.on('pollEnded', () => {
      setSubmitted(true);
    });

    return () => {
      socket.off('pollUpdated');
      socket.off('pollEnded');
    };
  }, []);

  const handleOptionChange = (pollId, option) => {
    setSelectedOptions(prev => ({ ...prev, [pollId]: option }));
  };

  const handleSubmit = async () => {
    await Promise.all(Object.keys(selectedOptions).map(async pollId => {
      const selectedOption = selectedOptions[pollId];
      await fetch(url_backend+'/submit-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pollId, selectedOption }),
      });
    }));
    setSubmitted(true);
  };

  if (submitted) {
    return <Typography variant="h5">Poll has ended. Thank you for your participation!</Typography>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Grid container>
        <Grid item xs={2}>
          <StudentSidebar />
        </Grid>
        <Grid item xs={10}>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }} >
          <Typography variant="h4">Attempt the Poll</Typography>
          <RolloverTooltip content={studentPollParticipationContent.pollCard} arrow>
            {polls.map((poll) => (
              <Card key={poll._id} sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h5">{poll.question}</Typography>
                  <RadioGroup
                    value={selectedOptions[poll._id] || ''}
                    onChange={(event) => handleOptionChange(poll._id, event.target.value)}
                  >
                    {Object.entries(poll.options).map(([key, value], index) => (
                      <FormControlLabel key={index} value={value} control={<Radio />} label={value} />
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}
            </RolloverTooltip>
            <RolloverTooltip content={studentPollParticipationContent.submitButton} arrow>
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
              Submit All Answers
            </Button>
            </RolloverTooltip>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentPoll;

