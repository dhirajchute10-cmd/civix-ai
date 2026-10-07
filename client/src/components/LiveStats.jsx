import "../css/LiveStats.css";

function LiveStats() {
  return (
    <section className="live-stats">
      <h2>📊 Live Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>250+</h3>
          <p>Complaints Resolved</p>
        </div>

        <div className="stat-card">
          <h3>50+</h3>
          <p>Government Services</p>
        </div>

        <div className="stat-card">
          <h3>24×7</h3>
          <p>AI Support</p>
        </div>
      </div>
    </section>
  );
}

export default LiveStats;