import { Router } from 'express';
import {
  // Blog controllers
  createBlogController,
  getAllBlogsController,
  getBlogByIdController,
  updateBlogController,
  deleteBlogController,
  // Video controllers
  createVideoController,
  getAllVideosController,
  getVideoByIdController,
  updateVideoController,
  deleteVideoController,
  // FAQ controllers
  createFAQController,
  getAllFAQsController,
  getFAQByIdController,
  updateFAQController,
  deleteFAQController,
  // Testimonial controllers
  createTestimonialController,
  getAllTestimonialsController,
  getTestimonialByIdController,
  updateTestimonialController,
  deleteTestimonialController,
  // Course controllers
  createCourseController,
  getAllCoursesController,
  getCourseByIdController,
  updateCourseController,
  deleteCourseController,
  getCourseCurriculumController,
  updateCourseCurriculumController,
  patchCourseShortDescriptionController,
  getCourseMentorsController,
  updateCourseMentorsController,
  // Ebook controllers
  createEbookController,
  getAllEbooksController,
  getEbookByIdController,
  updateEbookController,
  deleteEbookController,
  // Study Abroad controllers
  createStudyAbroadController,
  getAllStudyAbroadController,
  getStudyAbroadByIdController,
  updateStudyAbroadController,
  deleteStudyAbroadController,
  // Short Course controllers
  createShortCourseController,
  getAllShortCoursesController,
  getShortCourseByIdController,
  updateShortCourseController,
  deleteShortCourseController,
  // Certified Course controllers
  createCertifiedCourseController,
  getAllCertifiedCoursesController,
  getCertifiedCourseByIdController,
  updateCertifiedCourseController,
  deleteCertifiedCourseController,
  // Training Program controllers
  getAllTrainingProgramsController,
  getTrainingProgramByIdController,
  createTrainingProgramController,
  updateTrainingProgramController,
  deleteTrainingProgramController,
  // Corporate Training Program controllers
  getAllCorporateTrainingProgramsController,
  getCorporateTrainingProgramByIdController,
  createCorporateTrainingProgramController,
  updateCorporateTrainingProgramController,
  deleteCorporateTrainingProgramController,
  // College Training Program controllers
  getAllCollegeTrainingProgramsController,
  getCollegeTrainingProgramByIdController,
  createCollegeTrainingProgramController,
  updateCollegeTrainingProgramController,
  deleteCollegeTrainingProgramController,
} from '../controllers/cmsController';
import { authenticate, requireAuth } from '../middlewares/auth';
import { validateSchemaMiddleware, validateQuery } from '../utils/validation';
import { trainingPayloadNormalizer } from '../middlewares/trainingNormalizer';
import { publicRoute } from '../middleware/publicRoute';
import {
  blogSchema,
  updateBlogSchema,
  videoSchema,
  updateVideoSchema,
  faqSchema,
  updateFaqSchema,
  testimonialSchema,
  updateTestimonialSchema,
  courseSchema,
  updateCourseSchema,
  courseCurriculumUpdateSchema,
  courseShortDescriptionSchema,
  courseMentorUpdateSchema,
  ebookSchema,
  updateEbookSchema,
  studyAbroadSchema,
  updateStudyAbroadSchema,
  shortCourseSchema,
  updateShortCourseSchema,
  certifiedCourseSchema,
  updateCertifiedCourseSchema,
} from '../validators/cms';
import { trainingProgramSchema, updateTrainingProgramSchema } from '../validators/training';
import { paginationSearchSchema } from '../utils/validation';

const router = Router();

// Public GET route — accessible without login
router.get('/blogs', validateQuery(paginationSearchSchema), getAllBlogsController);
// Public GET route — accessible without login
router.get('/blogs/:id', getBlogByIdController);
// Public GET route — accessible without login
router.get('/videos', validateQuery(paginationSearchSchema), getAllVideosController);
// Public GET route — accessible without login
router.get('/videos/:id', getVideoByIdController);
// Public GET route — accessible without login
router.get('/faqs', validateQuery(paginationSearchSchema), getAllFAQsController);
// Public GET route — accessible without login
router.get('/faqs/:id', getFAQByIdController);
// Public GET route — accessible without login
router.get('/testimonials', validateQuery(paginationSearchSchema), getAllTestimonialsController);
// Public GET route — accessible without login
router.get('/testimonials/:id', getTestimonialByIdController);
// Public GET route — accessible without login
router.get('/courses', validateQuery(paginationSearchSchema), getAllCoursesController);
// Public GET route — accessible without login
router.get('/courses/:id', getCourseByIdController);
// Public GET route — accessible without login
router.get('/ebooks', validateQuery(paginationSearchSchema), getAllEbooksController);
// Public GET route — accessible without login
router.get('/ebooks/:id', getEbookByIdController);
// Public GET route — accessible without login
router.get('/study-abroad', validateQuery(paginationSearchSchema), getAllStudyAbroadController);
// Public GET route — accessible without login
router.get('/study-abroad/:id', getStudyAbroadByIdController);
// Public GET route — accessible without login
router.get('/short-courses', validateQuery(paginationSearchSchema), getAllShortCoursesController);
// Public GET route — accessible without login
router.get('/short-courses/:id', getShortCourseByIdController);
// Public GET route — accessible without login
router.get('/certified-courses', validateQuery(paginationSearchSchema), getAllCertifiedCoursesController);
// Public GET route — accessible without login
router.get('/certified-courses/:id', getCertifiedCourseByIdController);
// Public GET route — accessible without login
router.get('/training-programs', validateQuery(paginationSearchSchema), getAllTrainingProgramsController);
// Public GET route — accessible without login
router.get('/training-programs/:id', getTrainingProgramByIdController);
// Public GET route — accessible without login
router.get('/corporate-training-programs', validateQuery(paginationSearchSchema), getAllCorporateTrainingProgramsController);
// Public GET route — accessible without login
router.get('/corporate-training-programs/:id', getCorporateTrainingProgramByIdController);
// Public GET route — accessible without login
router.get('/college-training-programs', validateQuery(paginationSearchSchema), getAllCollegeTrainingProgramsController);
// Public GET route — accessible without login
router.get('/college-training-programs/:id', getCollegeTrainingProgramByIdController);

// ADMIN-ONLY from here on
router.use(publicRoute(authenticate, requireAuth));

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         excerpt:
 *           type: string
 *         content:
 *           type: string
 *         imageUrl:
 *           type: string
 *         category:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         status:
 *           type: string
 *           enum: [draft, published]
 *         createdBy:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         creator:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *     Video:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         videoUrl:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         testimonials:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               studentName:
 *                 type: string
 *               studentRole:
 *                 type: string
 *               testimonialText:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               studentImageUrl:
 *                 type: string
 *         faqs:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *         status:
 *           type: string
 *           enum: [draft, published]
 *         createdBy:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         creator:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *     FAQ:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         question:
 *           type: string
 *         answer:
 *           type: string
 *         category:
 *           type: string
 *         createdBy:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         creator:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *     Testimonial:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         authorName:
 *           type: string
 *         role:
 *           type: string
 *         text:
 *           type: string
 *         avatarUrl:
 *           type: string
 *         videoUrl:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, approved]
 *         createdBy:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         creator:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *     Course:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         syllabus:
 *           type: string
 *         videoDemoUrl:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         price:
 *           type: number
 *         status:
 *           type: string
 *           enum: [draft, published]
 *         createdBy:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         creator:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *     Ebook:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         coverImageUrl:
 *           type: string
 *         pdfUrl:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         status:
 *           type: string
 *           enum: [draft, published]
 *         createdBy:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         creator:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *     StudyAbroad:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         city:
 *           type: string
 *         imageUrl:
 *           type: string
 *         universities:
 *           type: array
 *           items:
 *             type: string
 *         avgTuition:
 *           type: number
 *         livingCost:
 *           type: number
 *         description:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         programs:
 *           type: array
 *           items:
 *             type: string
 *             enum: [undergraduate, postgraduate, short_term, scholarship_program]
 *         faqs:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *         status:
 *           type: string
 *           enum: [draft, published]
 *         createdBy:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         creator:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 */

// Blog routes (create/update/delete)
/**
 * @swagger
 * /api/v1/blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [CMS - Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Blog'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *   post:
 *     summary: Create a new blog
 *     tags: [CMS - Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               content:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       409:
 *         description: Blog with this slug already exists
 */
router.post('/blogs', validateSchemaMiddleware(blogSchema), createBlogController);

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   get:
 *     summary: Get blog by ID
 *     tags: [CMS - Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Blog'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Blog not found
 *   put:
 *     summary: Update blog
 *     tags: [CMS - Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               content:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Blog not found
 *       409:
 *         description: Blog with this slug already exists
 *   delete:
 *     summary: Delete blog
 *     tags: [CMS - Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Blog not found
 */
router.put('/blogs/:id', validateSchemaMiddleware(updateBlogSchema), updateBlogController);
router.delete('/blogs/:id', deleteBlogController);

/**
 * @swagger
 * /api/v1/study-abroad:
 *   get:
 *     summary: Get all study abroad records
 *     tags: [CMS - Study Abroad]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *     responses:
 *       200:
 *         description: Study abroad records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/StudyAbroad'
 *   post:
 *     summary: Create a new study abroad record
 *     tags: [CMS - Study Abroad]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *               - universities
 *             properties:
 *               city:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               universities:
 *                 type: array
 *                 items:
 *                   type: string
 *               avgTuition:
 *                 type: number
 *               livingCost:
 *                 type: number
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               programs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [undergraduate, postgraduate, short_term, scholarship_program]
 *               faqs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                     answer:
 *                       type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *     responses:
 *       201:
 *         description: Study abroad record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/StudyAbroad'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

// Video routes
router.post('/videos', validateSchemaMiddleware(videoSchema), createVideoController);
router.get('/videos/:id', getVideoByIdController);
router.put('/videos/:id', validateSchemaMiddleware(updateVideoSchema), updateVideoController);
router.delete('/videos/:id', deleteVideoController);

// FAQ routes
router.post('/faqs', validateSchemaMiddleware(faqSchema), createFAQController);
router.get('/faqs/:id', getFAQByIdController);
router.put('/faqs/:id', validateSchemaMiddleware(updateFaqSchema), updateFAQController);
router.delete('/faqs/:id', deleteFAQController);

// Testimonial routes
router.post('/testimonials', validateSchemaMiddleware(testimonialSchema), createTestimonialController);
router.get('/testimonials/:id', getTestimonialByIdController);
router.put('/testimonials/:id', validateSchemaMiddleware(updateTestimonialSchema), updateTestimonialController);
router.delete('/testimonials/:id', deleteTestimonialController);

// Course routes
router.post('/courses', validateSchemaMiddleware(courseSchema), createCourseController);
router.get('/courses/:id', getCourseByIdController);
router.put('/courses/:id', validateSchemaMiddleware(updateCourseSchema), updateCourseController);
router.delete('/courses/:id', deleteCourseController);
router.get('/courses/:id/curriculum', getCourseCurriculumController);
router.post(
  '/courses/:id/curriculum',
  validateSchemaMiddleware(courseCurriculumUpdateSchema),
  updateCourseCurriculumController
);
router.patch(
  '/courses/:id/short-description',
  validateSchemaMiddleware(courseShortDescriptionSchema),
  patchCourseShortDescriptionController
);
router.get('/courses/:id/mentors', getCourseMentorsController);
router.post(
  '/courses/:id/mentors',
  validateSchemaMiddleware(courseMentorUpdateSchema),
  updateCourseMentorsController
);

// Ebook routes
router.post('/ebooks', validateSchemaMiddleware(ebookSchema), createEbookController);
router.get('/ebooks/:id', getEbookByIdController);
router.put('/ebooks/:id', validateSchemaMiddleware(updateEbookSchema), updateEbookController);
router.delete('/ebooks/:id', deleteEbookController);

// Study Abroad routes
/**
 * @swagger
 * /api/v1/study-abroad/{id}:
 *   get:
 *     summary: Get study abroad record by ID
 *     tags: [CMS - Study Abroad]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Study abroad record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/StudyAbroad'
 *       404:
 *         description: Study abroad record not found
 *   put:
 *     summary: Update study abroad record
 *     tags: [CMS - Study Abroad]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               universities:
 *                 type: array
 *                 items:
 *                   type: string
 *               avgTuition:
 *                 type: number
 *               livingCost:
 *                 type: number
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               programs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [undergraduate, postgraduate, short_term, scholarship_program]
 *               faqs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                     answer:
 *                       type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *     responses:
 *       200:
 *         description: Study abroad record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/StudyAbroad'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Study abroad record not found
 *   delete:
 *     summary: Delete study abroad record
 *     tags: [CMS - Study Abroad]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Study abroad record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Study abroad record not found
 */
router.post('/study-abroad', validateSchemaMiddleware(studyAbroadSchema), createStudyAbroadController);
router.get('/study-abroad/:id', getStudyAbroadByIdController);
router.put('/study-abroad/:id', validateSchemaMiddleware(updateStudyAbroadSchema), updateStudyAbroadController);
router.delete('/study-abroad/:id', deleteStudyAbroadController);

// Short Course routes
router.post('/short-courses', validateSchemaMiddleware(shortCourseSchema), createShortCourseController);
router.put('/short-courses/:id', validateSchemaMiddleware(updateShortCourseSchema), updateShortCourseController);
router.delete('/short-courses/:id', deleteShortCourseController);

// Certified Course routes
router.post('/certified-courses', validateSchemaMiddleware(certifiedCourseSchema), createCertifiedCourseController);
router.put('/certified-courses/:id', validateSchemaMiddleware(updateCertifiedCourseSchema), updateCertifiedCourseController);
router.delete('/certified-courses/:id', deleteCertifiedCourseController);

// Training Program routes (create/update/delete - admin only)
router.post(
  '/training-programs',
  trainingPayloadNormalizer,
  validateSchemaMiddleware(trainingProgramSchema),
  createTrainingProgramController
);
router.put(
  '/training-programs/:id',
  trainingPayloadNormalizer,
  validateSchemaMiddleware(updateTrainingProgramSchema),
  updateTrainingProgramController
);
router.delete('/training-programs/:id', deleteTrainingProgramController);

// Corporate Training Program routes (admin only - create/update/delete)
router.post('/corporate-training-programs', validateSchemaMiddleware(trainingProgramSchema), createCorporateTrainingProgramController);
router.put('/corporate-training-programs/:id', validateSchemaMiddleware(updateTrainingProgramSchema), updateCorporateTrainingProgramController);
router.delete('/corporate-training-programs/:id', deleteCorporateTrainingProgramController);

// College Training Program routes (admin only - create/update/delete)
router.post('/college-training-programs', validateSchemaMiddleware(trainingProgramSchema), createCollegeTrainingProgramController);
router.put('/college-training-programs/:id', validateSchemaMiddleware(updateTrainingProgramSchema), updateCollegeTrainingProgramController);
router.delete('/college-training-programs/:id', deleteCollegeTrainingProgramController);

export default router;
