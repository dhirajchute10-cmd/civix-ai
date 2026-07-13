import "../css/Features.css";

function Features() {
  return (
    <section className="features">

      <h2>Our Smart Features</h2>

      <div className="feature-container">

        <div className="feature-card">
          <h3>📷 Image Complaint</h3>
          <p>Upload images of civic issues for faster resolution.</p>
        </div>

        <div className="feature-card">
          <h3>🎤 Voice Complaint</h3>
          <p>Register complaints using your voice.</p>
        </div>

        <div className="feature-card">
          <h3>🤖 AI Assistant</h3>
          <p>Get instant answers and guidance using AI.</p>
        </div>

        <div className="feature-card">
          <h3>📍 Live Tracking</h3>
          <p>Track your complaint status in real time.</p>
        </div>

        <div className="feature-card">
          <h3>📊 Smart Analytics</h3>
          <p>View complaint statistics and city insights.</p>
        </div>

        <div className="feature-card">
          <h3>🚨 Emergency Support</h3>
          <p>Quickly report emergency civic issues.</p>
        </div>

      </div>

    </section>
  );
}

export default Features;