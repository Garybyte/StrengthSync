import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="homePage">
      <section className="hero">
        <div className="heroText">
          <p className="tag">#1 FITNESS TRACKING PLATFORM</p>

          <h1>
            Train <span>smarter</span>.
            <br />
            Track progress
            <br />
            in real time.
          </h1>

          <p className="heroDescription">
            Strength Sync helps you log workouts, monitor calories,
            analyze performance, and stay consistent with personalized
            fitness tracking tools.
          </p>

          <div className="heroButtons">
            <Link to="/workouts" className="heroBtn primaryBtn">
              Start Tracking
            </Link>

            <Link to="/signup" className="heroBtn secondaryBtn">
              Create Account
            </Link>
          </div>

          <div className="heroStats">
            <div>
              <h3>10K+</h3>
              <p>Workouts Logged</p>
            </div>

            <div>
              <h3>95%</h3>
              <p>User Satisfaction</p>
            </div>

            <div>
              <h3>24/7</h3>
              <p>Progress Tracking</p>
            </div>
          </div>
        </div>

        <div className="heroVisual">
          <div className="glowCircle"></div>

          <div className="phoneMockup">
            <div className="phoneHeader">
              <h2>Today's Progress</h2>
              <span>Live</span>
            </div>

            <div className="statCard">
              <div>
                <h4>Calories Burned</h4>
                <p>420 kcal</p>
              </div>

              <div className="progressBar">
                <div style={{ width: "78%" }}></div>
              </div>
            </div>

            <div className="statCard">
              <div>
                <h4>Workouts Logged</h4>
                <p>3 Sessions</p>
              </div>

              <div className="progressBar">
                <div style={{ width: "65%" }}></div>
              </div>
            </div>

            <div className="statCard">
              <div>
                <h4>Weekly Goal</h4>
                <p>78% Complete</p>
              </div>

              <div className="progressBar">
                <div style={{ width: "78%" }}></div>
              </div>
            </div>

            <div className="miniCards">
              <div className="miniCard">
                <h5>Strength</h5>
                <p>+12%</p>
              </div>

              <div className="miniCard">
                <h5>Cardio</h5>
                <p>+8%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featuresSection">
        <div className="featureCard">
          <h3>Workout Tracking</h3>
          <p>
            Save workouts instantly and monitor your daily fitness routine.
          </p>
        </div>

        <div className="featureCard">
          <h3>Smart Suggestions</h3>
          <p>
            Get recommended exercises based on your fitness goals.
          </p>
        </div>

        <div className="featureCard">
          <h3>Progress Analytics</h3>
          <p>
            Track calories, workout time, and overall progress automatically.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;