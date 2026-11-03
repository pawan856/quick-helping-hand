-- ==============================================================================
-- HOSPITAL MANAGEMENT SYSTEM - COMPREHENSIVE SEED DATA
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- ==============================================================================

-- 1. Insert Demo Patients
INSERT INTO public.patients (id, full_name, mrn, date_of_birth, gender, phone, email, blood_group, primary_condition, status, risk_score, admitted_at)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Rajesh Sharma', 'MRN-RS101', '1979-05-12', 'Male', '+91 98765 43210', 'rajesh.sharma@example.com', 'B+', 'Hypertension & Acute Coronary Syndrome', 'critical', 88, now() - interval '3 days'),
  ('a2222222-2222-2222-2222-222222222222', 'Priya Patel', 'MRN-PP102', '1992-08-23', 'Female', '+91 98765 43211', 'priya.patel@example.com', 'A+', 'Post-operative Cholecystectomy', 'monitoring', 62, now() - interval '2 days'),
  ('a3333333-3333-3333-3333-333333333333', 'Arjun Singh', 'MRN-AS103', '1965-03-14', 'Male', '+91 98765 43212', 'arjun.singh@example.com', 'O+', 'Type 2 Diabetes Mellitus', 'stable', 35, now() - interval '5 days'),
  ('a4444444-4444-4444-4444-444444444444', 'Kavya Reddy', 'MRN-KR104', '1988-11-04', 'Female', '+91 98765 43213', 'kavya.reddy@example.com', 'AB+', 'Severe Asthma Exacerbation', 'critical', 91, now() - interval '1 day'),
  ('a5555555-5555-5555-5555-555555555555', 'Amit Verma', 'MRN-AV105', '1981-07-29', 'Male', '+91 98765 43214', 'amit.verma@example.com', 'O-', 'Community Acquired Pneumonia', 'monitoring', 68, now() - interval '4 days'),
  ('a6666666-6666-6666-6666-666666666666', 'Sunita Rao', 'MRN-SR106', '1955-12-19', 'Female', '+91 98765 43215', 'sunita.rao@example.com', 'A-', 'Stroke Rehab', 'stable', 25, now() - interval '8 days'),
  ('a7777777-7777-7777-7777-777777777777', 'Vikram Nair', 'MRN-VN107', '1970-02-15', 'Male', '+91 98765 43216', 'vikram.nair@example.com', 'B-', 'Renal Insufficiency', 'monitoring', 74, now() - interval '2 days'),
  ('a8888888-8888-8888-8888-888888888888', 'Meera Iyer', 'MRN-MI108', '1958-09-30', 'Female', '+91 98765 43217', 'meera.iyer@example.com', 'O-', 'Septic Shock / ICU Watch', 'critical', 95, now() - interval '1 day'),
  ('a9999999-9999-9999-9999-999999999999', 'Deepak Chopra', 'MRN-DC109', '1984-06-20', 'Male', '+91 98765 43218', 'deepak.chopra@example.com', 'AB-', 'Routine Orthopedic Checkup', 'discharged', 15, now() - interval '10 days')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  status = EXCLUDED.status,
  risk_score = EXCLUDED.risk_score,
  primary_condition = EXCLUDED.primary_condition;

-- 2. Insert Today's Appointments
INSERT INTO public.appointments (patient_id, scheduled_at, duration_minutes, appointment_type, status, notes)
VALUES
  ('a1111111-1111-1111-1111-111111111111', date_trunc('day', now()) + interval '9 hour', 30, 'Emergency Review', 'in_progress', 'Check ECG and cardiac enzymes.'),
  ('a2222222-2222-2222-2222-222222222222', date_trunc('day', now()) + interval '10 hour 30 minute', 45, 'Follow-up', 'scheduled', 'Post-op wound dressing evaluation.'),
  ('a3333333-3333-3333-3333-333333333333', date_trunc('day', now()) + interval '11 hour 15 minute', 20, 'Consultation', 'completed', 'HbA1c normal range, diet counselling.'),
  ('a4444444-4444-4444-4444-444444444444', date_trunc('day', now()) + interval '14 hour', 30, 'Consultation', 'scheduled', 'Nebulization response test.'),
  ('a5555555-5555-5555-5555-555555555555', date_trunc('day', now()) + interval '15 hour 30 minute', 30, 'Review', 'scheduled', 'Chest X-ray report discussion.'),
  ('a7777777-7777-7777-7777-777777777777', date_trunc('day', now()) + interval '16 hour 45 minute', 30, 'Check-up', 'scheduled', 'Serum creatinine and electrolyte analysis.');

-- 3. Insert Vitals (Timeseries Data for Graphs and Monitor)
INSERT INTO public.vitals (patient_id, heart_rate, bp_systolic, bp_diastolic, spo2, temperature, respiratory_rate, recorded_at)
VALUES
  -- Rajesh Sharma (Critical)
  ('a1111111-1111-1111-1111-111111111111', 112, 155, 96, 93, 38.2, 24, now() - interval '4 hour'),
  ('a1111111-1111-1111-1111-111111111111', 108, 148, 92, 94, 38.0, 22, now() - interval '2 hour'),
  ('a1111111-1111-1111-1111-111111111111', 115, 152, 95, 92, 38.3, 25, now() - interval '30 minute'),

  -- Meera Iyer (Critical)
  ('a8888888-8888-8888-8888-888888888888', 125, 90, 60, 91, 39.1, 28, now() - interval '3 hour'),
  ('a8888888-8888-8888-8888-888888888888', 122, 95, 62, 92, 38.9, 26, now() - interval '1 hour'),

  -- Priya Patel (Monitoring)
  ('a2222222-2222-2222-2222-222222222222', 82, 126, 82, 98, 37.1, 18, now() - interval '5 hour'),
  ('a2222222-2222-2222-2222-222222222222', 78, 122, 80, 98, 36.9, 17, now() - interval '1 hour'),

  -- Arjun Singh (Stable)
  ('a3333333-3333-3333-3333-333333333333', 72, 118, 78, 99, 36.6, 16, now() - interval '6 hour'),
  ('a3333333-3333-3333-3333-333333333333', 70, 120, 80, 99, 36.7, 16, now() - interval '2 hour'),

  -- Kavya Reddy (Critical)
  ('a4444444-4444-4444-4444-444444444444', 118, 138, 88, 90, 37.8, 26, now() - interval '1 hour');

-- 4. Insert Clinical Alerts
INSERT INTO public.alerts (patient_id, severity, category, message, acknowledged, created_at)
VALUES
  ('a8888888-8888-8888-8888-888888888888', 'critical', 'clinical', 'Meera Iyer: SpO2 dropped below 92% (Hypoxia alert) - Immediate intervention required', false, now() - interval '45 minute'),
  ('a1111111-1111-1111-1111-111111111111', 'critical', 'clinical', 'Rajesh Sharma: Systolic BP above 155 mmHg and HR tachycardia (>110 bpm)', false, now() - interval '20 minute'),
  ('a4444444-4444-4444-4444-444444444444', 'high', 'clinical', 'Kavya Reddy: Respiratory rate 26 bpm with wheezing and SpO2 90%', false, now() - interval '1 hour'),
  ('a7777777-7777-7777-7777-777777777777', 'medium', 'clinical', 'Vikram Nair: Elevated potassium levels reported in morning lab panel', false, now() - interval '2 hour'),
  ('a2222222-2222-2222-2222-222222222222', 'low', 'reminder', 'Priya Patel: Post-operative wound review scheduled for 10:30 AM', true, now() - interval '5 hour');
