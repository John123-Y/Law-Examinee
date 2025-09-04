import axios, { AxiosResponse } from 'axios';
import Chart from 'chart.js/auto';

interface PerformanceReport {
  totalAttempts: number;
  correctAnswers: number;
  bySubject: { [key: string]: { total: number; correct: number } };
}

interface ApiResponse<T> {
  message?: string;
  report?: T;
}

document.addEventListener('DOMContentLoaded', async () => {
  const token: string | null = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to view analytics');
    window.location.href = '/api/auth/login';
    return;
  }

  try {
    const response: AxiosResponse<ApiResponse<PerformanceReport>> = await axios.get('/api/analytics/performance', {
      headers: {
        'Authorization': 'Bearer ${token}',
        'Content-Type': 'application/json'
      }
    });
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch performance data');
    }

    const { report } = response.data;
    const subjectChart: HTMLCanvasElement | null = document.getElementById('subjectChart') as HTMLCanvasElement;
    if (subjectChart && report) {
      const ctx: CanvasRenderingContext2D = subjectChart.getContext('2d')!;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(report.bySubject),
          datasets: [{
            label: 'Accuracy (%)',
            data: Object.values(report.bySubject).map((v: { total: number; correct: number }) => v.total ? (v.correct / v.total) * 100 : 0),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: { y: { beginAtZero: true, max: 100 } }
        }
      });
    }

    const topicResponse: AxiosResponse<string[]> = await axios.get('/api/user/questions/hot-topics', {
      headers: { 'Authorization': 'Bearer ${token}' }
    });
    if (topicResponse.status !== 200) {
      throw new Error(topicResponse.data.message || 'Failed to fetch hot topics');
    }

    const topics: string[] = topicResponse.data;
    const recommendations: HTMLElement | null = document.getElementById('recommendations');
    if (recommendations)  {
      const ul: HTMLUListElement | null = recommendations.querySelector('ul');
      if (ul)  { 
        topics.forEach((topic: string) => {
          const li: HTMLLIElement = document.createElement('li');
          li.textContent = topic;
          ul.appendChild(li);
        });
      }
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to load analytics: ' + error.message);
  }
});