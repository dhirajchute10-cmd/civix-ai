import "../css/HowItWorks.css";

function HowItWorks() {
  return (
    <section className="how-it-works">

      <h2>How CIVIX AI Works</h2>

      <div className="steps">

        <div className="step">
          <div className="step-number">1</div>
          <h3>Register</h3>
          <p>Create your account securely.</p>
        </div>

        <div className="step">
          <div className="step-number">2</div>
          <h3>Report Complaint</h3>
          <p>Upload text, image or voice complaint.</p>
        </div>

        <div className="step">
          <div className="step-number">3</div>
          <h3>AI Processing</h3>
          <p>AI categorizes and prioritizes your complaint.</p>
        </div>

        <div className="step">
          <div className="step-number">4</div>
          <h3>Municipality Action</h3>
          <p>The concerned department receives the complaint.</p>
        </div>

        <div className="step">
          <div className="step-number">5</div>
          <h3>Resolved</h3>
          <p>Track status until the issue is resolved.</p>
        </div>

      </div>

    </section>
  );
}

export default HowItWorks;