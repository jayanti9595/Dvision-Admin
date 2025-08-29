import React, { useState, useEffect } from 'react';
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { HiChevronLeft } from "react-icons/hi";

const base64_decode = (str) => {
  try {
    return atob(str);
  } catch (e) {
    return null;
  }
};

const ViewQuiz = () => {
  const { quiz_id } = useParams();
  const decodedQuizId = base64_decode(quiz_id);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!decodedQuizId) {
      setError('Invalid Quiz ID');
      setLoading(false);
      return;
    }

    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${API_URL}/get_quiz_by_id?quiz_id=${decodedQuizId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
        } else if (response.data.success && response.data.quiz) {
          setQuiz(response.data.quiz);
          setQuestions(response.data.questions || []);
        } else {
          setError('Quiz not found');
        }
      } catch (err) {
        setError('Failed to fetch quiz');
        console.error('Error fetching quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [decodedQuizId, navigate, token]);

  const breadcrumbItems = [
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Manage Quiz", path: `/${APP_PREFIX_PATH}/manage-quiz` },
    { label: "View Quiz", path: `/${APP_PREFIX_PATH}/view-quiz/${quiz_id}` },
  ];

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;
  if (!quiz) return <div className="container mt-5">No quiz data found</div>;

  return (
    <div className="container mt-5">
      <Breadcrumbs title="Quiz Details" items={breadcrumbItems} />
      <div className="mc-card">
        <div className="row mt-4 mb-4">
          <div className="col-lg-12">
            <h4 className='mb-4'>Quiz Info</h4>
            <div className="row mt-2">
              <div className="col-lg-3"><h6>Class:</h6></div>
              <div className="col-lg-9"><p>{quiz.class_name || "NA"}</p></div>
            </div>
            <div className="row mt-2">
              <div className="col-lg-3"><h6>Subject:</h6></div>
              <div className="col-lg-9"><p>{quiz.subject_name || "NA"}</p></div>
            </div>

            <hr />

            <h5 className='mb-3'>Questions:</h5>
            {questions.length > 0 ? (
              questions.map((q, index) => (
                <div key={q.question_id || index} className="mb-4 p-3 border rounded bg-light">
                  <h6>Q{index + 1}. {q.question}</h6>
                  <ol className="list-group list-group-numbered mt-3">
                    {[q.option1, q.option2, q.option3, q.option4].map((opt, idx) => (
                      <li
                        key={idx}
                        className={`list-group-item ${parseInt(q.correct_answer) === idx + 1 ? 'list-group-item-success' : ''}`}
                      >
                        {opt}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-2 text-success fw-bold">
                    Correct Answer: <span>{String.fromCharCode(64 + parseInt(q.correct_answer))}. {q[`option${q.correct_answer}`]}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No questions found for this quiz.</p>
            )}

            <div className="text-end mt-4">
              <Button
                variant="outline-danger"
                onClick={() => navigate(`/${APP_PREFIX_PATH}/manage-quiz`)}
              >
                <HiChevronLeft className="me-1" /> Back to Quiz List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQuiz;
