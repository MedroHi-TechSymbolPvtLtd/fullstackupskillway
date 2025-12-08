import { slugSchema } from './validation';

type AnyRecord = Record<string, any>;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const parseNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }

  if (isNonEmptyString(value)) {
    const sanitized = value.replace(/[,%]/g, '').trim();
    const parsed = Number(sanitized);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const parseInteger = (value: unknown): number | undefined => {
  const parsed = parseNumber(value);
  if (parsed === undefined) return undefined;
  return Math.trunc(parsed);
};

const normalizeStatus = (value: unknown): string | undefined => {
  if (!isNonEmptyString(value)) return undefined;
  const lower = value.trim().toLowerCase();
  if (['draft', 'published', 'archived'].includes(lower)) {
    return lower;
  }
  return undefined;
};

const normalizeTrainingType = (value: unknown): 'corporate' | 'college' | undefined => {
  if (!isNonEmptyString(value)) return undefined;
  const lower = value.trim().toLowerCase();
  if (lower === 'corporate' || lower === 'college') {
    return lower;
  }
  return undefined;
};

const normalizeSlug = (value: unknown): string | undefined => {
  if (!isNonEmptyString(value)) return undefined;
  try {
    slugSchema.parse(value);
    return value.trim();
  } catch {
    return undefined;
  }
};

const mapFaqs = (faqs?: unknown): any[] | undefined => {
  if (!Array.isArray(faqs)) return undefined;
  const mapped = faqs
    .map((faq) => ({
      question: faq?.question ?? faq?.question_text ?? faq?.q ?? '',
      answer: faq?.answer ?? faq?.a ?? '',
    }))
    .filter((faq) => isNonEmptyString(faq.question) && isNonEmptyString(faq.answer));

  return mapped.length ? mapped : undefined;
};

const mapTestimonials = (testimonials?: unknown): any[] | undefined => {
  if (!Array.isArray(testimonials)) return undefined;
  const mapped = testimonials
    .map((item) => {
      const rating = parseNumber(item?.rating);
      return {
        studentName: item?.studentName ?? item?.name ?? 'Anonymous',
        studentRole: item?.studentRole ?? item?.role ?? item?.company,
        testimonialText: item?.testimonialText ?? item?.feedback ?? item?.quote ?? '',
        rating: rating ?? undefined,
        studentImageUrl: item?.studentImageUrl ?? item?.avatar ?? undefined,
      };
    })
    .filter((item) => isNonEmptyString(item.studentName) && isNonEmptyString(item.testimonialText));

  return mapped.length ? mapped : undefined;
};

const normalizeCurriculumEntries = (value: unknown): any[] | undefined => {
  if (!value) return undefined;

  const toEntry = (module: any, index: number) => {
    if (!module) return undefined;
    const title =
      module?.module_title ||
      module?.moduleTitle ||
      module?.title ||
      `Module ${index + 1}`;
    if (!isNonEmptyString(title)) return undefined;
    const content = module?.content ?? module?.description ?? '';
    const hours = parseNumber(module?.hours);
    return {
      title,
      content,
      hours: hours ?? undefined,
    };
  };

  if (Array.isArray(value)) {
    const modules = value
      .map(toEntry)
      .filter(Boolean);
    return modules.length ? modules : undefined;
  }

  if (typeof value === 'object') {
    const single = toEntry(value, 0);
    return single ? [single] : undefined;
  }

  return undefined;
};

const mapCurriculumFromSyllabus = (syllabus?: unknown): { curriculum?: any[]; syllabus?: string } => {
  const modules = normalizeCurriculumEntries(syllabus);
  if (!modules) return {};

  const syllabusText = modules
    .map((module) =>
      module.content ? `${module.title}: ${module.content}` : module.title,
    )
    .join('\n');

  return {
    curriculum: modules,
    syllabus: syllabusText || undefined,
  };
};

const mapMasteredTools = (tools?: unknown): any[] | undefined => {
  if (!tools) return undefined;

  const normalizeTool = (tool: any) => {
    if (!tool) return undefined;
    const name = tool?.name ?? tool?.title;
    if (!isNonEmptyString(name)) return undefined;
    return {
      name,
      url: tool?.url ?? tool?.logoUrl ?? tool?.link,
    };
  };

  if (Array.isArray(tools)) {
    const mapped = tools.map(normalizeTool).filter(Boolean);
    return mapped.length ? mapped : undefined;
  }

  const single = normalizeTool(tools);
  return single ? [single] : undefined;
};

const mapStringArray = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    const clean = value
      .map((item) => (isNonEmptyString(item) ? item.trim() : undefined))
      .filter(Boolean) as string[];
    return clean.length ? clean : undefined;
  }

  if (isNonEmptyString(value)) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return undefined;
};

export const normalizeTrainingPayload = (payload: AnyRecord): AnyRecord => {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  const normalized: AnyRecord = { ...payload };

  const assign = (key: string, value: unknown) => {
    if (value === undefined || value === null || value === '') return;
    normalized[key] = value;
  };

  // Top-level simple mappings
  assign('programName', payload.programName ?? payload.name);
  assign('programTitle', payload.programTitle ?? payload.program_title);
  assign('durationSummary', payload.duration);
  assign('timelineSummary', payload.month_and_hour);
  assign('testimonialHighlight', payload.testimonial);
  assign('skills', mapStringArray(payload.skills));
  assign('masteredTools', mapMasteredTools(payload.mastered_tool ?? payload.masteredTools));
  const directCurriculum = normalizeCurriculumEntries(payload.curriculum);
  assign('curriculum', directCurriculum ?? normalized.curriculum);
  if (directCurriculum && !normalized.syllabus) {
    const syllabusText = directCurriculum
      .map((module: any) =>
        module.content ? `${module.title}: ${module.content}` : module.title,
      )
      .join('\n');
    assign('syllabus', syllabusText || normalized.syllabus);
  }
  assign('faqs', mapFaqs(payload.faq ?? payload.faqs));
  assign('testimonials', mapTestimonials(payload.testimonials));

  if (payload.placement_rate && !normalized.placementRate) {
    assign('placementRate', parseNumber(payload.placement_rate));
  }

  // Basic information block
  if (payload.basic_information) {
    const info = payload.basic_information;
    assign('title', info.title ?? normalized.title);
    assign('slug', normalizeSlug(info.slug) ?? normalized.slug);
    assign('description', info.description ?? normalized.description);
    assign('videoDemoUrl', info.video_demo_url ?? normalized.videoDemoUrl);
    assign('cardImageUrl', info.card_image_url ?? normalized.cardImageUrl);

    const syllabusResult = mapCurriculumFromSyllabus(info.syllabus);
    assign('curriculum', syllabusResult.curriculum ?? normalized.curriculum);
    assign('syllabus', syllabusResult.syllabus ?? normalized.syllabus);
  }

  // Program details block
  if (payload.program_details) {
    const details = payload.program_details;

    const price = parseNumber(details.price);
    if (price !== undefined) assign('price', price);

    const durationMonths = parseInteger(details.duration_months);
    if (durationMonths !== undefined) assign('durationMonths', durationMonths);

    const durationHours = parseInteger(details.duration_hours);
    if (durationHours !== undefined) assign('durationHours', durationHours);

    const placementRate = parseNumber(details.placement_rate);
    if (placementRate !== undefined) assign('placementRate', placementRate);

    assign('trainingType', normalizeTrainingType(details.training_type));
    assign('status', normalizeStatus(details.status));
    assign('successMetric', details.success_metric);
    assign('tags', mapStringArray(details.tags));
    assign('badges', mapStringArray(details.badges));
  }

  // FAQ/testimonials fallback
  assign('faqs', mapFaqs(normalized.faqs ?? payload.program_details?.faqs ?? payload.faq));
  assign('testimonials', mapTestimonials(normalized.testimonials ?? payload.program_details?.testimonials));

  // Ensure title & slug fallback
  if (!normalized.title) {
    assign(
      'title',
      payload.program_title ??
        payload.name ??
        payload.programName ??
        normalized.programTitle ??
        normalized.programName,
    );
  }

  if (!normalized.slug && normalized.title) {
    const autoSlug = normalized.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    assign('slug', normalizeSlug(autoSlug));
  }

  return normalized;
};

