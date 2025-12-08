export interface ProgramFilterFields {
  price?: string;
  duration?: string | string[];
  partTime?: string;
  university?: string;
  city?: string;
  keyword?: string[];
}

export interface ProgramFilterOptions {
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  partTime?: boolean;
  university?: string;
  city?: string;
  keyword?: string;
  fields?: ProgramFilterFields;
}

const toArray = (value?: string | string[]): string[] => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

export const applyProgramFilters = <T extends Record<string, any>>(query: T, filters?: ProgramFilterOptions): T => {
  if (!filters) {
    return query;
  }

  const {
    minPrice,
    maxPrice,
    minDuration,
    maxDuration,
    partTime,
    university,
    city,
    keyword,
    fields = {},
  } = filters;

  const ensureComparableField = (fieldName?: string) => {
    if (!fieldName) return undefined;
    (query as any)[fieldName] = (query as any)[fieldName] ?? {};
    return (query as any)[fieldName];
  };

  const applyRange = (fieldName?: string | string[], minimum?: number, maximum?: number) => {
    if (!fieldName || (minimum === undefined && maximum === undefined)) {
      return;
    }

    toArray(fieldName).forEach((field) => {
      if (!field) return;
      const target = ensureComparableField(field);
      if (!target) return;

      if (minimum !== undefined) {
        target.gte = minimum;
      }

      if (maximum !== undefined) {
        target.lte = maximum;
      }
    });
  };

  applyRange(fields.price, minPrice, maxPrice);
  applyRange(fields.duration, minDuration, maxDuration);

  if (fields.partTime && partTime !== undefined) {
    (query as any)[fields.partTime] = partTime;
  }

  if (fields.university && university) {
    (query as any)[fields.university] = { has: university };
  }

  if (fields.city && city) {
    (query as any)[fields.city] = {
      contains: city,
      mode: 'insensitive',
    };
  }

  if (keyword && fields.keyword && fields.keyword.length > 0) {
    const orConditions = fields.keyword
      .filter(Boolean)
      .map((field) => ({
        [field!]: {
          contains: keyword,
          mode: 'insensitive',
        },
      }));

    if (orConditions.length > 0) {
      (query as any).AND = (query as any).AND ?? [];
      (query as any).AND.push({ OR: orConditions });
    }
  }

  return query;
};

