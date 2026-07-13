import "../css/Statistics.css";

function Statistics() {
  return (
    <section className="statistics">

      <h2>CIVIX AI at a Glance</h2>

      <div className="stats-container">

        <div className="stat-card">
          <h3>12K+</h3>
          <p>Complaints Resolved</p>
        </div>

        <div className="stat-card">
          <h3>98%</h3>
          <p>AI Classification Accuracy</p>
        </div>

        <div className="stat-card">
          <h3>24×7</h3>
          <p>AI Assistant Available</p>
        </div>

        <div className="stat-card">
          <h3>50+</h3>
          <p>Departments Connected</p>
        </div>

      </div>

    </section>
  );
}

export default Statistics;