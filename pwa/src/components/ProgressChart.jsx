import React, { useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

const ProgressChart = ({ sessions, weeklyProgress }) => {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Study Progress Overview'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  // Prepare subject distribution data
  const subjectData = sessions.reduce((acc, session) => {
    acc[session.subject] = (acc[session.subject] || 0) + session.duration
    return acc
  }, {})

  const subjectChartData = {
    labels: Object.keys(subjectData),
    datasets: [
      {
        label: 'Study Time (minutes)',
        data: Object.values(subjectData),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  }

  // Prepare weekly progress data
  const weeklyChartData = {
    labels: weeklyProgress.map(week => `Week ${week.week}`),
    datasets: [
      {
        label: 'Hours Studied',
        data: weeklyProgress.map(week => week.hours),
        borderColor: 'rgba(0, 102, 204, 1)',
        backgroundColor: 'rgba(0, 102, 204, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Sessions',
        data: weeklyProgress.map(week => week.sessions),
        borderColor: 'rgba(40, 167, 69, 1)',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  }

  const weeklyChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Weekly Study Progress'
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Hours'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Sessions'
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    }
  }

  if (sessions.length === 0) {
    return (
      <div className="card">
        <h3 className="mb-3">Progress Charts</h3>
        <div className="text-center" style={{ padding: '40px', color: 'var(--text-secondary)' }}>
          <p>Charts will appear here once you start logging study sessions!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="mb-4">Progress Charts</h3>
      
      <div className="mb-4">
        <h4 className="mb-3" style={{ fontSize: '1.1rem' }}>Study Time by Subject</h4>
        <div style={{ height: '300px', position: 'relative' }}>
          <Bar data={subjectChartData} options={chartOptions} />
        </div>
      </div>

      {weeklyProgress.length > 0 && (
        <div>
          <h4 className="mb-3" style={{ fontSize: '1.1rem' }}>Weekly Progress Trend</h4>
          <div style={{ height: '300px', position: 'relative' }}>
            <Line data={weeklyChartData} options={weeklyChartOptions} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressChart
