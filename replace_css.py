import os

replacements = {
    'className="program-section"': 'className="py-[80px] px-[5vw] bg-white"',
    'className="program-section program-section-alt"': 'className="py-[80px] px-[5vw] bg-slate-50"',
    'className="program-two-col"': 'className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[34px]"',
    'className="section-label"': 'className="inline-flex items-center gap-[6px] text-[0.72rem] font-semibold tracking-[2px] uppercase text-sky-500 mb-[14px] before:content-[\'_\'] before:block before:w-[18px] before:h-[1.5px] before:bg-sky-500 before:rounded-[2px] before:text-transparent"',
    'className="section-title"': 'className="font-display text-[clamp(1.9rem,3.5vw,2.8rem)] font-bold leading-[1.2] tracking-[-0.3px] text-slate-900 mb-4"',
    'className="section-title section-title-light"': 'className="font-display text-[clamp(1.9rem,3.5vw,2.8rem)] font-bold leading-[1.2] tracking-[-0.3px] text-white mb-4"',
    'className="section-sub"': 'className="text-[1.05rem] leading-[1.7] text-slate-500 max-w-[540px]"',
    'className="bullets"': 'className="mt-[14px] flex flex-col gap-[10px] text-slate-500 leading-[1.6]"',
    'className="accordion"': 'className="flex flex-col gap-[12px] mt-[14px]"',
    'className="curriculum-item"': 'className="bg-white border border-slate-200 rounded-[12px] p-[12px_14px] marker:text-slate-400 [&_summary]:cursor-pointer [&_summary]:font-display [&_summary]:font-bold"',
    'className="faq-item"': 'className="bg-white border border-slate-200 rounded-[12px] p-[12px_14px] marker:text-slate-400 [&_summary]:cursor-pointer [&_summary]:font-display [&_summary]:font-bold [&_p]:mt-[10px] [&_p]:text-slate-500 [&_p]:leading-[1.6]"',
    'className="curriculum-list"': 'className="mt-[10px] pl-[40px] text-slate-500 list-disc [&_li]:text-slate-500 [&_li]:leading-[1.5] [&_li]:text-[0.9rem] [&_li]:mb-[6px]"'
}

files_to_process = [
    'src/components/features/ProgramOutcomeSection/ProgramOutcomeSection.tsx',
    'src/components/features/CourseHeroSection/CourseHeroSection.tsx',
    'src/components/features/CareerSupportSection/CareerSupportSection.tsx',
    'src/_pages-legacy/course-detail/CourseDetail.page.tsx'
]

for filepath in files_to_process:
    full_path = os.path.join(os.getcwd(), filepath)
    if os.path.exists(full_path):
        with open(full_path, 'r') as f:
            content = f.read()
        
        for old, new in replacements.items():
            content = content.replace(old, new)
            
        with open(full_path, 'w') as f:
            f.write(content)
        print(f"Processed {filepath}")
    else:
        print(f"Not found: {filepath}")
