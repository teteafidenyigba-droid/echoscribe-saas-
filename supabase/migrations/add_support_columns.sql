-- Ajout des colonnes manquantes à support_messages
ALTER TABLE support_messages
  ADD COLUMN IF NOT EXISTS user_id  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS name     TEXT,
  ADD COLUMN IF NOT EXISTS subject  TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'autre';
