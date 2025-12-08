import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Table, Button, Badge } from 'react-bootstrap';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch leads data
    const fetchLeads = async () => {
      try {
        // This would normally be an API call
        // const response = await leadsApi.getLeads();
        // setLeads(response.data);
        
        // For now, using mock data
        setLeads([
          { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', source: 'Website', status: 'new', createdAt: '2023-06-15' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', source: 'Referral', status: 'contacted', createdAt: '2023-06-14' },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-123-4567', source: 'Social Media', status: 'qualified', createdAt: '2023-06-13' },
        ]);
        setError(null);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError('Failed to fetch leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      new: 'primary',
      contacted: 'info',
      qualified: 'success',
      lost: 'danger',
    };

    return (
      <Badge bg={statusMap[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="lead-list-container">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>Leads</h3>
          <div>
            <Link to="/leads/stats">
              <Button variant="outline-primary" className="me-2">View Stats</Button>
            </Link>
          </div>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.source}</td>
                  <td>{getStatusBadge(lead.status)}</td>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/leads/${lead.id}`}>
                      <Button variant="outline-info" size="sm">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LeadList;