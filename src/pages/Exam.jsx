import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Exam() {
  const [timer, setTimer] = useState(60);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    socket.emit('startTimer');
    socket.on('timerUpdate', (timeLeft) => setTimer(timeLeft));
    socket.on('timeUp', () => alert('Time’s up for this question!'));

    return () => socket.disconnect();
  }, []);

  const fetchQuestion = async () => {
    const res = await fetch('http://localhost:5000/api/questions/random');
    const data = await res.json();
    setQuestion(data);
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  return (
    <div>
      <h1>Exam</h1>
      <p>Time Remaining: {timer}s</p>
      {question && (
        <div>
          <p>{question.question}</p>
          {question.options.map((option, index) => (
            <button key={index}>{option}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Exam;
