import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';

const LeadView = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This would normally be an API call
    // const fetchLead = async () => {
    //   try {
    //     const response = await leadsApi.getLead(id);
    //     setLead(response.data);
    //     setError(null);
    //   } catch (err) {
    //     setError('Failed to fetch lead details');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // Mock data
    setTimeout(() => {
      setLead({
        id: parseInt(id),
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        source: 'Website',
        status: 'new',
        createdAt: '2023-06-15',
        notes: 'Interested in premium subscription',
        company: 'Acme Inc.',
        position: 'Marketing Director',
        address: '123 Main St, Anytown, USA',
        lastContact: '2023-06-20',
        tags: ['premium', 'website-visitor', 'newsletter-subscriber']
      });
      setLoading(false);
    }, 500);
  }, [id]);

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
    return <div className="loading">Loading lead details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!lead) {
    return <div className="not-found">Lead not found</div>;
  }

  return (
    <div className="lead-view-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lead Details</h2>
        <div>
          <Link to="/leads">
            <Button variant="outline-secondary" className="me-2">Back to Leads</Button>
          </Link>
          <Link to={`/leads/${id}/edit`}>
            <Button variant="primary">Edit Lead</Button>
          </Link>
        </div>
      </div>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h4>Contact Information</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <strong>Name:</strong> {lead.name}
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Email:</strong> {lead.email}
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Phone:</strong> {lead.phone}
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Company:</strong> {lead.company}
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Position:</strong> {lead.position}
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Address:</strong> {lead.address}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h4>Lead Information</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <strong>Source:</strong> {lead.source}
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Status:</strong> {getStatusBadge(lead.status)}
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Created:</strong> {new Date(lead.createdAt).toLocaleDateString()}
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Last Contact:</strong> {new Date(lead.lastContact).toLocaleDateString()}
                </Col>
                <Col md={12} className="mb-3">
                  <strong>Notes:</strong>
                  <p className="mt-2">{lead.notes}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h4>Tags</h4>
            </Card.Header>
            <Card.Body>
              <div>
                {lead.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    bg="secondary" 
                    className="me-2 mb-2 p-2">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h4>Actions</h4>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary">Send Email</Button>
                <Button variant="outline-info">Log Call</Button>
                <Button variant="outline-success">Schedule Meeting</Button>
                <Button variant="outline-danger">Mark as Lost</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LeadView;