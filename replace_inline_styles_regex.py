import os
import re

files_to_process = [
    'src/page-components/PurchaseHistory/PurchaseHistoryPage.tsx',
    'src/page-components/MyCourses/MyCoursesPage.tsx',
    'src/page-components/MyCourses/CourseModulesPage.tsx',
    'src/page-components/MyCourses/ModuleLessonsPage.tsx',
    'src/_pages-legacy/video-player/VideoPlayer.page.tsx',
    'src/_pages-legacy/course-detail/CourseDetail.page.tsx',
    'src/components/features/CourseAccess/CourseAccessControl.tsx'
]

replacements = [
    (r"style=\{\{\s*display:\s*'flex',\s*alignItems:\s*'center',\s*gap:\s*'8px'\s*\}\}", 'className="flex items-center gap-[8px]"'),
    (r"style=\{\{\s*display:\s*'flex',\s*flexDirection:\s*'column',\s*gap:\s*'12px'\s*\}\}", 'className="flex flex-col gap-[12px]"'),
    (r"style=\{\{\s*display:\s*'flex',\s*flexDirection:\s*'column',\s*alignItems:\s*'center',\s*gap:\s*'14px'\s*\}\}", 'className="flex flex-col items-center gap-[14px]"'),
    (r"style=\{\{\s*padding:\s*'120px 5vw',\s*textAlign:\s*'center'\s*\}\}", 'className="py-[120px] px-[5vw] text-center"'),
    (r"style=\{\{\s*paddingTop:\s*'0px'\s*\}\}", 'className="pt-0"'),
    (r"style=\{\{\s*paddingTop:\s*'68px'\s*\}\}", 'className="pt-[68px]"'),
    (r"style=\{\{\s*fontSize:\s*'64px',\s*marginBottom:\s*'24px'\s*\}\}", 'className="text-[64px] mb-[24px]"'),
    (r"style=\{\{\s*width:\s*'24px',\s*height:\s*'24px'\s*\}\}", 'className="w-[24px] h-[24px]"'),
    (r"style=\{\{\s*padding:\s*'32px'\s*\}\}", 'className="p-[32px]"'),
    (r"style=\{\{\s*color:\s*'rgba\(255,255,255,0\.7\)',\s*fontSize:\s*'15px',\s*marginBottom:\s*'32px',\s*lineHeight:\s*1\.6\s*\}\}", 'className="text-white/70 text-[15px] mb-[32px] leading-[1.6]"'),
    # CourseAccessControl specific styles
    (r"style=\{\{\s*margin:\s*'40px 0',\s*padding:\s*'40px',\s*backgroundColor:\s*'#050d1f',\s*borderRadius:\s*'16px',\s*border:\s*'1px solid rgba\(14,165,233,0\.2\)',\s*textAlign:\s*'center',\s*position:\s*'relative',\s*overflow:\s*'hidden'\s*\}\}", 'className="my-[40px] p-[40px] bg-[#050d1f] rounded-2xl border border-sky-500/20 text-center relative overflow-hidden"'),
    (r"style=\{\{\s*position:\s*'absolute',\s*top:\s*'-100px',\s*left:\s*'50%',\s*transform:\s*'translateX\(-50%\)',\s*width:\s*'300px',\s*height:\s*'300px',\s*background:\s*'radial-gradient\(circle, rgba\(14,165,233,0\.1\) 0%, rgba\(5,13,31,0\) 70%\)',\s*borderRadius:\s*'50%'\s*\}\}", 'className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(14,165,233,0.1)_0%,rgba(5,13,31,0)_70%)] rounded-full"'),
    (r"style=\{\{\s*position:\s*'relative',\s*zIndex:\s*1\s*\}\}", 'className="relative z-10"'),
    (r"style=\{\{\s*color:\s*'#fff',\s*fontFamily:\s*'var\(--font-syne\)',\s*fontSize:\s*'28px',\s*fontWeight:\s*'700',\s*marginBottom:\s*'12px'\s*\}\}", 'className="text-white font-display text-[28px] font-bold mb-[12px]"'),
    (r"style=\{\{\s*color:\s*'rgba\(255,255,255,0\.7\)',\s*fontSize:\s*'16px',\s*lineHeight:\s*'1\.6',\s*maxWidth:\s*'500px',\s*margin:\s*'0 auto'\s*\}\}", 'className="text-white/70 text-[16px] leading-[1.6] max-w-[500px] mx-auto"'),
    (r"style=\{\{\s*marginTop:\s*'32px',\s*padding:\s*'24px',\s*backgroundColor:\s*'rgba\(255,255,255,0\.03\)',\s*borderRadius:\s*'12px',\s*border:\s*'1px solid rgba\(255,255,255,0\.05\)'\s*\}\}", 'className="mt-[32px] p-[24px] bg-white/5 rounded-xl border border-white/5"'),
    (r"style=\{\{\s*display:\s*'flex',\s*alignItems:\s*'center',\s*justifyContent:\s*'center',\s*gap:\s*'8px',\s*marginBottom:\s*'16px'\s*\}\}", 'className="flex items-center justify-center gap-[8px] mb-[16px]"'),
    (r"style=\{\{\s*color:\s*'#fff',\s*fontWeight:\s*'600',\s*fontSize:\s*'18px'\s*\}\}", 'className="text-white font-semibold text-[18px]"'),
    (r"style=\{\{\s*display:\s*'flex',\s*justifyContent:\s*'center',\s*gap:\s*'32px',\s*flexWrap:\s*'wrap'\s*\}\}", 'className="flex justify-center gap-[32px] flex-wrap"'),
    (r"style=\{\{\s*display:\s*'flex',\s*alignItems:\s*'center',\s*gap:\s*'8px',\s*color:\s*'rgba\(255,255,255,0\.7\)',\s*fontSize:\s*'15px'\s*\}\}", 'className="flex items-center gap-[8px] text-white/70 text-[15px]"')
]

for filepath in files_to_process:
    full_path = os.path.join(os.getcwd(), filepath)
    if os.path.exists(full_path):
        with open(full_path, 'r') as f:
            content = f.read()
        
        for old_regex, new_val in replacements:
            content = re.sub(old_regex, new_val, content)
            
        with open(full_path, 'w') as f:
            f.write(content)
        print(f"Processed {filepath}")
