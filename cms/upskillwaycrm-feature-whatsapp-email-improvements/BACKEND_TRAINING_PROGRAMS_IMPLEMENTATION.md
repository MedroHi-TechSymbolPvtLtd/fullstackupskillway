# Backend Training Programs API Implementation Guide

## 🚨 Issue
The frontend is trying to POST to `/api/v1/cms/training-programs`, but this route doesn't exist on the backend server.

## 📋 Required Backend Implementation

Based on the API documentation and existing patterns in this codebase, you need to implement the following on your backend server:

### 1. **Route File** (`src/routes/cms.ts` or `src/routes/cms.js`)

```typescript
import express from 'express';
import cmsController from '../controllers/cmsController.js';
import { authenticateToken } from '../middleware/auth.js'; // Adjust based on your auth middleware

const router = express.Router();

// Training Programs Routes
router.get('/training-programs', authenticateToken, cmsController.getTrainingPrograms);
router.get('/training-programs/:id', authenticateToken, cmsController.getTrainingProgramById);
router.post('/training-programs', authenticateToken, cmsController.createTrainingProgram);
router.put('/training-programs/:id', authenticateToken, cmsController.updateTrainingProgram);
router.delete('/training-programs/:id', authenticateToken, cmsController.deleteTrainingProgram);

export default router;
```

### 2. **Controller File** (`src/controllers/cmsController.ts` or `src/controllers/cmsController.js`)

```typescript
import { Request, Response } from 'express';
import cmsService from '../services/cmsService.js';

class CMSController {
  /**
   * GET /api/v1/cms/training-programs
   * Get all training programs with filters
   */
  async getTrainingPrograms(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        trainingType
      } = req.query;

      const params = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        ...(search && { search: search as string }),
        ...(status && { status: status as string }),
        ...(trainingType && { trainingType: trainingType as string })
      };

      const result = await cmsService.getTrainingPrograms(params);

      return res.status(200).json({
        success: true,
        message: 'Training programs retrieved successfully',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error: any) {
      console.error('Get training programs error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch training programs',
        error: error.message
      });
    }
  }

  /**
   * GET /api/v1/cms/training-programs/:id
   * Get training program by ID
   */
  async getTrainingProgramById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const program = await cmsService.getTrainingProgramById(id);

      if (!program) {
        return res.status(404).json({
          success: false,
          message: 'Training program not found',
          error: 'No training program found with the given ID'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Training program retrieved successfully',
        data: program
      });
    } catch (error: any) {
      console.error('Get training program by ID error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch training program',
        error: error.message
      });
    }
  }

  /**
   * POST /api/v1/cms/training-programs
   * Create new training program
   */
  async createTrainingProgram(req: Request, res: Response) {
    try {
      const programData = req.body;
      const userId = req.user?.id; // Adjust based on your auth middleware

      // Validate required fields
      if (!programData.title || !programData.slug || !programData.description || !programData.price) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: [
            { field: 'title', message: 'Title is required' },
            { field: 'slug', message: 'Slug is required' },
            { field: 'description', message: 'Description is required' },
            { field: 'price', message: 'Price is required' }
          ]
        });
      }

      // Ensure trainingType is set
      if (!programData.trainingType) {
        programData.trainingType = 'college'; // Default to college
      }

      const program = await cmsService.createTrainingProgram({
        ...programData,
        createdBy: userId
      });

      return res.status(201).json({
        success: true,
        message: 'Training program created successfully',
        data: program
      });
    } catch (error: any) {
      console.error('Create training program error:', error);
      
      if (error.message?.includes('slug') || error.message?.includes('unique')) {
        return res.status(409).json({
          success: false,
          message: 'Training program with this slug already exists',
          error: 'Slug must be unique'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to create training program',
        error: error.message
      });
    }
  }

  /**
   * PUT /api/v1/cms/training-programs/:id
   * Update training program
   */
  async updateTrainingProgram(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const programData = req.body;

      const program = await cmsService.updateTrainingProgram(id, programData);

      if (!program) {
        return res.status(404).json({
          success: false,
          message: 'Training program not found',
          error: 'No training program found with the given ID'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Training program updated successfully',
        data: program
      });
    } catch (error: any) {
      console.error('Update training program error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update training program',
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/v1/cms/training-programs/:id
   * Delete training program
   */
  async deleteTrainingProgram(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await cmsService.deleteTrainingProgram(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Training program not found',
          error: 'No training program found with the given ID'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Training program deleted successfully',
        data: {
          message: 'Training program deleted successfully'
        }
      });
    } catch (error: any) {
      console.error('Delete training program error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete training program',
        error: error.message
      });
    }
  }
}

export default new CMSController();
```

### 3. **Service File** (`src/services/cmsService.ts` or `src/services/cmsService.js`)

```typescript
import TrainingProgram from '../models/TrainingProgram.js'; // Adjust based on your model location
import { Op } from 'sequelize'; // If using Sequelize, adjust for your ORM

class CMSService {
  /**
   * Get all training programs with filters
   */
  async getTrainingPrograms(params: any) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      trainingType
    } = params;

    const offset = (page - 1) * limit;
    const where: any = {};

    // Filter by trainingType (required for college training)
    if (trainingType) {
      where.trainingType = trainingType;
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Search in title and description
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await TrainingProgram.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User, // Adjust based on your User model
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Get training program by ID
   */
  async getTrainingProgramById(id: string) {
    return await TrainingProgram.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
  }

  /**
   * Create training program
   */
  async createTrainingProgram(programData: any) {
    // Check if slug already exists
    const existing = await TrainingProgram.findOne({
      where: { slug: programData.slug }
    });

    if (existing) {
      throw new Error('Training program with this slug already exists');
    }

    return await TrainingProgram.create(programData);
  }

  /**
   * Update training program
   */
  async updateTrainingProgram(id: string, programData: any) {
    const program = await TrainingProgram.findByPk(id);
    
    if (!program) {
      return null;
    }

    // If slug is being updated, check for uniqueness
    if (programData.slug && programData.slug !== program.slug) {
      const existing = await TrainingProgram.findOne({
        where: { slug: programData.slug }
      });

      if (existing) {
        throw new Error('Training program with this slug already exists');
      }
    }

    await program.update(programData);
    return program;
  }

  /**
   * Delete training program
   */
  async deleteTrainingProgram(id: string) {
    const program = await TrainingProgram.findByPk(id);
    
    if (!program) {
      return false;
    }

    await program.destroy();
    return true;
  }
}

export default new CMSService();
```

### 4. **Model File** (`src/models/TrainingProgram.ts` or `src/models/TrainingProgram.js`)

Based on the API documentation, your TrainingProgram model should have these fields:

```typescript
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class TrainingProgram extends Model {
  public id!: string;
  public title!: string;
  public slug!: string;
  public description!: string;
  public syllabus?: string;
  public videoDemoUrl?: string;
  public tags?: string[];
  public price!: number;
  public status!: 'draft' | 'published';
  public trainingType!: 'corporate' | 'college';
  public cardImageUrl?: string;
  public durationMonths?: number;
  public durationHours?: number;
  public placementRate?: number;
  public successMetric?: string;
  public curriculum?: any; // JSON field
  public testimonials?: any; // JSON field
  public faqs?: any; // JSON field
  public badges?: string[];
  public createdBy!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

TrainingProgram.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    syllabus: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    videoDemoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      defaultValue: 'draft'
    },
    trainingType: {
      type: DataTypes.ENUM('corporate', 'college'),
      allowNull: false
    },
    cardImageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    durationMonths: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    durationHours: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    placementRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    successMetric: {
      type: DataTypes.STRING,
      allowNull: true
    },
    curriculum: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    testimonials: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    },
    faqs: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    },
    badges: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'TrainingProgram',
    tableName: 'training_programs',
    timestamps: true
  }
);

export default TrainingProgram;
```

### 5. **Register Routes in Main App**

In your main server file (e.g., `src/app.ts` or `src/server.js`):

```typescript
import express from 'express';
import cmsRoutes from './routes/cms.js';

const app = express();

// ... other middleware ...

// Register CMS routes
app.use('/api/v1/cms', cmsRoutes);

// ... rest of your app setup ...
```

## 🔍 Database Migration

You'll also need to create a database migration for the `training_programs` table:

```sql
CREATE TABLE training_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  syllabus TEXT,
  video_demo_url VARCHAR(500),
  tags TEXT[] DEFAULT '{}',
  price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  training_type VARCHAR(20) NOT NULL CHECK (training_type IN ('corporate', 'college')),
  card_image_url VARCHAR(500),
  duration_months INTEGER,
  duration_hours INTEGER,
  placement_rate DECIMAL(5, 2),
  success_metric VARCHAR(255),
  curriculum JSONB,
  testimonials JSONB DEFAULT '[]',
  faqs JSONB DEFAULT '[]',
  badges TEXT[] DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_training_programs_training_type ON training_programs(training_type);
CREATE INDEX idx_training_programs_status ON training_programs(status);
CREATE INDEX idx_training_programs_slug ON training_programs(slug);
```

## ✅ Testing

After implementing, test with:

```bash
# GET all college training programs
curl -X GET "http://localhost:3000/api/v1/cms/training-programs?trainingType=college" \
  -H "Authorization: Bearer YOUR_TOKEN"

# POST create training program
curl -X POST "http://localhost:3000/api/v1/cms/training-programs" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python for College Students",
    "slug": "python-college",
    "description": "Learn Python programming",
    "price": 5000.00,
    "trainingType": "college",
    "status": "draft"
  }'
```

## 📝 Notes

1. **Adjust the code** based on your ORM (Sequelize, TypeORM, Prisma, etc.)
2. **Update authentication middleware** to match your implementation
3. **Add validation** using your preferred validation library (Joi, Zod, etc.)
4. **Add proper error handling** and logging
5. **Ensure database indexes** are created for performance

Once you implement these backend routes, the frontend will work correctly!



