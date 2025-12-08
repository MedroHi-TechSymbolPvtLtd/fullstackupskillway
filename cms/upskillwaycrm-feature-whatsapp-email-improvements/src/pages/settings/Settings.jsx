import React from 'react';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Settings = () => {
  const location = useLocation();
  
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">Settings</h1>
          <p className="text-muted">Manage your account and system settings</p>
        </Col>
      </Row>
      
      <Row>
        <Col md={3} className="mb-4 mb-md-0">
          <Card>
            <Card.Body className="p-0">
              <Nav className="flex-column">
                <Nav.Link 
                  as={Link} 
                  to="/profile" 
                  className={location.pathname === '/profile' ? 'active' : ''}
                >
                  Profile Settings
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/system-settings" 
                  className={location.pathname === '/system-settings' ? 'active' : ''}
                >
                  System Settings
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={9}>
          <Card>
            <Card.Body>
              <Outlet />
              {/* If no child route is matched, show some default content */}
              {location.pathname === '/settings' && (
                <div className="text-center py-5">
                  <h4>Settings Dashboard</h4>
                  <p className="text-muted">Select an option from the sidebar to manage your settings</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;