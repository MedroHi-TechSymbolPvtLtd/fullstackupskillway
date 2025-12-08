import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, ProgressBar } from 'react-bootstrap';

const LeadStats = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    bySource: {},
    byStatus: {},
    recentTrends: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would normally be an API call
    // const fetchStats = async () => {
    //   const response = await leadsApi.getLeadStats();
    //   setStats(response.data);
    //   setLoading(false);
    // };
    
    // Mock data
    setTimeout(() => {
      setStats({
        totalLeads: 145,
        bySource: {
          'Website': 65,
          'Referral': 30,
          'Social Media': 25,
          'Email Campaign': 15,
          'Other': 10
        },
        byStatus: {
          'new': 40,
          'contacted': 55,
          'qualified': 30,
          'lost': 20
        },
        recentTrends: [
          { month: 'Jan', count: 12 },
          { month: 'Feb', count: 19 },
          { month: 'Mar', count: 15 },
          { month: 'Apr', count: 25 },
          { month: 'May', count: 32 },
          { month: 'Jun', count: 42 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="loading">Loading stats...</div>;
  }

  // Helper function to get variant color for progress bars
  const getVariantColor = (index) => {
    const variants = ['primary', 'success', 'info', 'warning', 'danger'];
    return variants[index % variants.length];
  };
  
  // Helper function to format status text
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="lead-stats-container">
      <h2 className="mb-4">Lead Statistics</h2>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Total Leads</Card.Title>
              <h1>{stats.totalLeads}</h1>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Monthly Trends</Card.Title>
              <div className="mt-3">
                {stats.recentTrends.map((item, index) => (
                  <div key={item.month} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>{item.month}</span>
                      <span>{item.count} leads</span>
                    </div>
                    <ProgressBar 
                      now={item.count} 
                      max={Math.max(...stats.recentTrends.map(t => t.count))} 
                      variant={getVariantColor(index)} 
                    />
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Leads by Source</Card.Title>
              <div className="mt-3">
                {Object.entries(stats.bySource).map(([source, count], index) => (
                  <div key={source} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>{source}</span>
                      <span>{count} leads ({((count / stats.totalLeads) * 100).toFixed(1)}%)</span>
                    </div>
                    <ProgressBar 
                      now={(count / stats.totalLeads) * 100} 
                      variant={getVariantColor(index)} 
                    />
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Leads by Status</Card.Title>
              <div className="mt-3">
                {Object.entries(stats.byStatus).map(([status, count], index) => (
                  <div key={status} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>{formatStatus(status)}</span>
                      <span>{count} leads ({((count / stats.totalLeads) * 100).toFixed(1)}%)</span>
                    </div>
                    <ProgressBar 
                      now={(count / stats.totalLeads) * 100} 
                      variant={getVariantColor(index)} 
                    />
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card>
        <Card.Body>
          <Card.Title>Source Breakdown</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Source</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.bySource).map(([source, count]) => (
                <tr key={source}>
                  <td>{source}</td>
                  <td>{count}</td>
                  <td>{((count / stats.totalLeads) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LeadStats;