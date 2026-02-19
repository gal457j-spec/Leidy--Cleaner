-- Add moderation and image support to reviews
ALTER TABLE reviews
  ADD COLUMN is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- index for approval
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);
