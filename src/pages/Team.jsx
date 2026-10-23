import React from 'react';
import { Users, GraduationCap, Cpu, Radio, Shield, Award } from 'lucide-react';

const facultyLeads = [
  {
    name: 'Dr. Umesh Shinde',
    role: 'Faculty Co-Lead & Principal Investigator',
    institution: 'KJSIT Mumbai',
    dept: 'Department of Basic Science & Humanities',
    focus: 'Orbital Mechanics, GMAT / STK Trajectory Modeling, Ground Station Operations',
    color: '#00f0ff',
  },
  {
    name: 'Dr. Shailesh Nikam',
    role: 'Faculty Co-Lead & Structural Director',
    institution: 'KJSSE Mumbai',
    dept: 'Department of Mechanical Engineering',
    focus: 'SomaiyaPod Deployer Kinematics, Thermal Vacuum & Vibration Testing (ETL)',
    color: '#10b981',
  },
];

const studentTeams = [
  {
    subsystem: 'AI & Data Science Subsystem',
    role: 'Software & Onboard Compute',
    desc: 'Developing on-device neural routing that dynamically prioritizes emergency TT&C beacons, SSTV image bursts, and Codec2 voice frames based on real-time solar battery SoC and link SNR.',
    icon: Cpu,
    color: '#00f0ff',
  },
  {
    subsystem: 'EXTC & Electronics Subsystem',
    role: 'Communications & Antennas',
    desc: 'Engineering the sub-watt UHF/VHF radio front-end supporting M17 4FSK digital protocol, low-bitrate Codec2 voice compression, Robot36 SSTV imaging, and continuous AX.25 telemetry beacons.',
    icon: Radio,
    color: '#f59e0b',
  },
  {
    subsystem: 'Mechanical & RAI Subsystem',
    role: 'Structural & Thermal Engineering',
    desc: 'Designing the 6061-T6 aluminum PocketQube chassis, dual-spring ejection system, burn-wire thermal release latches, and qualifying mechanical tolerances against PSLV launch loads.',
    icon: Shield,
    color: '#10b981',
  },
];

const mono = { fontFamily: 'JetBrains Mono, monospace' };

// Reusable section heading: icon, title and one-line description.
function SectionHeading({ icon, title, children }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
        {icon}
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h2>
      </div>
      <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0 0 1.25rem 0' }}>{children}</p>
    </>
  );
}

// Reusable card: coloured icon box, name, role line, and any children below.
function PersonCard({ icon: Icon, color, name, nameSize, role, children }) {
  return (
    <div style={{ backgroundColor: '#04060a', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: `${color}15`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
          <Icon size={20} />
        </div>
        <div>
          <div style={{ fontWeight: '700', fontSize: nameSize, color: '#f8fafc' }}>{name}</div>
          <div style={{ ...mono, fontSize: '0.76rem', color, fontWeight: '600' }}>{role}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function Team() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <SectionHeading icon={<Award size={18} color="#00f0ff" />} title="Mission Direction & Faculty Leadership">
          Inter-collegiate space mission initiative supervised by leading faculty researchers across K. J. Somaiya Institute of Technology (KJSIT) and K. J. Somaiya College of Engineering (KJSSE).
        </SectionHeading>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {facultyLeads.map((lead) => (
            <PersonCard key={lead.name} icon={GraduationCap} color={lead.color} name={lead.name} nameSize="1.05rem" role={lead.role}>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                {lead.dept} &bull; <strong style={{ color: '#f8fafc' }}>{lead.institution}</strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem' }}>
                {lead.focus}
              </div>
            </PersonCard>
          ))}
        </div>
      </div>

      <div>
        <SectionHeading icon={<Users size={18} color="#10b981" />} title="Multidisciplinary Student Subsystems">
          Student engineers collaborate across IT, Computer Engineering, AI &amp; Data Science, EXTC, and Robotics &amp; AI.
        </SectionHeading>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {studentTeams.map((team) => (
            <PersonCard key={team.subsystem} icon={team.icon} color={team.color} name={team.subsystem} nameSize="0.96rem" role={team.role}>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.55 }}>{team.desc}</div>
            </PersonCard>
          ))}
        </div>
      </div>
    </div>
  );
}
