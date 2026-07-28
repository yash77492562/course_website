import os
import re

files_to_process = [
    'src/_pages-legacy/video-player/VideoPlayer.page.tsx',
    'src/page-components/PurchaseHistory/PurchaseHistoryPage.tsx',
    'src/page-components/MyCourses/MyCoursesPage.tsx',
    'src/page-components/MyCourses/CourseModulesPage.tsx',
    'src/page-components/MyCourses/ModuleLessonsPage.tsx'
]

def process_file(filepath):
    full_path = os.path.join(os.getcwd(), filepath)
    if not os.path.exists(full_path):
        print(f"Not found: {filepath}")
        return

    with open(full_path, 'r') as f:
        content = f.read()

    # Generic replaces
    content = content.replace("style={{ height: 'calc(100vh - 68px)', marginTop: '68px' }}", "className=\"h-[calc(100vh-68px)] mt-[68px]\"")
    content = content.replace('className="flex flex-col bg-gray-900" className="h-[calc(100vh-68px)] mt-[68px]"', 'className="flex flex-col bg-gray-900 h-[calc(100vh-68px)] mt-[68px]"')
    content = content.replace('className="video-player-page flex bg-gray-900" className="h-[calc(100vh-68px)] mt-[68px]"', 'className="video-player-page flex bg-gray-900 h-[calc(100vh-68px)] mt-[68px]"')
    
    # Common layout styles
    content = content.replace("style={{\n          minHeight: '100vh',\n          backgroundColor: '#050d1f',\n          display: 'flex',\n          alignItems: 'center',\n          justifyContent: 'center'\n        }}", "className=\"min-h-screen bg-[#050d1f] flex items-center justify-center\"")
    content = content.replace("style={{ color: 'rgba(255,255,255,0.7)' }}", "className=\"text-white/70\"")
    content = content.replace("style={{\n        minHeight: '100vh',\n        backgroundColor: '#050d1f',\n        position: 'relative'\n      }}", "className=\"min-h-screen bg-[#050d1f] relative\"")
    content = content.replace("style={{ padding: '80px 5vw 80px' }}", "className=\"py-[80px] px-[5vw]\"")
    content = content.replace("style={{ maxWidth: '1200px', margin: '0 auto' }}", "className=\"max-w-[1200px] mx-auto\"")
    content = content.replace("style={{ maxWidth: '900px', margin: '0 auto' }}", "className=\"max-w-[900px] mx-auto\"")
    content = content.replace("style={{ marginBottom: '50px' }}", "className=\"mb-[50px]\"")
    content = content.replace("style={{ marginBottom: '48px' }}", "className=\"mb-[48px]\"")
    content = content.replace("style={{ marginBottom: '40px' }}", "className=\"mb-[40px]\"")
    
    # Specific elements
    content = content.replace("style={{\n                display: 'inline-block',\n                padding: '8px 16px',\n                backgroundColor: 'rgba(14, 165, 233, 0.1)',\n                color: '#0ea5e9',\n                borderRadius: '100px',\n                fontSize: '0.85rem',\n                fontWeight: '600',\n                letterSpacing: '1px',\n                marginBottom: '16px',\n                textTransform: 'uppercase'\n              }}", "className=\"inline-block py-2 px-4 bg-sky-500/10 text-sky-500 rounded-full text-[0.85rem] font-semibold tracking-[1px] mb-4 uppercase\"")
    content = content.replace("style={{\n                fontSize: 'clamp(2rem, 4vw, 3rem)',\n                fontWeight: '700',\n                color: '#fff',\n                marginBottom: '16px',\n                fontFamily: 'var(--font-syne)',\n                letterSpacing: '-0.5px'\n              }}", "className=\"text-[clamp(2rem,4vw,3rem)] font-bold text-white mb-4 font-display tracking-[-0.5px]\"")
    content = content.replace("style={{\n                fontSize: '1.1rem',\n                color: 'rgba(255,255,255,0.7)',\n                maxWidth: '600px',\n                margin: '0 auto',\n                lineHeight: '1.6'\n              }}", "className=\"text-[1.1rem] text-white/70 max-w-[600px] mx-auto leading-[1.6]\"")
    
    content = content.replace("style={{\n                  display: 'grid',\n                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',\n                  gap: '24px'\n                }}", "className=\"grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-[24px]\"")
    
    # Empty states
    content = content.replace("style={{\n                  textAlign: 'center',\n                  padding: '60px 20px',\n                  backgroundColor: 'rgba(255,255,255,0.02)',\n                  borderRadius: '16px',\n                  border: '1px solid rgba(255,255,255,0.05)'\n                }}", "className=\"text-center py-[60px] px-[20px] bg-white/2 rounded-2xl border border-white/5\"")
    content = content.replace("style={{\n                    fontSize: '48px',\n                    marginBottom: '16px'\n                  }}", "className=\"text-[48px] mb-4\"")
    content = content.replace("style={{\n                    fontSize: '1.25rem',\n                    color: '#fff',\n                    fontWeight: '600',\n                    marginBottom: '8px'\n                  }}", "className=\"text-xl text-white font-semibold mb-2\"")
    content = content.replace("style={{\n                    color: 'rgba(255,255,255,0.6)',\n                    marginBottom: '24px'\n                  }}", "className=\"text-white/60 mb-6\"")
    
    with open(full_path, 'w') as f:
        f.write(content)
    print(f"Processed {filepath}")

for fp in files_to_process:
    process_file(fp)
