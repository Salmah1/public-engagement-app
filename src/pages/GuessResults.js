import { useEffect, useRef, useState } from "react";
import "../styles/Quiz.css";
import "../styles/Guess.css";
import AccessibilityPanel from "../components/AccessibilityPanel";

// Fallback if API fails or times out
const fallbackResult = {
  age: "20-30",
  hobby: "Painting",
  personality: "Thoughtful",
};

function GuessResults({
  answers,
  setGuessFeedback,
  restartGuess,
  goNext,
  ...accessibilityProps
}) {
  const [result, setResult] = useState(null); // Stores AI result
  const [loading, setLoading] = useState(true); // Tracks loading state when fetching
  const [feedback, setFeedback] = useState(null); // Stores user feedback
  const [showAnswers, setShowAnswers] = useState(false);
  const hasFetched = useRef(false); // Prevents duplicate API calls

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    // Fetch AI guess from backend
    const fetchGuess = async () => {
      try {
        const res = await fetch(
          "https://public-engagement-app.onrender.com/guess",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers }),
          },
        );

        if (!res.ok) {
          throw new Error("Server error");
        }

        const data = await res.json();

        // Validate response before using it
        if (data.age && data.hobby && data.personality) {
          setResult(data);
        } else {
          setResult(fallbackResult);
        }
      } catch (error) {
        console.log("Error:", error.message);
        setResult(fallbackResult);
      }
      setLoading(false);
    };

    fetchGuess();
  }, [answers]);

  // Saves user feedback and passes it up
  const handleFeedback = (value) => {
    setFeedback(value);
    setGuessFeedback(value);
  };

  return (
    <div className="screen">
      <div className="card-container results-container">
        <div className="card-row">
          <div className="card-title">
            <div className="left">🔮 AI Guess</div>
          </div>

          <div className="progress-pill">Results</div>

          <AccessibilityPanel {...accessibilityProps} />
        </div>

        {loading ? (
          <div className="info-section final-container">
            <div className="guess-icon">🔮</div>

            <p className="loading-text" aria-live="polite">
              AI is looking at your answers
            </p>

            <div className="loading-animation" aria-hidden="true">
              <span className="loading-icon"></span>
              <span className="loading-icon"></span>
              <span className="loading-icon"></span>
            </div>
          </div>
        ) : (
          <div className="info-section final-container">
            <h3>AI guessed</h3>

            <div className="guess-row">
              <span className="guess-label">🎂 Age group</span>
              <strong>{result.age}</strong>
            </div>

            <div className="guess-row">
              <span className="guess-label">🎨 Hobby</span>
              <strong>{result.hobby}</strong>
            </div>

            <div className="guess-row">
              <span className="guess-label">✨ Personality</span>
              <strong>{result.personality}</strong>
            </div>
          </div>
        )}

        <div className="info-section final-container">
          <h3>Why did AI guess this?</h3>

          <div className="row-item">
            <span>💡</span>
            <p>
              It does not actually know you. It makes guesses from patterns, and
              those guesses can be unfair or wrong.
            </p>
          </div>
        </div>

        {/* Feedback section */}
        <div className="info-section guess-section final-container">
          <h3>Was the AI right?</h3>

          {!feedback ? (
            <div className="feedback-btn">
              <button
                className="guess-feedback-btn"
                onClick={() => handleFeedback("yes")}
                disabled={loading || !result}
              >
                👍 Yes
              </button>

              <button
                className="guess-feedback-btn"
                onClick={() => handleFeedback("no")}
                disabled={loading || !result}
              >
                👎 No
              </button>
            </div>
          ) : (
            <div className="row-item">
              <span>{feedback === "yes" ? "👍" : "👎"}</span>
              <p>
                {feedback === "yes"
                  ? "Nice! Looks like AI got a pretty good read on you."
                  : "That's okay! AI is still learning, it doesn't always get it right."}
              </p>
            </div>
          )}
        </div>

        <button
          className="text-btn"
          onClick={() => setShowAnswers(!showAnswers)}
        >
          {showAnswers ? "Hide answers" : "See answers"}
        </button>

        {showAnswers && (
          <div className="info-section answers-breakdown">
            <h3>Your answers</h3>

            {answers.map((item, i) => (
              <div className="breakdown-row" key={i}>
                <div className="breakdown-title">
                  <span>🔮</span>
                  <strong>Question {i + 1}</strong>
                </div>

                <p className="breakdown-question">{item.question}</p>

                <p className="breakdown-answer">
                  Your answer: <strong>{item.selectedAnswer}</strong>
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          className="btn"
          onClick={goNext}
          disabled={loading || !result || !feedback}
        >
          Continue
        </button>

        <button
          className="secondary-btn"
          onClick={restartGuess}
          disabled={loading || !result || !feedback}
        >
          Replay
        </button>
      </div>
    </div>
  );
}

export default GuessResults;
