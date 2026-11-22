import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Radio,
  User,
  Mail,
  Lock,
  Globe,
  ArrowRight,
  Eye,
  EyeOff,
  Satellite
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Controlled Component State (React useState - Single Source of Truth)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: '',
    payloadMode: 'TT&C / Housekeeping',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Handle Controlled Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: val
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form Validation Engine
  const validateForm = () => {
    const newErrors = {};

    // 1. Name is not empty
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name / Operator ID is required and cannot be empty.';
    }

    // 2. Email contains @
    if (!formData.email.trim()) {
      newErrors.email = 'Academic or station email address is required.';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Valid email must contain "@" (e.g. operator@somaiya.edu).';
    }

    // 3. Password is at least 6 characters
    if (!formData.password) {
      newErrors.password = 'Access passcode is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = `Passcode is ${formData.password.length} chars. Must be at least 6 characters.`;
    }

    // 4. Select dropdown (Country / Ground station node) must be selected
    if (!formData.country) {
      newErrors.country = 'Please select a Ground Station / Earth Node location.';
    }

    // 5. Checkbox (agree to terms) must be checked before submission
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must declare compliance with ITU Amateur Radio Satellite Regulations.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission Handler
  const handleSubmit = (e) => {
    // Prevent default browser reload using event.preventDefault()
    e.preventDefault();

    if (validateForm()) {
      const record = {
        ...formData,
        callsign: `VU2-${formData.name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'SOMI'}`,
        timestamp: new Date().toLocaleTimeString()
      };
      register(record);
      setSubmittedData(record);
      setErrors({});
    } else {
      setSubmittedData(null);
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '2rem auto', padding: '0 1.5rem 4rem' }}>
      <div style={{
        backgroundColor: '#080b12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(20px)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#04060a',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)'
            }}>
              <Satellite size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.02em' }}>
                Ground Station Node Registration
              </h1>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
                SomaiyaSat &amp; SomaiyaPod Orbital Telemetry Network Provisioning
              </p>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Form & Live Validation Matrix */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem'
        }}>
          {/* Left Column: Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Field 1: Name */}
            <div style={{ marginBottom: '1.15rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: '600', marginBottom: '5px', color: '#cbd5e1' }}>
                <User size={14} color="#38bdf8" /> Full Name / Station Operator <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Student Research Engineer"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '8px',
                  backgroundColor: '#04060a',
                  border: errors.name ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              {errors.name && (
                <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> {errors.name}
                </div>
              )}
            </div>

            {/* Field 2: Email */}
            <div style={{ marginBottom: '1.15rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: '600', marginBottom: '5px', color: '#cbd5e1' }}>
                <Mail size={14} color="#38bdf8" /> Academic / Station Email Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="operator@somaiya.edu"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '8px',
                  backgroundColor: '#04060a',
                  border: errors.email ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              {errors.email && (
                <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> {errors.email}
                </div>
              )}
            </div>

            {/* Field 3: Password */}
            <div style={{ marginBottom: '1.15rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: '600', marginBottom: '5px', color: '#cbd5e1' }}>
                <Lock size={14} color="#38bdf8" /> Station Access Passcode (min. 6 chars) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.7rem 2.4rem 0.7rem 0.9rem',
                    borderRadius: '8px',
                    backgroundColor: '#04060a',
                    border: errors.password ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                  title={showPassword ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> {errors.password}
                </div>
              )}
            </div>

            {/* Field 4: Dropdown */}
            <div style={{ marginBottom: '1.15rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: '600', marginBottom: '5px', color: '#cbd5e1' }}>
                <Globe size={14} color="#38bdf8" /> Ground Station Earth Node Location <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '8px',
                  backgroundColor: '#04060a',
                  border: errors.country ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
                  color: formData.country ? '#ffffff' : '#94a3b8',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                <option value="">-- Select Ground Station Location --</option>
                <option value="India - Mumbai (KJSSE Ground Command)">India - Mumbai (KJSSE Ground Command)</option>
                <option value="Finland - Helsinki (ReOrbit Substation)">Finland - Helsinki (ReOrbit Substation)</option>
                <option value="USA - NASA Satellite Tracking Ground Net">USA - NASA Satellite Tracking Ground Net</option>
                <option value="Germany - DLR Amateur Radio Earth Station">Germany - DLR Amateur Radio Earth Station</option>
                <option value="Japan - JAXA University Ground Station">Japan - JAXA University Ground Station</option>
              </select>
              {errors.country && (
                <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> {errors.country}
                </div>
              )}
            </div>

            {/* Field 5: Payload Mode */}
            <div style={{ marginBottom: '1.15rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: '600', marginBottom: '5px', color: '#cbd5e1' }}>
                <Radio size={14} color="#38bdf8" /> Primary Telemetry Payload Priority
              </label>
              <select
                name="payloadMode"
                value={formData.payloadMode}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '8px',
                  backgroundColor: '#04060a',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                <option value="TT&C / Housekeeping">TT&C / Housekeeping Beacon (Highest Priority)</option>
                <option value="M17 Digital Voice & Data">M17 Open Digital Voice &amp; Data</option>
                <option value="Codec2 Low Bitrate Voice">Codec2 Low-Bitrate Speech Coding</option>
                <option value="SSTV Image Transmission">Robot36 Slow-Scan Television (SSTV)</option>
              </select>
            </div>

            {/* Field 6: Checkbox */}
            <div style={{
              marginBottom: '1.5rem',
              backgroundColor: '#04060a',
              padding: '0.85rem',
              borderRadius: '8px',
              border: errors.agreeTerms ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.08)'
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  style={{ marginTop: '2px', accentColor: '#38bdf8' }}
                />
                <span>
                  I agree to the <strong>Amateur Radio Open Protocol &amp; ITU Satellite Regulations</strong> for open telemetry access. <span style={{ color: '#ef4444' }}>*</span>
                </span>
              </label>
              {errors.agreeTerms && (
                <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> {errors.agreeTerms}
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#00f0ff',
                color: '#04060a',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)'
              }}
            >
              <ShieldCheck size={18} /> Complete Registration &amp; Initialize Node
            </button>
          </form>

          {/* Right Column: Live Status & Output Console */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Live State Matrix */}
            <div style={{
              backgroundColor: '#04060a',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                // GROUND NODE VALIDATION MATRIX
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: formData.name.trim() ? '#34d399' : '#64748b' }}>
                  {formData.name.trim() ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  <span>Name: {formData.name.trim() ? `"${formData.name}"` : 'Pending'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: formData.email.includes('@') ? '#34d399' : '#64748b' }}>
                  {formData.email.includes('@') ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  <span>Email: {formData.email.includes('@') ? `Valid (${formData.email})` : 'Missing "@"'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: formData.password.length >= 6 ? '#34d399' : '#64748b' }}>
                  {formData.password.length >= 6 ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  <span>Passcode: {formData.password.length} / 6 chars {formData.password.length >= 6 ? '(OK)' : ''}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: formData.country ? '#34d399' : '#64748b' }}>
                  {formData.country ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  <span>Station Node: {formData.country ? 'Selected' : 'Unselected'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: formData.agreeTerms ? '#34d399' : '#64748b' }}>
                  {formData.agreeTerms ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  <span>ITU Compliance: {formData.agreeTerms ? 'Accepted' : 'Pending'}</span>
                </div>
              </div>
            </div>

            {/* Submission Result */}
            {submittedData ? (
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '12px',
                padding: '1.25rem',
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={16} /> NODE REGISTERED &amp; PROVISIONED
                </div>
                <div style={{ fontSize: '0.78rem', color: '#a7f3d0', lineHeight: '1.6' }}>
                  <div><strong>Callsign:</strong> {submittedData.callsign}</div>
                  <div><strong>Operator:</strong> {submittedData.name}</div>
                  <div><strong>Station:</strong> {submittedData.country}</div>
                  <div><strong>Telemetry Mode:</strong> {submittedData.payloadMode}</div>
                  <div><strong>Timestamp:</strong> {submittedData.timestamp}</div>
                </div>

                <Link
                  to="/telemetry"
                  style={{
                    marginTop: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#38bdf8',
                    textDecoration: 'none',
                    fontSize: '0.82rem',
                    fontWeight: '600'
                  }}
                >
                  Enter Telemetry Command Center <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#04060a',
                border: '1px dashed rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '1.25rem',
                color: '#64748b',
                fontSize: '0.78rem',
                lineHeight: '1.6'
              }}>
                Complete the ground station registration fields to initialize your orbital telemetry access and generate a verified amateur radio station callsign.
              </div>
            )}
          </div>
        </div>

        {/* Existing Operator Sign In Link */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#94a3b8'
        }}>
          Already registered as an orbital operator?{' '}
          <Link to="/login" style={{ color: '#38bdf8', fontWeight: '600', textDecoration: 'none' }}>
            Sign in to Command Gateway &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
