import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const UserView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Simulate fetching user data
  useEffect(() => {
    // In a real app, you would fetch the user data from your API
    setTimeout(() => {
      // Mock data
      setUser({
        id: id,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'admin',
        status: 'active',
        createdAt: '2023-01-15T10:30:00Z',
        lastLogin: '2023-05-22T14:45:00Z',
        avatar: 'https://via.placeholder.com/150',
        phone: '+1 (555) 123-4567',
        department: 'Engineering',
        location: 'New York, USA',
        bio: 'Senior Software Engineer with 8+ years of experience in web development and team leadership.',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/johndoe',
          twitter: 'https://twitter.com/johndoe',
          github: 'https://github.com/johndoe'
        },
        permissions: [
          'user.view',
          'user.create',
          'user.edit',
          'user.delete',
          'content.view',
          'content.create',
          'content.edit',
          'content.delete',
          'settings.view',
          'settings.edit'
        ],
        recentActivity: [
          { action: 'Updated profile', date: '2023-05-20T09:15:00Z' },
          { action: 'Created new blog post', date: '2023-05-18T11:30:00Z' },
          { action: 'Updated system settings', date: '2023-05-15T14:45:00Z' },
          { action: 'Added new user', date: '2023-05-10T16:20:00Z' }
        ]
      });
      setLoading(false);
    }, 500);
  }, [id]);
  
  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      inactive: 'secondary',
      pending: 'warning',
      suspended: 'danger'
    };
    
    return (
      <Badge bg={variants[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading user data...</p>
        </div>
      </Container>
    );
  }
  
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-0">User Profile</h1>
              <p className="text-muted">Viewing user details</p>
            </div>
            <div>
              <Button 
                variant="outline-secondary" 
                className="me-2"
                onClick={() => navigate('/users')}
              >
                Back to Users
              </Button>
              <Button 
                variant="primary"
                onClick={() => navigate(`/users/${id}/edit`)}
              >
                Edit User
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      
      <Row>
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Body className="text-center">
              <img 
                src={user.avatar} 
                alt={`${user.firstName} ${user.lastName}`}
                className="rounded-circle mb-3"
                width="120"
                height="120"
              />
              <h4>{user.firstName} {user.lastName}</h4>
              <p className="text-muted mb-1">{user.email}</p>
              <p className="mb-3">{getStatusBadge(user.status)}</p>
              <div className="d-flex justify-content-center mb-2">
                <Badge bg="primary" className="me-2">{user.role}</Badge>
                <Badge bg="info">{user.department}</Badge>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="d-flex justify-content-center">
                {user.socialLinks.linkedin && (
                  <a href={user.socialLinks.linkedin} className="mx-2" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
                {user.socialLinks.twitter && (
                  <a href={user.socialLinks.twitter} className="mx-2" target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                )}
                {user.socialLinks.github && (
                  <a href={user.socialLinks.github} className="mx-2" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                )}
              </div>
            </Card.Footer>
          </Card>
          
          <Card className="mt-4">
            <Card.Header>Contact Information</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Email:</strong> {user.email}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Phone:</strong> {user.phone}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Location:</strong> {user.location}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100">
                <Card.Header>User Information</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>User ID:</strong> {user.id}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Full Name:</strong> {user.firstName} {user.lastName}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Role:</strong> {user.role}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Department:</strong> {user.department}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Status:</strong> {getStatusBadge(user.status)}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
            
            <Col md={6} className="mb-4">
              <Card className="h-100">
                <Card.Header>Account Details</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Created:</strong> {formatDate(user.createdAt)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Last Login:</strong> {formatDate(user.lastLogin)}
                  </ListGroup.Item>
                </ListGroup>
                <Card.Body>
                  <h6>Biography</h6>
                  <p className="text-muted">{user.bio}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col md={6} className="mb-4">
              <Card>
                <Card.Header>Permissions</Card.Header>
                <Card.Body>
                  <div className="d-flex flex-wrap">
                    {user.permissions.map((permission, index) => (
                      <Badge 
                        key={index} 
                        bg="light" 
                        text="dark" 
                        className="me-2 mb-2"
                      >
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} className="mb-4">
              <Card>
                <Card.Header>Recent Activity</Card.Header>
                <ListGroup variant="flush">
                  {user.recentActivity.map((activity, index) => (
                    <ListGroup.Item key={index}>
                      <div className="d-flex justify-content-between">
                        <span>{activity.action}</span>
                        <small className="text-muted">{formatDate(activity.date)}</small>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default UserView;