 const newExamBtn: HTMLElement | null = document.getElementById('newExamBtn');
  const examForm: HTMLFormElement | null = document.getElementById('examForm') as HTMLFormElement;
  if (newExamBtn && examForm) {
    newExamBtn.addEventListener('click', () => {
      examForm.style.display = examForm.style.display === 'none' ? 'block' : 'none';
    });
    examForm.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      const formData: FormData = new FormData(examForm);
      const data: ExamFormData = {
        course: formData.get('course') as string,
        year: Number(formData.get('year')),
        rankings: JSON.parse(formData.get('rankings') as string)
      };
      try {
        const response: Response = await fetch('/api/exams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ${token}'
          },
          body: JSON.stringify(data)
        });
        const result: { message?: string } = await response.json();
        if (response.ok) {
          alert('Exam created successfully');
          window.location.reload();
        } else {
          alert(result.message || 'Failed to create exam');
        }
      } catch (error) {
        alert('Failed to create exam: Network error');
      }
    });
  };
