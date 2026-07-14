function RecentComplaints() {
  return (
    <div className="recent-complaints">

      <h2>📋 Recent Complaints</h2>

      <table>
        <thead>
          <tr>
            <th>Citizen</th>
            <th>Category</th>
            <th>Status</th>
            <th>Priority</th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td>Rahul</td>
            <td>Road</td>
            <td>Pending</td>
            <td>High</td>
          </tr>

          <tr>
            <td>Priya</td>
            <td>Water</td>
            <td>In Progress</td>
            <td>Medium</td>
          </tr>

          <tr>
            <td>Amit</td>
            <td>Garbage</td>
            <td>Resolved</td>
            <td>Low</td>
          </tr>

        </tbody>
      </table>

    </div>
  );
}

export default RecentComplaints;