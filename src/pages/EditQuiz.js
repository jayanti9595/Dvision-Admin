import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { decode as base64_decode } from "base-64";
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";

const EditQuiz = () => {
  const { quiz_id } = useParams();
  const decodedQuizId = base64_decode(quiz_id);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const [classData, setClassData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch quiz data and class list
    axios
      .get(`${API_URL}/get_quiz_by_id?quiz_id=${decodedQuizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        if (res.data.success) {
          const quiz = res.data.quiz;
          setSelectedClass(quiz.class_id);
          const loaded = res.data.questions.map((q) => ({
            question: q.question,
            options: [q.option1, q.option2, q.option3, q.option4],
            correctAnswer: String(q.correct_answer),
            errors: {},
          }));
          setQuestions(loaded);
          // Fetch class list
          const classRes = await axios.get(`${API_URL}/get_admin_classes?user_id=1`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (classRes.data.success) setClassData(classRes.data.class_arr || []);
          // Fetch subjects for the quiz's class and set subject after subjects are loaded
          await fetchSubjectData(quiz.class_id, quiz.subject_id);
        } else {
          alert("Failed to load quiz");
          navigate(`/${APP_PREFIX_PATH}/manage-quiz`);
        }
      })
      .catch(() => {
        alert("Error loading quiz");
        navigate(`/${APP_PREFIX_PATH}/manage-quiz`);
      })
      .finally(() => setLoading(false));
  }, [decodedQuizId, token, navigate]);

  // Fetch subjects for a given class and optionally set selected subject
  const fetchSubjectData = async (classId, subjectIdToSet = null) => {
    if (!classId) {
      setSubjectData([]);
      setSelectedSubject("");
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/get_subjects_by_classid?class_id=${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjectData(res.data.subject_arr || []);
      if (subjectIdToSet) setSelectedSubject(subjectIdToSet);
    } catch (error) {
      setSubjectData([]);
      setSelectedSubject("");
    }
  };

  const handleQuestionChange = (i, val) => {
    const copy = [...questions];
    copy[i].question = val;
    copy[i].errors.question = "";
    setQuestions(copy);
  };
  const handleOptionChange = (qi, oi, val) => {
    const copy = [...questions];
    copy[qi].options[oi] = val;
    if (copy[qi].errors.options) copy[qi].errors.options[oi] = "";
    setQuestions(copy);
  };
  const handleCorrectChange = (i, val) => {
    const copy = [...questions];
    copy[i].correctAnswer = val;
    copy[i].errors.correctAnswer = "";
    setQuestions(copy);
  };
  const addMoreQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: "", errors: {} },
    ]);
  };

  const validateForm = () => {
    let hasError = false;
    let errs = {};
    if (!selectedClass) {
      errs.class = "Please select a class";
      hasError = true;
    }
    if (!selectedSubject) {
      errs.subject = "Please select a subject";
      hasError = true;
    }

    const qcopy = questions.map((q) => {
      const qe = {};
      if (!q.question.trim()) {
        qe.question = "Enter question";
        hasError = true;
      }
      qe.options = q.options.map((o) => {
        if (!o.trim()) {
          hasError = true;
          return "Cannot be empty";
        }
        return "";
      });
      if (!q.correctAnswer) {
        qe.correctAnswer = "Select correct answer";
        hasError = true;
      }
      return { ...q, errors: qe };
    });

    setFormErrors(errs);
    setQuestions(qcopy);
    return !hasError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("quiz_id", decodedQuizId);
    data.append("class_id", selectedClass);
    data.append("subject_id", selectedSubject);

    questions.forEach((q, i) => {
      data.append(`questions[${i}][question]`, q.question);
      q.options.forEach((opt, oi) => {
        data.append(`questions[${i}][option${oi + 1}]`, opt);
      });
      data.append(`questions[${i}][correct_answer]`, q.correctAnswer);
    });

    axios
      .post(`${API_URL}/edit_quiz`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          navigate(`/${APP_PREFIX_PATH}/manage-quiz`);
        } else {
          alert(res.data.msg || "Update failed");
        }
      })
      .catch(() => alert("Error updating quiz"));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <Breadcrumbs
        title="Edit Quiz"
        items={[
          { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
          { label: "Manage Quiz", path: `/${APP_PREFIX_PATH}/quiz` },
          { label: "Edit Quiz", path: `/${APP_PREFIX_PATH}/quiz/edit/${decodedQuizId}` },
        ]}
      />
      <div className="mc-card">
        <form onSubmit={handleSubmit}>
          {/* Class/Subject selectors */}
          <div className="row mb-4 flex-wrap">
            <div className="col-lg-6 mb-3">
              <label>Class</label>
              <select
                className="form-control"
                value={selectedClass}
                onChange={async (e) => {
                  setSelectedClass(e.target.value);
                  setFormErrors({ ...formErrors, class: "" });
                  setSelectedSubject(""); // reset subject
                  setSubjectData([]); // reset subject list
                  await fetchSubjectData(e.target.value); // fetch subjects for selected class
                }}
              >
                <option value="">Select Class</option>
                {classData.map((c) => (
                  <option key={c.class_id} value={c.class_id}>
                    {c.class_name}
                  </option>
                ))}
              </select>
              {formErrors.class && <span className="text-danger">{formErrors.class}</span>}
            </div>
            <div className="col-lg-6 mb-3">
              <label>Subject</label>
              <select
                className="form-control"
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setFormErrors({ ...formErrors, subject: "" });
                }}
                disabled={!selectedClass || subjectData.length === 0}
              >
                <option value="">Select Subject</option>
                {subjectData.map((s) => (
                  <option key={s.subject_id} value={s.subject_id}>
                    {s.subject_name}
                  </option>
                ))}
              </select>
              {formErrors.subject && <span className="text-danger">{formErrors.subject}</span>}
            </div>
          </div>

          {/* Questions */}
          {questions.map((q, i) => (
            <div key={i} className="border p-3 mb-3 rounded">
              <h5>Question {i + 1}</h5>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows={2}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(i, e.target.value)}
                  placeholder="Enter question"
                />
                {q.errors.question && <span className="text-danger">{q.errors.question}</span>}
              </div>
              {q.options.map((o, oi) => (
                <div key={oi} className="mb-3">
                  <input
                    type="text"
                    className="form-control mb-1"
                    value={o}
                    onChange={(e) => handleOptionChange(i, oi, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                  />
                  {q.errors.options && q.errors.options[oi] && (
                    <span className="text-danger">{q.errors.options[oi]}</span>
                  )}
                </div>
              ))}
              <div className="mb-3">
                <label>Correct Answer</label>
                <select
                  className="form-control"
                  value={q.correctAnswer}
                  onChange={(e) => handleCorrectChange(i, e.target.value)}
                >
                  <option value="">Select Correct</option>
                  {[1, 2, 3, 4].map((v) => (
                    <option key={v} value={String(v)}>
                      Option {String.fromCharCode(64 + v)}
                    </option>
                  ))}
                </select>
                {q.errors.correctAnswer && (
                  <span className="text-danger">{q.errors.correctAnswer}</span>
                )}
              </div>
            </div>
          ))}
          {/* <button type="button" className="btn btn-secondary mb-3" onClick={addMoreQuestion}>
            Add More Question
          </button>
          <button type="submit" className="btn btn-primary">Update Quiz</button> */}

          <div className="mb-3 d-flex gap-2">
            <button type="button" className="btn btn-outline-primary" onClick={addMoreQuestion}>
              Add More Question
            </button>
            <button type="submit" className="btn btn-danger">
              Update Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuiz;
