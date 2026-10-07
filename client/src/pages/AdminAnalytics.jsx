import { useEffect, useMemo, useState } from "react";
import {
  getAdminStats,
  getCategoryStats,
} from "../services/complaintService";
import "../css/AdminAnalytics.css";

function AdminAnalytics() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsResponse, categoryResponse] =
        await Promise.all([
          getAdminStats(),
          getCategoryStats(),
        ]);

      if (statsResponse.data?.success) {
        setStats(
          statsResponse.data.stats || {
            total: 0,
            pending: 0,
            inProgress: 0,
            resolved: 0,
          }
        );
      }

      if (categoryResponse.data?.success) {
        const data =
          categoryResponse.data.categoryStats ||
          categoryResponse.data.categories ||
          categoryResponse.data.data ||
          [];

        setCategoryStats(
          Array.isArray(data) ? data : []
        );
      }
    } catch (err) {
      console.error(
        "Error fetching analytics:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  const resolutionRate =
    stats.total > 0
      ? Math.round(
          (stats.resolved / stats.total) * 100
        )
      : 0;

  const pendingRate =
    stats.total > 0
      ? Math.round(
          (stats.pending / stats.total) * 100
        )
      : 0;

  const inProgressRate =
    stats.total > 0
      ? Math.round(
          (stats.inProgress / stats.total) * 100
        )
      : 0;

  const categories = useMemo(() => {
    const allowedCategories = [
      "Road",
      "Water",
      "Garbage",
      "Electricity",
      "Drainage",
      "Street Light",
      "Others",
    ];

    const counts = {};

    categoryStats.forEach((item) => {
      const name =
        item?._id ||
        item?.category ||
        item?.name;

      const count =
        Number(
          item?.count ??
            item?.total ??
            item?.complaints ??
            0
        );

      if (name) {
        counts[name] =
          (counts[name] || 0) + count;
      }
    });

    return allowedCategories
      .map((name) => ({
        name,
        count: counts[name] || 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [categoryStats]);

  const maxCategoryCount = Math.max(
    ...categories.map(
      (item) => item.count
    ),
    1
  );

  const topCategory = categories.find(
    (item) => item.count > 0
  );

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-header">
          <div>
            <h1>📊 Analytics</h1>
            <p>
              Loading complaint analytics...
            </p>
          </div>
        </div>

        <div className="analytics-loading">
          <div className="analytics-spinner"></div>
          <p>
            Fetching analytics data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page">
        <div className="analytics-header">
          <div>
            <h1>📊 Analytics</h1>
            <p>
              Overview of citizen complaints
              and their status.
            </p>
          </div>
        </div>

        <div className="analytics-error">
          <strong>
            Unable to load analytics
          </strong>

          <p>{error}</p>

          <button
            type="button"
            onClick={fetchAnalytics}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const pendingAngle =
    stats.total > 0
      ? (stats.pending / stats.total) *
        360
      : 0;

  const inProgressAngle =
    stats.total > 0
      ? (stats.inProgress / stats.total) *
        360
      : 0;

  const resolvedAngle =
    stats.total > 0
      ? (stats.resolved / stats.total) *
        360
      : 0;

  const pendingEnd =
    pendingAngle;

  const inProgressEnd =
    pendingAngle +
    inProgressAngle;

  const resolvedEnd =
    inProgressEnd +
    resolvedAngle;

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <h1>📊 Analytics</h1>

          <p>
            Overview of citizen complaints
            and their status
          </p>
        </div>

        <button
          type="button"
          className="analytics-refresh-button"
          onClick={fetchAnalytics}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="analytics-stats">
        <div className="analytics-card blue">
          <span>📄</span>

          <div>
            <h3>
              Total Complaints
            </h3>

            <strong>
              {stats.total}
            </strong>
          </div>
        </div>

        <div className="analytics-card orange">
          <span>⏱️</span>

          <div>
            <h3>
              Pending
            </h3>

            <strong>
              {stats.pending}
            </strong>
          </div>
        </div>

        <div className="analytics-card purple">
          <span>🔄</span>

          <div>
            <h3>
              In Progress
            </h3>

            <strong>
              {stats.inProgress}
            </strong>
          </div>
        </div>

        <div className="analytics-card green">
          <span>✓</span>

          <div>
            <h3>
              Resolved
            </h3>

            <strong>
              {stats.resolved}
            </strong>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-box">
          <h2>
            Complaint Status Overview
          </h2>

          <div className="status-chart">
            <div
              className="status-circle"
              style={{
                background:
                  stats.total === 0
                    ? "#e2e8f0"
                    : `conic-gradient(
                        #f59e0b 0deg ${pendingEnd}deg,
                        #7c3aed ${pendingEnd}deg ${inProgressEnd}deg,
                        #10b981 ${inProgressEnd}deg ${resolvedEnd}deg
                      )`,
              }}
            >
              <div>
                <strong>
                  {stats.total}
                </strong>

                <small>
                  Total
                </small>
              </div>
            </div>

            <div className="status-list">
              <p>
                <span className="dot orange-dot"></span>
                <span>Pending</span>
                <b>{stats.pending}</b>
              </p>

              <p>
                <span className="dot purple-dot"></span>
                <span>In Progress</span>
                <b>{stats.inProgress}</b>
              </p>

              <p>
                <span className="dot green-dot"></span>
                <span>Resolved</span>
                <b>{stats.resolved}</b>
              </p>
            </div>
          </div>

          <div className="status-percentages">
            <div>
              <span>
                Pending
              </span>

              <strong>
                {pendingRate}%
              </strong>
            </div>

            <div>
              <span>
                In Progress
              </span>

              <strong>
                {inProgressRate}%
              </strong>
            </div>

            <div>
              <span>
                Resolved
              </span>

              <strong>
                {resolutionRate}%
              </strong>
            </div>
          </div>
        </div>

        <div className="analytics-box">
          <div className="analytics-box-heading">
            <div>
              <h2>
                Complaints by Category
              </h2>

              <p>
                Live category distribution
                from MongoDB
              </p>
            </div>

            {topCategory && (
              <div className="top-category">
                <small>
                  Most reported
                </small>

                <strong>
                  {topCategory.name}
                </strong>
              </div>
            )}
          </div>

          <div className="category-chart">
            {categories.map(
              (category) => {
                const percentage =
                  stats.total > 0
                    ? Math.round(
                        (category.count /
                          stats.total) *
                          100
                      )
                    : 0;

                const width =
                  category.count > 0
                    ? Math.max(
                        (category.count /
                          maxCategoryCount) *
                          100,
                        4
                      )
                    : 0;

                return (
                  <div
                    className="category-row"
                    key={category.name}
                  >
                    <span className="category-name">
                      {category.name}
                    </span>

                    <div className="bar-area">
                      <div
                        className="bar"
                        style={{
                          width: `${width}%`,
                        }}
                      ></div>
                    </div>

                    <strong>
                      {category.count}
                    </strong>

                    <span className="category-percent">
                      {percentage}%
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>

      <div className="analytics-box resolution-box">
        <h2>
          Resolution Summary
        </h2>

        <div className="resolution-grid">
          <div>
            <span className="summary-icon green-bg">
              ✓
            </span>

            <div>
              <strong>
                {stats.resolved}
              </strong>

              <p>
                Resolved
              </p>
            </div>
          </div>

          <div>
            <span className="summary-icon orange-bg">
              ⏱
            </span>

            <div>
              <strong>
                {stats.pending}
              </strong>

              <p>
                Pending
              </p>
            </div>
          </div>

          <div>
            <span className="summary-icon purple-bg">
              ↻
            </span>

            <div>
              <strong>
                {stats.inProgress}
              </strong>

              <p>
                In Progress
              </p>
            </div>
          </div>

          <div>
            <span className="summary-icon blue-bg">
              %
            </span>

            <div>
              <strong>
                {resolutionRate}%
              </strong>

              <p>
                Resolution Rate
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-insights">
        <div className="insight-card">
          <span className="insight-icon">
            📈
          </span>

          <div>
            <small>
              Overall workload
            </small>

            <strong>
              {stats.total} complaints
            </strong>

            <p>
              Total complaints currently
              recorded in the system.
            </p>
          </div>
        </div>

        <div className="insight-card">
          <span className="insight-icon">
            🎯
          </span>

          <div>
            <small>
              Resolution progress
            </small>

            <strong>
              {resolutionRate}% resolved
            </strong>

            <p>
              Share of recorded complaints
              currently marked resolved.
            </p>
          </div>
        </div>

        <div className="insight-card">
          <span className="insight-icon">
            🏙️
          </span>

          <div>
            <small>
              Leading category
            </small>

            <strong>
              {topCategory
                ? topCategory.name
                : "No data"}
            </strong>

            <p>
              {topCategory
                ? `${topCategory.count} complaint${
                    topCategory.count !== 1
                      ? "s"
                      : ""
                  } recorded in this category.`
                : "Category data will appear when complaints are available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;