import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'UPskillway CMS',
    siteDescription: 'Content Management System for UPskillway',
    emailNotifications: true,
    maintenanceMode: false,
    debugMode: false,
    cacheTimeout: 3600,
    maxUploadSize: 10,
    allowedFileTypes: '.jpg,.png,.pdf,.docx,.xlsx'
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the settings to your backend
    console.log('Saving settings:', settings);
    
    // Show success message
    setSaved(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div>
      <h2 className="mb-4">System Settings</h2>
      
      {saved && (
        <Alert variant="success" className="mb-4">
          Settings saved successfully!
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Header>General Settings</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Site Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Site Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Card className="mb-4">
          <Card.Header>System Configuration</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Email Notifications"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Maintenance Mode"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Debug Mode"
                    name="debugMode"
                    checked={settings.debugMode}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cache Timeout (seconds)</Form.Label>
                  <Form.Control
                    type="number"
                    name="cacheTimeout"
                    value={settings.cacheTimeout}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Max Upload Size (MB)</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxUploadSize"
                    value={settings.maxUploadSize}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Allowed File Types</Form.Label>
              <Form.Control
                type="text"
                name="allowedFileTypes"
                value={settings.allowedFileTypes}
                onChange={handleChange}
                placeholder="Comma separated file extensions (e.g., .jpg,.png,.pdf)"
              />
              <Form.Text className="text-muted">
                Enter comma-separated file extensions
              </Form.Text>
            </Form.Group>
          </Card.Body>
        </Card>
        
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Settings
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SystemSettings;