import { useState } from "react";
import "../styles/Output.css";
import "../styles/Quiz.css";
import AccessibilityPanel from "../components/AccessibilityPanel";

function Output({
  goNext,
  restartOutput,
  setLatestOutputIdea,
  setLatestOutputImage,
  ...accessibilityProps
}) {
  // Output states
  const [step, setStep] = useState("intro"); // Controls which step is shown
  const [userIdea, setUserIdea] = useState(""); // Stores the user's input

  const [generatedImage, setGeneratedImage] = useState(""); // Stores generated image from backend
  const [loading, setLoading] = useState(false); // Tracks whether image is being generated

  const [error, setError] = useState("");

  const isValidIdea = (text) => {
    const trimmed = text.trim();

    if (!trimmed) {
      return "";
    }

    if (!/^[a-zA-Z0-9\s.,;:'’`“”!?+\-()—]+$/.test(trimmed)) {
      return "Please avoid special characters.";
    }

    // Must be at least 10 characters
    if (trimmed.length < 10) return "Please write at least 10 characters.";

    // Must be at least 3 words
    if (trimmed.split(/\s+/).length < 3) {
      return "Please write at least 3 words.";
    }

    return "";
  };

  const errorMessage = isValidIdea(userIdea);
  const isValid = userIdea.trim() !== "" && !errorMessage;

  // Sends the user's userIdea to the backend and displays generated image
  const handleGenerate = async () => {
    const validationError = isValidIdea(userIdea);

    if (validationError || !userIdea.trim()) {
      setError(
        validationError ||
          "Please type an idea or select one of the options above.",
      );
      return;
    }
    // Move to output page
    setStep("output");
    setLoading(true);
    setError("");
    setGeneratedImage("");

    try {
      // Send request to backend
      const res = await fetch(
        "https://public-engagement-app.onrender.com/output",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userIdea }),
        },
      );

      if (!res.ok) {
        throw new Error("Server error");
      }

      // Convert response to JSON
      const data = await res.json();

      if (!data.image) {
        throw new Error("No image returned");
      }

      // Save returned image and user input to state
      setGeneratedImage(data.image);
      setLatestOutputIdea(userIdea);
      setLatestOutputImage(data.image);
    } catch (error) {
      // If API fails, use a fallback
      console.error("Error:", error.message);
      setGeneratedImage("/fallback-image.png");
      setLatestOutputIdea(userIdea);
      setLatestOutputImage("/fallback-image.png");
    }
    // Stop loading state once response or fallback is ready
    setLoading(false);
  };

  // Fills the textarea when the user taps an example userIdea
  const handleIdeaSelect = (selectedIdea) => {
    setUserIdea(selectedIdea);
    setError("");
  };

  return (
    <>
      {/* Intro page */}
      {step === "intro" && (
        <div className="screen">
          <div className="card full-card">
            <div className="card-header">
              <AccessibilityPanel {...accessibilityProps} />

              <span className="progress-pill">Activity 3 of 3</span>
              <div className="card-icon">💭</div>
              <h2>What could social care look like?</h2>
            </div>

            <div className="card-content intro-content">
              <p>
                Describe an idea for the future of social care and watch AI
                bring it to life instantly.
              </p>

              <button className="btn" onClick={() => setStep("input")}>
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input page */}
      {step === "input" && (
        <div className="screen">
          <div className="card-container output-card">
            <div className="card-row">
              <div className="card-title">
                <div className="left">💭 AI Visuals</div>
              </div>

              <div className="progress-pill">Idea</div>

              <AccessibilityPanel {...accessibilityProps} />
            </div>

            <div className="question-box">
              <span className="question-icon">💭</span>
              <span className="question-text">
                What could AI in social care look like to you?
              </span>
            </div>

            <h3 className="output-title output-select">
              Need some inspiration? Tap one:
            </h3>

            {/* Example ideas for user to select */}
            <div className="output-ideas">
              <button
                className="output-idea"
                onClick={() =>
                  handleIdeaSelect(
                    "AI that keeps you company between carer visits",
                  )
                }
              >
                AI that keeps you company between carer visits.
              </button>

              <button
                className="output-idea"
                onClick={() =>
                  handleIdeaSelect(
                    "A robot that helps with paperwork, giving carers more time to support people",
                  )
                }
              >
                A robot that helps with paperwork, giving carers more time to
                support people.
              </button>

              <button
                className="output-idea"
                onClick={() =>
                  handleIdeaSelect(
                    "Smart technology that detects when something isn't right and alerts your carer",
                  )
                }
              >
                Smart technology that detects when something isn't right and
                alerts your carer.
              </button>
            </div>

            <h3 className="output-title output-type">Or type your own idea:</h3>

            <textarea
              className="output-textarea"
              placeholder="Type your idea..."
              value={userIdea}
              onChange={(e) => {
                const value = e.target.value;
                setUserIdea(value);
                setError(isValidIdea(value));
              }}
            />

            {error && (
              <p className="error-text" aria-live="polite">
                {error}
              </p>
            )}

            <button
              className="btn"
              onClick={handleGenerate}
              disabled={loading || !isValid}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Output page */}
      {step === "output" && (
        <div className="screen">
          <div className="card-container">
            <div className="card-row">
              <div className="card-title">
                <div className="left">💭 AI Visuals</div>
              </div>

              <div className="progress-pill">Results</div>

              <AccessibilityPanel {...accessibilityProps} />
            </div>

            <div className="output-container">
              {loading ? (
                <div className="info-section output-loading">
                  <div className="guess-icon">💭</div>

                  <p className="loading-text" aria-live="polite">
                    AI is creating your visual
                  </p>

                  <div className="loading-animation" aria-hidden="true">
                    <span className="loading-icon"></span>
                    <span className="loading-icon"></span>
                    <span className="loading-icon"></span>
                  </div>
                </div>
              ) : generatedImage ? (
                <img
                  src={generatedImage}
                  className="output-image"
                  alt="AI-generated visual from idea"
                />
              ) : null}

              {userIdea && (
                <div className="output-section">
                  <h3>Your idea</h3>
                  <div className="row-item">
                    <span>💭</span>
                    <p>
                      "{userIdea.charAt(0).toUpperCase() + userIdea.slice(1)}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="info-section">
              <h3>Did you know?</h3>

              <div className="row-item">
                <span>💡</span>
                <p>
                  AI images reflect what they were trained on, so futuristic
                  robots appear a lot, even for ideas about care and compassion.
                </p>
              </div>
            </div>

            <button
              className="btn"
              onClick={goNext}
              disabled={loading || !generatedImage}
            >
              Continue
            </button>

            <button
              className="secondary-btn"
              onClick={restartOutput}
              disabled={loading || !generatedImage}
            >
              Replay
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Output;
