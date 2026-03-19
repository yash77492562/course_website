import { SectionLabel } from '@/ui/SectionLabel/SectionLabel';
import { SectionTitle } from '@/ui/SectionTitle/SectionTitle';
import { ProgramCard } from '@/ui/ProgramCard/ProgramCard';
import type { ProgramsSectionProps } from '@/types/program/types';

export function ProgramsSection({ programs }: ProgramsSectionProps) {
  return (
    <section 
      style={{
        background: '#ffffff',
        padding: '100px 5vw'
      }}
      id="programs"
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '56px',
        gap: '24px',
        flexWrap: 'wrap'
      }}>
        <div>
          <SectionLabel>Training Programmes</SectionLabel>
          <SectionTitle>
            Purpose-Built for<br />Data Careers
          </SectionTitle>
        </div>
        <p style={{
          fontSize: '1.05rem',
          lineHeight: '1.7',
          color: '#64748b',
          maxWidth: '540px',
          textAlign: 'right'
        }}>
          Each programme is designed with industry partners and led by practitioners with real-world experience in data roles.
        </p>
      </div>

      {/* Programs Grid - Force 3 columns in one row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px'
      }}>
        {programs.map((program) => (
          <ProgramCard key={program.title} program={program} />
        ))}
      </div>
    </section>
  );
}