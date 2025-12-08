// Test script to create sample trainers for testing
// Run this in your browser console while logged into the frontend

const createTestTrainers = async () => {
  const testTrainers = [
    {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1-555-0123",
      specialization: ["JavaScript", "React", "Node.js"],
      experience: 5,
      hourlyRate: 75,
      bio: "Experienced full-stack developer with expertise in modern web technologies.",
      trainingMode: ["ONLINE", "IN_PERSON"],
      availability: "AVAILABLE"
    },
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1-555-0124",
      specialization: ["Python", "Data Science", "Machine Learning"],
      experience: 7,
      hourlyRate: 90,
      bio: "Data scientist and Python expert with extensive experience in ML and AI.",
      trainingMode: ["ONLINE"],
      availability: "AVAILABLE"
    },
    {
      name: "Mike Chen",
      email: "mike.chen@example.com",
      phone: "+1-555-0125",
      specialization: ["Java", "Spring Boot", "Microservices"],
      experience: 6,
      hourlyRate: 80,
      bio: "Senior Java developer specializing in enterprise applications and microservices architecture.",
      trainingMode: ["IN_PERSON", "ONLINE"],
      availability: "AVAILABLE"
    },
    {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "+1-555-0126",
      specialization: ["UI/UX Design", "Figma", "Adobe Creative Suite"],
      experience: 4,
      hourlyRate: 65,
      bio: "Creative UI/UX designer with a passion for creating beautiful and functional user interfaces.",
      trainingMode: ["ONLINE"],
      availability: "AVAILABLE"
    },
    {
      name: "David Wilson",
      email: "david.wilson@example.com",
      phone: "+1-555-0127",
      specialization: ["DevOps", "AWS", "Docker", "Kubernetes"],
      experience: 8,
      hourlyRate: 95,
      bio: "DevOps engineer with extensive experience in cloud infrastructure and containerization.",
      trainingMode: ["ONLINE", "IN_PERSON"],
      availability: "AVAILABLE"
    }
  ];

  console.log('Creating test trainers...');
  
  for (const trainerData of testTrainers) {
    try {
      // Import the trainer API (assuming it's available globally)
      const response = await fetch('/api/v1/trainers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token') || localStorage.getItem('upskillway_access_token')}`
        },
        body: JSON.stringify(trainerData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Created trainer: ${trainerData.name} (ID: ${result.data.id})`);
      } else {
        console.error(`❌ Failed to create trainer ${trainerData.name}:`, result.message);
      }
    } catch (error) {
      console.error(`❌ Error creating trainer ${trainerData.name}:`, error);
    }
  }
  
  console.log('✅ Test trainer creation completed!');
};

// Function to check existing trainers
const checkExistingTrainers = async () => {
  try {
    const response = await fetch('/api/v1/trainers', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token') || localStorage.getItem('upskillway_access_token')}`
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('📋 Existing trainers:', result.data);
      return result.data;
    } else {
      console.error('❌ Failed to fetch trainers:', result.message);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching trainers:', error);
    return [];
  }
};

// Usage instructions
console.log(`
🚀 Trainer Management Utilities

To create test trainers, run:
createTestTrainers()

To check existing trainers, run:
checkExistingTrainers()

Make sure you're logged in to the frontend application first!
`);

// Export functions for use
window.createTestTrainers = createTestTrainers;
window.checkExistingTrainers = checkExistingTrainers;
