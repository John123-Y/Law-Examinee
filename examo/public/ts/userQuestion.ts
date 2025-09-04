// public/js/userQuestion.ts
import axios, { AxiosResponse } from 'axios';

// Interface for API responses
interface ApiResponse {
  message: string | string[];
  data?: {
    question: {
      _id: string;
      question: string;
      options: string[];
      correctAnswer: string;
      caseStudy?: string;
      explanation?: string;
    };
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const token: string | null = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to practice questions');
    window.location.href = '/api/auth/login';
    return;
  }

  const questionForm: HTMLFormElement | null = document.getElementById('questionForm') as HTMLFormElement;
  const questionsDiv: HTMLElement | null = document.getElementById('questions');

  // Helper function to format message for display
  const formatMessage = (message: string | string[]): string => {
    return Array.isArray(message) ? message.join(', ') : message;
  };

  const loadQuestion = async (): Promise<void> => {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.get('/api/user/questions', {
        headers: { Authorization: Bearer ${token} }
      });
      if (questionsDiv && response.data.data?.question) {
        const { question, options, caseStudy } = response.data.data.question;
        questionsDiv.innerHTML = 
          ${caseStudy ? <p><strong>Case Study:</strong> ${caseStudy}</p> : ''}
          <p><strong>Question:</strong> ${question}</p>
          <form id="answerForm">
            ${options.map((opt: string, i: number) => 
              <label>
                <input type="radio" name="answer" value="${opt}" required>
                ${opt}
              </label><br>
            ).join('')}
            <button type="submit">Submit Answer</button>
          </form>
        ;
      }
    } catch (error: any) {
      alert(formatMessage(error.response?.data?.message || 'Failed to load question'));
    }
  };

  if (questionForm) {
    questionForm.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      const formData: FormData = new FormData(questionForm);
      const answer: string | null = formData.get('answer') as string | null;
      try {
        const response: AxiosResponse<ApiResponse> = await axios.post('/api/user/questions', { answer }, {
          headers: { Authorization: Bearer ${token} }
        });
        alert(formatMessage(response.data.message));
        await loadQuestion(); // Load next question
      } catch (error: any) {
        alert(formatMessage(error.response?.data?.message || 'Failed to submit answer'));
      }
    });
  }

  loadQuestion();
});