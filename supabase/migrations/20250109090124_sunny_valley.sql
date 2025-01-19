/*
  # Update user profiles policies

  1. Changes
    - Add insert policy for registration if it doesn't exist
    - Ensure policies are created only if they don't exist
*/

-- Create policies if they don't exist using DO block
DO $$ 
BEGIN
  -- Create "Enable insert for registration" policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Enable insert for registration'
  ) THEN
    CREATE POLICY "Enable insert for registration"
      ON user_profiles
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;