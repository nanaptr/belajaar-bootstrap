import http from 'k6/http';
import { check, sleep } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { writeCSV } from 'https://jslib.k6.io/k6-reporter/0.1.0/index.js';


export const options = {
  vus: 10, // Jumlah Virtual User
  duration: '30s', // Durasi Testing
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% request harus di bawah 500ms
    http_req_failed: ['rate<0.01'], // Error rate harus di bawah 1%
  },
};

export default function () {
  const url = 'https://api/login';
  const payload = JSON.stringify({
    email: 'nabila',
    password: 'test123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  resultData.push({
    url: url,
    status: res.status,
    duration: res.timings.duration,
    success: res.status === 200 ? 'YES' : 'NO',
  });

  check(res, {
    'status code 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
    'body contains token': (r) => r.json('token') !== '',
  });

  sleep(1); // Delay antar request
}

export function handleSummary(data) {
    writeCSV('result.csv', resultData);
    return {
      'stdout': textSummary(data, { indent: '', enableColors: false }),
    };
  }
  
