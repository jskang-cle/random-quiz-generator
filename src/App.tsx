import { useState, useEffect, ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles

// Define Question type
type Question = {
  title: string;
  images: string[];
};

const RandomQuestionGenerator = () => {
  const [questions, setQuestions] = useState<Question[]>(JSON.parse(localStorage.getItem("questions") || "[]"));
  const [title, setTitle] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [displayedQuestions, setDisplayedQuestions] = useState<number[]>([]);

  // Save questions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  // Handle title input
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Handle image uploads
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files: File[] = Array.from(e.target.files);
      const fileUrls = files.map((file) => URL.createObjectURL(file));
      setImages([...images, ...fileUrls]);
    }
  };

  // Add a new question
  const handleAddQuestion = () => {
    if (title && images.length > 0) {
      const newQuestion = { title, images };
      setQuestions([...questions, newQuestion]);
      setTitle("");
      setImages([]);
    } else {
      alert("Please add a title and at least one image.");
    }
  };

  // Delete a single question
  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // Delete all questions
  const handleDeleteAllQuestions = () => {
    if (window.confirm("Are you sure you want to delete all questions?")) {
      setQuestions([]);
    }
  };

  // Start the quiz
  const handleStartQuiz = () => {
    if (questions.length === 0) {
      alert("No questions available. Add some first!");
      return;
    }
    setCurrentQuestionIndex(0);
    setDisplayedQuestions([0]);
  };

  // Move to the next question
  const handleNextQuestion = () => {
    if (displayedQuestions.length === questions.length) {
      alert("You have gone through all questions!");
      return;
    }

    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * questions.length);
    } while (displayedQuestions.includes(nextIndex));

    setDisplayedQuestions([...displayedQuestions, nextIndex]);
    setCurrentQuestionIndex(nextIndex);
  };

  const finishQuiz = () => {
    setCurrentQuestionIndex(null);
    setDisplayedQuestions([]);
  };

  const getRandomImage = () => {
    if (currentQuestionIndex !== null && questions[currentQuestionIndex].images.length > 0) {
      const images = questions[currentQuestionIndex].images;
      const randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex];
    }
    throw new Error("No images available for the current question.");
  };

  return (
    <div className="container py-4">
      {currentQuestionIndex === null ? (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">Add a Question</h2>
              <div className="mb-3 d-flex align-items-center">
                <span className="me-2">Q{questions.length+1}.</span>
                <input
                  type="text"
                  placeholder="Enter question title"
                  value={title}
                  onChange={handleTitleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="form-control"
                  aria-label="Upload Images"
                />
              </div>
              <div className="mb-3">
                <div className="d-flex flex-wrap justify-content-between">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Selected Image ${index + 1}`}
                      className="img-thumbnail flex-fill"
                      style={{ maxWidth: "35vh" }}
                    />
                  ))}
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleAddQuestion}>
                Add Question
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <h2>All Questions</h2>
              <button className="btn btn-danger" onClick={handleDeleteAllQuestions}>
                Delete All Questions
              </button>
            </div>
            {questions.length === 0 ? (
              <p>No questions added yet.</p>
            ) : (
              questions.map((q, index) => (
                <div key={index} className="card mb-3">
                  <div className="card-body">
                    <h3 className="card-title">Q{index+1}. {q.title}</h3>
                    <div className="d-flex flex-wrap">
                      {q.images.map((img, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={img}
                          alt={`Question ${index + 1} Image ${imgIndex + 1}`}
                          className="img-thumbnail me-2"
                          style={{ width: "100px" }}
                        />
                      ))}
                    </div>
                    <button
                      className="btn btn-danger mt-3"
                      onClick={() => handleDeleteQuestion(index)}
                    >
                      Delete Question
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center">
            <button className="btn btn-success btn-lg" onClick={handleStartQuiz}>
              Start Quiz
            </button>
          </div>
        </>
      ) : (
        <div>
          <div className="card text-center mb-4">
            <div className="card-body">
              <h2 className="card-title">Current Question</h2>
              <h3>{questions[currentQuestionIndex].title}</h3>
              <img
                src={getRandomImage()}
                alt="Random Question"
                className="img-fluid my-3"
              />
            </div>
          </div>
          <div className="text-center">
            {displayedQuestions.length === questions.length ? (
              <button className="btn btn-danger btn-lg" onClick={finishQuiz}>
                Finish Quiz
              </button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={handleNextQuestion}>
                Next Question
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomQuestionGenerator;
