import { Request, Response } from 'express';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';
import {
  // Blog services
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  // Video services
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  // FAQ services
  createFAQ,
  getAllFAQs,
  getFAQById,
  updateFAQ,
  deleteFAQ,
  // Testimonial services
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  // Course services
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseCurriculum,
  updateCourseCurriculum,
  patchCourseShortDescription,
  getCourseMentors,
  updateCourseMentors,
  // Short Course services
  createShortCourse,
  getAllShortCourses,
  getShortCourseById,
  updateShortCourse,
  deleteShortCourse,
  // Certified Course services
  createCertifiedCourse,
  getAllCertifiedCourses,
  getCertifiedCourseById,
  updateCertifiedCourse,
  deleteCertifiedCourse,
  // Ebook services
  createEbook,
  getAllEbooks,
  getEbookById,
  updateEbook,
  deleteEbook,
  // Study Abroad services
  createStudyAbroad,
  getAllStudyAbroad,
  getStudyAbroadById,
  updateStudyAbroad,
  deleteStudyAbroad,
  // Training Program services
  getAllTrainingPrograms,
  getTrainingProgramById,
  createTrainingProgram,
  updateTrainingProgram,
  deleteTrainingProgram,
} from '../services/cmsService';
import {
  BlogInput,
  UpdateBlogInput,
  VideoInput,
  UpdateVideoInput,
  FAQInput,
  UpdateFAQInput,
  TestimonialInput,
  UpdateTestimonialInput,
  CourseInput,
  UpdateCourseInput,
  CourseCurriculumInput,
  CourseShortDescriptionInput,
  CourseMentorInput,
  ShortCourseInput,
  UpdateShortCourseInput,
  CertifiedCourseInput,
  UpdateCertifiedCourseInput,
  EbookInput,
  UpdateEbookInput,
  StudyAbroadInput,
  UpdateStudyAbroadInput,
} from '../validators/cms';
import { paginationSearchSchema, programFilterSchema } from '../utils/validation';
import { NotFoundError } from '../utils/errors';

/**
 * CMS controller
 * Handles all content management operations (admin only)
 */

// Blog controllers
export const createBlogController = asyncHandler(async (req: Request, res: Response) => {
  const blogData: BlogInput = req.body;
  const createdBy = req.user!.id;

  const blog = await createBlog(blogData, createdBy);

  sendSuccess(res, blog, 'Blog created successfully', 201);
});

export const getAllBlogsController = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status } = paginationSearchSchema.parse(req.query);

  const result = await getAllBlogs(page, limit, status);

  sendPaginated(res, result.blogs, result.pagination, 'Blogs retrieved successfully');
});

export const getBlogByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const blog = await getBlogById(id);

  sendSuccess(res, blog, 'Blog retrieved successfully');
});

export const updateBlogController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const blogData: UpdateBlogInput = req.body;

  const blog = await updateBlog(id, blogData);

  sendSuccess(res, blog, 'Blog updated successfully');
});

export const deleteBlogController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteBlog(id);

  sendSuccess(res, result, 'Blog deleted successfully');
});

// Video controllers
export const createVideoController = asyncHandler(async (req: Request, res: Response) => {
  const videoData: VideoInput = req.body;
  const createdBy = req.user!.id;

  const video = await createVideo(videoData, createdBy);

  sendSuccess(res, video, 'Video created successfully', 201);
});

export const getAllVideosController = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status } = paginationSearchSchema.parse(req.query);

  const result = await getAllVideos(page, limit, status);

  sendPaginated(res, result.videos, result.pagination, 'Videos retrieved successfully');
});

export const getVideoByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const video = await getVideoById(id);

  sendSuccess(res, video, 'Video retrieved successfully');
});

export const updateVideoController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const videoData: UpdateVideoInput = req.body;

  const video = await updateVideo(id, videoData);

  sendSuccess(res, video, 'Video updated successfully');
});

export const deleteVideoController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteVideo(id);

  sendSuccess(res, result, 'Video deleted successfully');
});

// FAQ controllers
export const createFAQController = asyncHandler(async (req: Request, res: Response) => {
  const faqData: FAQInput = req.body;
  const createdBy = req.user!.id;

  const faq = await createFAQ(faqData, createdBy);

  sendSuccess(res, faq, 'FAQ created successfully', 201);
});

export const getAllFAQsController = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, category } = paginationSearchSchema.parse(req.query);

  const result = await getAllFAQs(page, limit, category);

  sendPaginated(res, result.faqs, result.pagination, 'FAQs retrieved successfully');
});

export const getFAQByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const faq = await getFAQById(id);

  sendSuccess(res, faq, 'FAQ retrieved successfully');
});

export const updateFAQController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const faqData: UpdateFAQInput = req.body;

  const faq = await updateFAQ(id, faqData);

  sendSuccess(res, faq, 'FAQ updated successfully');
});

export const deleteFAQController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteFAQ(id);

  sendSuccess(res, result, 'FAQ deleted successfully');
});

// Testimonial controllers
export const createTestimonialController = asyncHandler(async (req: Request, res: Response) => {
  const testimonialData: TestimonialInput = req.body;
  const createdBy = req.user!.id;

  const testimonial = await createTestimonial(testimonialData, createdBy);

  sendSuccess(res, testimonial, 'Testimonial created successfully', 201);
});

export const getAllTestimonialsController = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status } = paginationSearchSchema.parse(req.query);

  const result = await getAllTestimonials(page, limit, status);

  sendPaginated(res, result.testimonials, result.pagination, 'Testimonials retrieved successfully');
});

export const getTestimonialByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const testimonial = await getTestimonialById(id);

  sendSuccess(res, testimonial, 'Testimonial retrieved successfully');
});

export const updateTestimonialController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const testimonialData: UpdateTestimonialInput = req.body;

  const testimonial = await updateTestimonial(id, testimonialData);

  sendSuccess(res, testimonial, 'Testimonial updated successfully');
});

export const deleteTestimonialController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteTestimonial(id);

  sendSuccess(res, result, 'Testimonial deleted successfully');
});

// Course controllers
export const createCourseController = asyncHandler(async (req: Request, res: Response) => {
  const courseData: CourseInput = req.body;
  const createdBy = req.user!.id;

  const course = await createCourse(courseData, createdBy);

  sendSuccess(res, course, 'Course created successfully', 201);
});

export const getAllCoursesController = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status } = paginationSearchSchema.parse(req.query);
  const programFilters = programFilterSchema.parse(req.query);

  const result = await getAllCourses(page, limit, status, programFilters);

  sendPaginated(res, result.courses, result.pagination, 'Courses retrieved successfully');
});

export const getCourseByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const course = await getCourseById(id);

  sendSuccess(res, course, 'Course retrieved successfully');
});

export const updateCourseController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const courseData: UpdateCourseInput = req.body;

  const course = await updateCourse(id, courseData);

  sendSuccess(res, course, 'Course updated successfully');
});

export const deleteCourseController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteCourse(id);

  sendSuccess(res, result, 'Course deleted successfully');
});

export const getCourseCurriculumController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const curriculum = await getCourseCurriculum(id);

  sendSuccess(res, curriculum, 'Course curriculum retrieved successfully');
});

export const updateCourseCurriculumController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const curriculumData: CourseCurriculumInput = req.body;

  const curriculum = await updateCourseCurriculum(id, curriculumData);

  sendSuccess(res, curriculum, 'Course curriculum updated successfully');
});

export const patchCourseShortDescriptionController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const shortDescriptionData: CourseShortDescriptionInput = req.body;

  const course = await patchCourseShortDescription(id, shortDescriptionData);

  sendSuccess(res, course, 'Course short description updated successfully');
});

export const getCourseMentorsController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const mentors = await getCourseMentors(id);

  sendSuccess(res, mentors, 'Course mentors retrieved successfully');
});

export const updateCourseMentorsController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const mentorData: CourseMentorInput = req.body;

  const mentors = await updateCourseMentors(id, mentorData);

  sendSuccess(res, mentors, 'Course mentors updated successfully');
});

// Ebook controllers
export const createEbookController = asyncHandler(async (req: Request, res: Response) => {
  const ebookData: EbookInput = req.body;
  const createdBy = req.user!.id;

  const ebook = await createEbook(ebookData, createdBy);

  sendSuccess(res, ebook, 'Ebook created successfully', 201);
});

export const getAllEbooksController = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status } = paginationSearchSchema.parse(req.query);

  const result = await getAllEbooks(page, limit, status);

  sendPaginated(res, result.ebooks, result.pagination, 'Ebooks retrieved successfully');
});

export const getEbookByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const ebook = await getEbookById(id);

  sendSuccess(res, ebook, 'Ebook retrieved successfully');
});

export const updateEbookController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const ebookData: UpdateEbookInput = req.body;

  const ebook = await updateEbook(id, ebookData);

  sendSuccess(res, ebook, 'Ebook updated successfully');
});

export const deleteEbookController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteEbook(id);

  sendSuccess(res, result, 'Ebook deleted successfully');
});

// Study Abroad controllers
export const createStudyAbroadController = asyncHandler(async (req: Request, res: Response) => {
  const studyAbroadData: StudyAbroadInput = req.body;
  const createdBy = req.user!.id;

  const studyAbroad = await createStudyAbroad(studyAbroadData, createdBy);

  sendSuccess(res, studyAbroad, 'Study abroad record created successfully', 201);
});

export const getAllStudyAbroadController = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status } = paginationSearchSchema.parse(req.query);
  const programFilters = programFilterSchema.parse(req.query);

  const result = await getAllStudyAbroad(page, limit, status, programFilters);

  sendPaginated(res, result.studyAbroad, result.pagination, 'Study abroad records retrieved successfully');
});

export const getStudyAbroadByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const studyAbroad = await getStudyAbroadById(id);

  sendSuccess(res, studyAbroad, 'Study abroad record retrieved successfully');
});

export const updateStudyAbroadController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const studyAbroadData: UpdateStudyAbroadInput = req.body;

  const studyAbroad = await updateStudyAbroad(id, studyAbroadData);

  sendSuccess(res, studyAbroad, 'Study abroad record updated successfully');
});

export const deleteStudyAbroadController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteStudyAbroad(id);

  sendSuccess(res, result, 'Study abroad record deleted successfully');
});

// Training Program controllers
export const getAllTrainingProgramsController = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status, search } = paginationSearchSchema.parse(req.query);
  const { trainingType, programTrainingType } = req.query;

  const result = await getAllTrainingPrograms(
    page,
    limit,
    status,
    trainingType as string | undefined,
    search,
    programTrainingType as string | undefined
  );

  sendPaginated(res, result.trainingPrograms, result.pagination, 'Training programs retrieved successfully');
});

export const getTrainingProgramByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const trainingProgram = await getTrainingProgramById(id);

  sendSuccess(res, trainingProgram, 'Training program retrieved successfully');
});

// Short Course controllers
export const createShortCourseController = asyncHandler(async (req: Request, res: Response) => {
  const shortCourseData: ShortCourseInput = req.body;
  const createdBy = req.user!.id;

  const shortCourse = await createShortCourse(shortCourseData, createdBy);

  sendSuccess(res, shortCourse, 'Short course created successfully', 201);
});

export const getAllShortCoursesController = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status } = paginationSearchSchema.parse(req.query);

  const result = await getAllShortCourses(page, limit, status);

  sendPaginated(res, result.shortCourses, result.pagination, 'Short courses retrieved successfully');
});

export const getShortCourseByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const shortCourse = await getShortCourseById(id);

  sendSuccess(res, shortCourse, 'Short course retrieved successfully');
});

export const updateShortCourseController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const shortCourseData: UpdateShortCourseInput = req.body;

  const shortCourse = await updateShortCourse(id, shortCourseData);

  sendSuccess(res, shortCourse, 'Short course updated successfully');
});

export const deleteShortCourseController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteShortCourse(id);

  sendSuccess(res, result, 'Short course deleted successfully');
});

// Certified Course controllers
export const createCertifiedCourseController = asyncHandler(async (req: Request, res: Response) => {
  const certifiedCourseData: CertifiedCourseInput = req.body;
  const createdBy = req.user!.id;

  const certifiedCourse = await createCertifiedCourse(certifiedCourseData, createdBy);

  sendSuccess(res, certifiedCourse, 'Certified course created successfully', 201);
});

export const getAllCertifiedCoursesController = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status } = paginationSearchSchema.parse(req.query);

  const result = await getAllCertifiedCourses(page, limit, status);

  sendPaginated(res, result.certifiedCourses, result.pagination, 'Certified courses retrieved successfully');
});

export const getCertifiedCourseByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const certifiedCourse = await getCertifiedCourseById(id);

  sendSuccess(res, certifiedCourse, 'Certified course retrieved successfully');
});

export const updateCertifiedCourseController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const certifiedCourseData: UpdateCertifiedCourseInput = req.body;

  const certifiedCourse = await updateCertifiedCourse(id, certifiedCourseData);

  sendSuccess(res, certifiedCourse, 'Certified course updated successfully');
});

export const deleteCertifiedCourseController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteCertifiedCourse(id);

  sendSuccess(res, result, 'Certified course deleted successfully');
});

// Training Program controllers
export const createTrainingProgramController = asyncHandler(async (req: Request, res: Response) => {
  const trainingProgramData = req.body;
  const createdBy = req.user!.id;

  const trainingProgram = await createTrainingProgram(trainingProgramData, createdBy);

  sendSuccess(res, trainingProgram, 'Training program created successfully', 201);
});

export const updateTrainingProgramController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const trainingProgramData = req.body;

  const trainingProgram = await updateTrainingProgram(id, trainingProgramData);

  sendSuccess(res, trainingProgram, 'Training program updated successfully');
});

export const deleteTrainingProgramController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteTrainingProgram(id);

  sendSuccess(res, result, 'Training program deleted successfully');
});

// Corporate Training Program controllers
export const getAllCorporateTrainingProgramsController = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status, search } = paginationSearchSchema.parse(req.query);

  const result = await getAllTrainingPrograms(
    page,
    limit,
    status,
    'corporate', // Automatically filter by corporate
    search
  );

  sendPaginated(res, result.trainingPrograms, result.pagination, 'Corporate training programs retrieved successfully');
});

export const getCorporateTrainingProgramByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const trainingProgram = await getTrainingProgramById(id);

  // Verify it's a corporate training program
  if (trainingProgram.trainingType !== 'corporate') {
    throw new NotFoundError('Corporate training program not found');
  }

  sendSuccess(res, trainingProgram, 'Corporate training program retrieved successfully');
});

export const createCorporateTrainingProgramController = asyncHandler(async (req: Request, res: Response) => {
  const trainingProgramData = req.body;
  const createdBy = req.user!.id;

  // Automatically set trainingType to corporate
  trainingProgramData.trainingType = 'corporate';

  const trainingProgram = await createTrainingProgram(trainingProgramData, createdBy);

  sendSuccess(res, trainingProgram, 'Corporate training program created successfully', 201);
});

export const updateCorporateTrainingProgramController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const trainingProgramData = req.body;

  // Verify it's a corporate training program
  const existing = await getTrainingProgramById(id);
  if (existing.trainingType !== 'corporate') {
    throw new NotFoundError('Corporate training program not found');
  }

  // Ensure trainingType remains corporate
  trainingProgramData.trainingType = 'corporate';

  const trainingProgram = await updateTrainingProgram(id, trainingProgramData);

  sendSuccess(res, trainingProgram, 'Corporate training program updated successfully');
});

export const deleteCorporateTrainingProgramController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verify it's a corporate training program
  const existing = await getTrainingProgramById(id);
  if (existing.trainingType !== 'corporate') {
    throw new NotFoundError('Corporate training program not found');
  }

  const result = await deleteTrainingProgram(id);

  sendSuccess(res, result, 'Corporate training program deleted successfully');
});

// College Training Program controllers
export const getAllCollegeTrainingProgramsController = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status, search } = paginationSearchSchema.parse(req.query);

  const result = await getAllTrainingPrograms(
    page,
    limit,
    status,
    'college', // Automatically filter by college
    search
  );

  sendPaginated(res, result.trainingPrograms, result.pagination, 'College training programs retrieved successfully');
});

export const getCollegeTrainingProgramByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const trainingProgram = await getTrainingProgramById(id);

  // Verify it's a college training program
  if (trainingProgram.trainingType !== 'college') {
    throw new NotFoundError('College training program not found');
  }

  sendSuccess(res, trainingProgram, 'College training program retrieved successfully');
});

export const createCollegeTrainingProgramController = asyncHandler(async (req: Request, res: Response) => {
  const trainingProgramData = req.body;
  const createdBy = req.user!.id;

  // Automatically set trainingType to college
  trainingProgramData.trainingType = 'college';

  const trainingProgram = await createTrainingProgram(trainingProgramData, createdBy);

  sendSuccess(res, trainingProgram, 'College training program created successfully', 201);
});

export const updateCollegeTrainingProgramController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const trainingProgramData = req.body;

  // Verify it's a college training program
  const existing = await getTrainingProgramById(id);
  if (existing.trainingType !== 'college') {
    throw new NotFoundError('College training program not found');
  }

  // Ensure trainingType remains college
  trainingProgramData.trainingType = 'college';

  const trainingProgram = await updateTrainingProgram(id, trainingProgramData);

  sendSuccess(res, trainingProgram, 'College training program updated successfully');
});

export const deleteCollegeTrainingProgramController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verify it's a college training program
  const existing = await getTrainingProgramById(id);
  if (existing.trainingType !== 'college') {
    throw new NotFoundError('College training program not found');
  }

  const result = await deleteTrainingProgram(id);

  sendSuccess(res, result, 'College training program deleted successfully');
});