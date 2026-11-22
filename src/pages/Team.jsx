import React from 'react';
import { Users, GraduationCap, Cpu, Radio, Shield, Award, Sparkles } from 'lucide-react';

export default function Team() {
  const facultyLeads = [
    {
      name: 'Dr. Umesh Shinde',
      role: 'Faculty Co-Lead & Principal Investigator',
      institution: 'KJSIT Mumbai',
      dept: 'Department of Basic Science & Humanities',
      focus: 'Orbital Mechanics, GMAT / STK Trajectory Modeling, Ground Station Operations',
      icon: GraduationCap,
      color: '#00f0ff'
    },
    {
      name: 'Dr. Shailesh Nikam',
      role: 'Faculty Co-Lead & Structural Director',
      institution: 'KJSSE Mumbai',
      dept: 'Department of Mechanical Engineering',
      focus: 'SomaiyaPod Deployer Kinematics, Thermal Vacuum & Vibration Testing (ETL)',
      icon: GraduationCap,
      color: '#10b981'
    }
  ];

  const studentTeams = [
    {
      subsystem: 'AI & Data Science Subsystem',
      dept: 'Autonomous Edge AI Routing & INT8 Quantization',
      role: 'Software & Onboard Compute',
      desc: 'Developing on-device neural routing that dynamically prioritizes emergency TT&C beacons, SSTV image bursts, and Codec2 voice frames based on real-time solar battery SoC and link SNR.',
      icon: Cpu,
      color: '#00f0ff'
    },
    {
      subsystem: 'EXTC & Electronics Subsystem',
      dept: 'Multi-Mode RF Transceiver Architecture',
      role: 'Communications & Antennas',
      desc: 'Engineering the sub-watt UHF/VHF radio front-end supporting M17 4FSK digital protocol, low-bitrate Codec2 voice compression, Robot36 SSTV imaging, and continuous AX.25 telemetry beacons.',
      icon: Radio,
      color: '#f59e0b'
    },
    {
      subsystem: 'Mechanical & RAI Subsystem',
      dept: 'SomaiyaPod Separation Mechanism & Chassis',
      role: 'Structural & Thermal Engineering',
      desc: 'Designing the 6061-T6 aluminum PocketQube chassis, dual-spring ejection system, burn-wire thermal release latches, and qualifying mechanical tolerances against PSLV launch loads.',
      icon: Shield,
      color: '#10b981'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Section 1: Faculty Leadership */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <Award size={18} color="#00f0ff" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
            Mission Direction &amp; Faculty Leadership
          </h2>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0 0 1.25rem 0' }}>
          Inter-collegiate space mission initiative supervised by leading faculty researchers across K. J. Somaiya Institute of Technology (KJSIT) and K. J. Somaiya College of Engineering (KJSSE).
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {facultyLeads.map((lead, index) => {
            const Icon = lead.icon;
            return (
              <div
                key={index}
                style={{
                  backgroundColor: '#04060a',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 240, 255, 0.08)',
                    border: `1px solid ${lead.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: lead.color,
                    flexShrink: 0
                  }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#f8fafc' }}>{lead.name}</div>
                    <div style={{ fontSize: '0.78rem', color: lead.color, fontWeight: '600', fontFamily: 'JetBrains Mono, monospace' }}>
                      {lead.role}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                  {lead.dept} &bull; <strong style={{ color: '#f8fafc' }}>{lead.institution}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem' }}>
                  {lead.focus}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Multidisciplinary Student Engineering Divisions */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <Users size={18} color="#10b981" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
            Multidisciplinary Student Subsystems
          </h2>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0 0 1.25rem 0' }}>
          Student engineers collaborate across IT, Computer Engineering, AI &amp; Data Science, EXTC, and Robotics &amp; AI.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {studentTeams.map((team, index) => {
            const Icon = team.icon;
            return (
              <div
                key={index}
                style={{
                  backgroundColor: '#04060a',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: `${team.color}15`,
                    border: `1px solid ${team.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: team.color,
                    flexShrink: 0
                  }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.96rem', color: '#f8fafc' }}>{team.subsystem}</div>
                    <div style={{ fontSize: '0.75rem', color: team.color, fontFamily: 'JetBrains Mono, monospace' }}>
                      {team.role}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.55 }}>
                  {team.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
