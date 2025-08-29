import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL, APP_PREFIX_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";

const AddQuiz = () => {
  const [classData, setClassData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      errors: {},
    },
  ]);

  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    // Fetch classes
    axios
      .get(`${API_URL}/get_admin_classes?user_id=1`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) setClassData(res.data.class_arr || []);
      })
      .catch((err) => console.error(err));
  }, [token]);

  // Fetch subjects when class is selected
  const fetchSubjectsForClass = (classId) => {
    if (!classId) {
      setSubjectData([]);
      return;
    }
    axios
      .get(`${API_URL}/get_subjects_by_classid?class_id=${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) setSubjectData(res.data.subject_arr || []);
        else setSubjectData([]);
      })
      .catch((err) => {
        setSubjectData([]);
        console.error(err);
      });
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    newQuestions[index].errors.question = "";
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    if (newQuestions[qIndex].errors.options) {
      newQuestions[qIndex].errors.options[optIndex] = "";
    }
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].correctAnswer = value;
    newQuestions[index].errors.correctAnswer = "";
    setQuestions(newQuestions);
  };

  const addMoreQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: "", errors: {} },
    ]);
  };

  const validateForm = () => {
    let hasError = false;
    let errors = {};

    if (!selectedClass) {
      errors.class = "Please select a class";
      hasError = true;
    }
    if (!selectedSubject) {
      errors.subject = "Please select a subject";
      hasError = true;
    }

    const newQuestions = questions.map((q) => {
      const qErrors = {};
      if (!q.question.trim()) {
        qErrors.question = "Please enter a question";
        hasError = true;
      }
      qErrors.options = [];
      q.options.forEach((opt) => {
        if (!opt.trim()) {
          hasError = true;
          qErrors.options.push("Option cannot be empty");
        } else {
          qErrors.options.push("");
        }
      });
      if (!q.correctAnswer) {
        qErrors.correctAnswer = "Please select correct answer";
        hasError = true;
      }
      return { ...q, errors: qErrors };
    });

    setFormErrors(errors);
    setQuestions(newQuestions);
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Prepare formData
    const data = new FormData();
    data.append("class_id", selectedClass);
    data.append("subject_id", selectedSubject);

    questions.forEach((q, index) => {
      data.append(`questions[${index}][question]`, q.question);
      data.append(`questions[${index}][option1]`, q.options[0]);
      data.append(`questions[${index}][option2]`, q.options[1]);
      data.append(`questions[${index}][option3]`, q.options[2]);
      data.append(`questions[${index}][option4]`, q.options[3]);
      data.append(`questions[${index}][correct_answer]`, q.correctAnswer);
    });

    try {
      const res = await axios.post(`${API_URL}/add_quiz`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        navigate(`/${APP_PREFIX_PATH}/manage-quiz`);
      } else {
        alert(res.data.msg || "Failed to add quiz");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="container mt-5">
      <Breadcrumbs
        title="Add Quiz"
        items={[
          { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
          { label: "Manage Quiz", path: `/${APP_PREFIX_PATH}/quiz` },
          { label: "Add Quiz", path: `/${APP_PREFIX_PATH}/quiz/add` },
        ]}
      />

      <div className="mc-card">
        <form onSubmit={handleSubmit}>
          {/* Class and Subject */}
          <div className="row mb-4 flex-wrap">
            <div className="mb-3 form-group col-lg-6">
              <label htmlFor="class" className="form-label">Class</label>
              <select
                id="class"
                className="form-control"
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setFormErrors({ ...formErrors, class: "" });
                  setSelectedSubject(""); // reset subject
                  setSubjectData([]); // reset subject list
                  fetchSubjectsForClass(e.target.value); // fetch subjects for selected class
                }}
              >
                <option value="" disabled>Select Class</option>
                {classData.map((cls) => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name}
                  </option>
                ))}
              </select>
              {formErrors.class && <span className="text-danger">{formErrors.class}</span>}
            </div>

            <div className="mb-3 form-group col-lg-6">
              <label htmlFor="subject" className="form-label">Subject</label>
              <select
                id="subject"
                className="form-control"
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setFormErrors({ ...formErrors, subject: "" });
                }}
                disabled={!selectedClass || subjectData.length === 0}
              >
                <option value="" disabled>Select Subject</option>
                {subjectData.map((subj) => (
                  <option key={subj.subject_id} value={subj.subject_id}>
                    {subj.subject_name}
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
                <label htmlFor={`question-${i}`} className="form-label">Question</label>
                <textarea
                  id={`question-${i}`}
                  className="form-control"
                  rows={3}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(i, e.target.value)}
                  placeholder="Enter your question here"
                />
                {q.errors.question && <span className="text-danger">{q.errors.question}</span>}
              </div>

              {[0, 1, 2, 3].map((optIdx) => (
                <div key={optIdx} className="mb-3">
                  <label htmlFor={`option-${i}-${optIdx}`} className="form-label">
                    Option {String.fromCharCode(65 + optIdx)}
                  </label>
                  <input
                    id={`option-${i}-${optIdx}`}
                    type="text"
                    className="form-control"
                    value={q.options[optIdx]}
                    onChange={(e) => handleOptionChange(i, optIdx, e.target.value)}
                    placeholder={`Enter option ${String.fromCharCode(65 + optIdx)}`}
                  />
                  {q.errors.options && q.errors.options[optIdx] && (
                    <span className="text-danger">{q.errors.options[optIdx]}</span>
                  )}
                </div>
              ))}

              <div className="mb-3">
                <label htmlFor={`correctAnswer-${i}`} className="form-label">Correct Answer</label>
                <select
                  id={`correctAnswer-${i}`}
                  className="form-control"
                  value={q.correctAnswer}
                  onChange={(e) => handleCorrectAnswerChange(i, e.target.value)}
                >
                  <option value="" disabled>Select Correct Answer</option>
                  <option value="1">Option A</option>
                  <option value="2">Option B</option>
                  <option value="3">Option C</option>
                  <option value="4">Option D</option>
                </select>
                {q.errors.correctAnswer && <span className="text-danger">{q.errors.correctAnswer}</span>}
              </div>
            </div>
          ))}

          {/* <button type="button" className="btn btn-secondary mb-3" onClick={addMoreQuestion}>
            Add More Question
          </button>

          <button type="submit" className="btn btn-danger mb-3 mr-2">
            Submit Quiz
          </button> */}

          <div className="mb-3 d-flex gap-2">
            <button type="button" className="btn btn-outline-primary" onClick={addMoreQuestion}>
              Add More Question
            </button>
            <button type="submit" className="btn btn-danger">
              Submit Quiz
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddQuiz;
