/*
  # Add reactions to example confessions

  1. Updates
    - Add realistic reaction counts (20-30) to existing example confessions
    - Create varied reaction patterns for each confession type

  2. Data
    - Generate reactions for each example confession
    - Use different emoji combinations based on confession content
    - Ensure reaction counts are between 20-30 per confession
*/

DO $$
DECLARE
  confession_record RECORD;
  demo_user_id uuid;
  reaction_user_id uuid;
  emoji_list text[];
  emoji text;
  reaction_count integer;
  i integer;
BEGIN
  -- Get demo user ID
  SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@burnafterlistening.com';
  
  IF demo_user_id IS NULL THEN
    RAISE NOTICE 'Demo user not found, skipping reactions';
    RETURN;
  END IF;

  -- Create additional demo users for reactions
  FOR i IN 1..50 LOOP
    reaction_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      reaction_user_id,
      'authenticated',
      'authenticated',
      'reactor' || i || '@example.com',
      crypt('password123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      false,
      '',
      '',
      '',
      ''
    ) ON CONFLICT (id) DO NOTHING;
  END LOOP;

  -- Add reactions to each confession
  FOR confession_record IN 
    SELECT id, title, content FROM confessions WHERE user_id = demo_user_id
  LOOP
    -- Determine emoji set based on confession content
    IF confession_record.content ILIKE '%love%' OR confession_record.content ILIKE '%heart%' THEN
      emoji_list := ARRAY['💔', '😭', '❤️', '😱', '🙏'];
    ELSIF confession_record.content ILIKE '%guilt%' OR confession_record.content ILIKE '%sorry%' OR confession_record.content ILIKE '%regret%' THEN
      emoji_list := ARRAY['😭', '🙏', '💔', '😤', '😱'];
    ELSIF confession_record.content ILIKE '%money%' OR confession_record.content ILIKE '%stole%' OR confession_record.content ILIKE '%theft%' THEN
      emoji_list := ARRAY['😱', '😤', '😭', '🤯', '🙏'];
    ELSIF confession_record.content ILIKE '%lie%' OR confession_record.content ILIKE '%lied%' OR confession_record.content ILIKE '%fake%' THEN
      emoji_list := ARRAY['🤯', '😱', '😤', '😭', '💔'];
    ELSIF confession_record.content ILIKE '%family%' OR confession_record.content ILIKE '%parent%' OR confession_record.content ILIKE '%sibling%' THEN
      emoji_list := ARRAY['💔', '😭', '🙏', '😱', '❤️'];
    ELSE
      emoji_list := ARRAY['😱', '💔', '😭', '😤', '🤯', '❤️', '😂', '🙏'];
    END IF;

    -- Add 20-30 reactions per confession
    reaction_count := 20 + floor(random() * 11)::integer; -- Random between 20-30
    
    FOR i IN 1..reaction_count LOOP
      -- Pick random emoji from the set
      emoji := emoji_list[1 + floor(random() * array_length(emoji_list, 1))::integer];
      
      -- Pick random user
      SELECT id INTO reaction_user_id 
      FROM auth.users 
      WHERE email LIKE 'reactor%@example.com' 
      ORDER BY random() 
      LIMIT 1;
      
      -- Insert reaction (ignore conflicts for duplicate user+emoji combinations)
      INSERT INTO reactions (confession_id, user_id, emoji)
      VALUES (confession_record.id, reaction_user_id, emoji)
      ON CONFLICT (confession_id, user_id, emoji) DO NOTHING;
    END LOOP;
    
    RAISE NOTICE 'Added reactions to confession: %', confession_record.title;
  END LOOP;

EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error adding reactions: %', SQLERRM;
END $$;