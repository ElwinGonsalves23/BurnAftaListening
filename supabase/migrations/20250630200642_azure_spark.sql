/*
  # Add comprehensive example confessions for demonstration

  1. Demo Data
    - Create varied example confessions with different themes
    - Include confessions with both titles and content for narration
    - Set burn times to allow for testing
    - Add diverse tags for categorization
*/

-- First, clean up any existing demo confessions
DELETE FROM confessions WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'demo@burnafterlistening.com'
);

-- Create comprehensive example confessions
DO $$
DECLARE
  demo_user_id uuid;
BEGIN
  -- Get or create demo user
  SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@burnafterlistening.com';
  
  IF demo_user_id IS NULL THEN
    demo_user_id := gen_random_uuid();
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
      demo_user_id,
      'authenticated',
      'authenticated',
      'demo@burnafterlistening.com',
      crypt('demopassword', gen_salt('bf')),
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
    );
  END IF;

  -- Insert diverse example confessions
  INSERT INTO confessions (user_id, title, type, content, tags, burn_after) VALUES
  
  (demo_user_id, 'The Secret I''ve Kept for Years', 'text', 
   'I''ve been pretending to be someone I''m not for so long that I''ve forgotten who I really am. Every day I put on this mask, and everyone believes it''s the real me. But deep down, I''m terrified that if people knew the real me, they would all leave. The loneliness of living this lie is suffocating, but I don''t know how to stop anymore.',
   ARRAY['identity', 'loneliness', 'authenticity'], 
   now() + interval '8 minutes'),

  (demo_user_id, 'What Happened That Night', 'text',
   'Three months ago, I was driving home after having a few drinks. I wasn''t drunk, but I wasn''t completely sober either. I hit something on a dark road and drove away in panic. The next day, I saw on the news that someone''s dog had been found dead on that same road. I''ve been living with this guilt ever since, and I can''t bring myself to come forward.',
   ARRAY['guilt', 'accident', 'regret'],
   now() + interval '12 minutes'),

  (demo_user_id, 'My Forbidden Love', 'text',
   'I''m in love with my best friend''s partner. It started as innocent admiration, but over the past year it''s grown into something I can''t control. Every time we''re all together, I have to pretend everything is normal while my heart is breaking. I would never act on these feelings, but the guilt of having them is eating me alive.',
   ARRAY['love', 'friendship', 'forbidden'],
   now() + interval '15 minutes'),

  (demo_user_id, 'The Money I Stole', 'text',
   'When I was 16, I stole $200 from my grandmother''s purse to buy concert tickets. She never found out, but she spent weeks looking for that money, thinking she had lost it. She even blamed herself for being forgetful. She passed away last year, and I never got the chance to confess or pay her back. The guilt haunts me every single day.',
   ARRAY['theft', 'family', 'regret'],
   now() + interval '10 minutes'),

  (demo_user_id, 'My Double Life Online', 'text',
   'For the past two years, I''ve been living a completely different life online. I created a fake identity with a different name, job, and even appearance using AI-generated photos. I''ve made real friends who think they know me, but everything about me is a lie. I''m addicted to this fantasy version of myself, but I know it has to end.',
   ARRAY['deception', 'online', 'identity'],
   now() + interval '20 minutes'),

  (demo_user_id, 'The Affair That Destroyed Everything', 'text',
   'I had an affair with my colleague for six months. My spouse never found out, but the guilt destroyed our marriage anyway. I became distant, paranoid, and angry at myself. We divorced last year, and they still don''t know the real reason why I changed. I let them believe it was their fault, and that makes me a monster.',
   ARRAY['affair', 'marriage', 'guilt'],
   now() + interval '25 minutes'),

  (demo_user_id, 'What I Did to My Sibling', 'text',
   'When we were kids, I convinced my younger brother that he was adopted as a cruel joke. He believed it for years and it affected his relationship with our parents. Even after I told him the truth, the damage was done. He still struggles with feeling like he doesn''t belong in our family, and it''s all my fault.',
   ARRAY['family', 'cruelty', 'childhood'],
   now() + interval '18 minutes'),

  (demo_user_id, 'The Lie That Got Me Everything', 'text',
   'I lied about having cancer to get sympathy and attention from my friends and family. People donated money, spent time with me, and treated me like I was dying. After six months, I had to fake a recovery. I still have all that money, and everyone thinks I''m a miracle survivor. I''m disgusted with myself.',
   ARRAY['lies', 'manipulation', 'illness'],
   now() + interval '30 minutes'),

  (demo_user_id, 'My Addiction Nobody Knows About', 'text',
   'I''m addicted to shoplifting. It''s not about the money or even wanting the items. It''s about the rush, the adrenaline, the feeling of getting away with something. I''ve stolen hundreds of dollars worth of things I don''t even use. I know I''ll get caught eventually, but I can''t stop myself.',
   ARRAY['addiction', 'theft', 'compulsion'],
   now() + interval '22 minutes'),

  (demo_user_id, 'The Truth About My Success', 'text',
   'Everyone thinks I''m this successful entrepreneur who built my business from nothing. The truth is, I embezzled money from my previous employer to fund my startup. I''ve paid it back now, but my entire success is built on theft. Every compliment about my achievements feels like a knife in my chest.',
   ARRAY['success', 'theft', 'business'],
   now() + interval '35 minutes'),

  (demo_user_id, 'What I Saw and Never Reported', 'text',
   'Two years ago, I witnessed my neighbor hitting their child in their backyard. It was clearly abuse, and I should have called the authorities immediately. But I was scared of getting involved, of potential retaliation, of being wrong. I convinced myself it was a one-time thing. I still see that family, and the guilt of my inaction haunts me.',
   ARRAY['witness', 'abuse', 'inaction'],
   now() + interval '28 minutes'),

  (demo_user_id, 'My Secret Eating Disorder', 'text',
   'I''ve been bulimic for five years, and nobody knows. I''ve become an expert at hiding it - timing my meals, making excuses, covering up the evidence. My family and friends think I''m naturally thin and healthy. The shame and secrecy are almost worse than the physical effects. I want help but I''m terrified of anyone finding out.',
   ARRAY['eating-disorder', 'health', 'secrecy'],
   now() + interval '40 minutes');

EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error creating example confessions: %', SQLERRM;
END $$;